// Loads /search-index.json once, builds a MiniSearch instance, and exposes
// a stable `search(query, opts)` API. The index is cached on `window` so a
// remount of the palette doesn't re-fetch or re-tokenize.

import { useEffect, useState, useCallback, useMemo } from 'react'
import MiniSearch from 'minisearch'

const CACHE_KEY = '__dsaSearchIndexCache'

function tokenize(text) {
  // MiniSearch's default tokenizer splits on non-word chars; we additionally
  // split camelCase and snake_case so `twoSum` matches "two sum" and
  // `two_pointers` matches "two pointers".
  return String(text || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s_\-./,;:|()[\]{}]+/)
    .filter(Boolean)
}

function buildIndex(docs) {
  const ms = new MiniSearch({
    idField: 'id',
    fields: ['problem', 'leetcodeId', 'heading', 'snippetTitle', 'tags', 'topicTitle', 'crux', 'code', 'text'],
    storeFields: [
      'id', 'questionId', 'kind', 'topicId', 'topicTitle', 'topicIcon',
      'problem', 'leetcodeId', 'tags', 'difficulty',
      'heading', 'sectionHeading', 'sectionSlug', 'crux', 'hasConceptMap',
      'snippetTitle', 'language', 'code',
    ],
    tokenize,
    processTerm: (term) => term.toLowerCase(),
    searchOptions: {
      boost: {
        problem: 5,
        leetcodeId: 5,
        heading: 3,
        snippetTitle: 3,
        topicTitle: 2,
        tags: 2,
        crux: 1.5,
        text: 1,
      },
      prefix: (term) => term.length >= 2,
      fuzzy: (term) => (term.length >= 4 ? 0.2 : 0),
      combineWith: 'AND',
    },
  })
  // Defense-in-depth: even if the build script regresses and emits dupe
  // ids, drop them here so MiniSearch doesn't blow up and the palette
  // keeps working. Log a single warning so the regression is visible.
  const seen = new Set()
  const unique = []
  let dupes = 0
  for (const doc of docs) {
    if (seen.has(doc.id)) {
      dupes += 1
      continue
    }
    seen.add(doc.id)
    unique.push(doc)
  }
  if (dupes > 0) {
    console.warn(`[search] dropped ${dupes} docs with duplicate ids`)
  }
  ms.addAll(unique)
  return ms
}

export function useSearchIndex() {
  const [state, setState] = useState(() => {
    const cached = typeof window !== 'undefined' ? window[CACHE_KEY] : null
    return cached
      ? { status: 'ready', ...cached }
      : { status: 'loading', engine: null, topics: [], docsById: new Map() }
  })

  useEffect(() => {
    if (state.status === 'ready') return
    let cancelled = false

    fetch('/search-index.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((payload) => {
        if (cancelled) return
        const engine = buildIndex(payload.docs || [])
        const docsById = new Map((payload.docs || []).map((d) => [d.id, d]))
        const next = { engine, topics: payload.topics || [], docsById }
        window[CACHE_KEY] = next
        setState({ status: 'ready', ...next })
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[search] failed to load index:', err)
        setState({ status: 'error', engine: null, topics: [], docsById: new Map() })
      })

    return () => {
      cancelled = true
    }
  }, [state.status])

  const { engine, topics, docsById } = state

  const search = useCallback(
    (query, { filters = {}, limit = 60 } = {}) => {
      if (!engine) return []
      const trimmed = (query || '').trim()
      if (!trimmed && !filters.topicId && !filters.difficulty && !filters.kind) {
        return []
      }

      // When the user hasn't typed anything but has set a filter, fall back to
      // enumerating all docs that pass the filter. MiniSearch can't do an
      // "empty query → everything", so we walk docsById.
      let results
      if (!trimmed) {
        results = []
        for (const doc of docsById.values()) {
          if (filters.topicId && doc.topicId !== filters.topicId) continue
          if (filters.difficulty && doc.difficulty !== filters.difficulty) continue
          if (filters.kind && doc.kind !== filters.kind) continue
          results.push({ ...doc, score: 0 })
          if (results.length >= limit) break
        }
        return results
      }

      const raw = engine.search(trimmed, {
        filter: (doc) => {
          if (filters.topicId && doc.topicId !== filters.topicId) return false
          if (filters.difficulty && doc.difficulty !== filters.difficulty) return false
          if (filters.kind && doc.kind !== filters.kind) return false
          return true
        },
      })
      return raw.slice(0, limit).map((hit) => ({ ...hit, score: hit.score }))
    },
    [engine, docsById],
  )

  const topicById = useMemo(() => {
    const map = new Map()
    for (const t of topics) map.set(t.id, t)
    return map
  }, [topics])

  return { status: state.status, search, topics, topicById, docsById }
}
