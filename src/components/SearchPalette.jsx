import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSearchIndex } from '../search/useSearchIndex'
import { parseQuery } from '../search/parseQuery'
import { highlight } from '../search/highlight'
import { useRecentSearches } from '../search/useRecentSearches'

// Result groups appear in this order. Each group is capped to keep one
// kind from drowning the others on broad queries.
const GROUPS = [
  { kind: 'question', label: 'Questions', limit: 6 },
  { kind: 'section', label: 'Concepts', limit: 4 },
  { kind: 'snippet', label: 'Snippets', limit: 4 },
  { kind: 'topic', label: 'Topics', limit: 4 },
]

const DIFFICULTY_FILTERS = ['Easy', 'Medium', 'Hard']

function buildResultUrl(doc) {
  if (doc.kind === 'topic') {
    return doc.topicId === 'home' ? '/' : `/topic/${doc.topicId}`
  }
  const base = `/topic/${doc.topicId}`
  const params = new URLSearchParams()
  if (doc.kind === 'question') {
    // `questionId` is the stable id MarkdownPage looks up via the data
    // attribute on each <tr>. Using `doc.id` would break scroll-to.
    params.set('q', doc.questionId || doc.id)
    if (doc.sectionSlug) params.set('section', doc.sectionSlug)
  } else if (doc.kind === 'section') {
    if (doc.sectionSlug) params.set('section', doc.sectionSlug)
    if (doc.hasConceptMap) params.set('concept', '1')
  } else if (doc.kind === 'snippet') {
    params.set('tab', 'snippets')
    if (doc.sectionSlug) params.set('section', doc.sectionSlug)
  }
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

function groupResults(results) {
  const byKind = new Map(GROUPS.map((g) => [g.kind, []]))
  for (const hit of results) {
    if (byKind.has(hit.kind)) byKind.get(hit.kind).push(hit)
  }
  // Flatten in GROUP order, capping each. Returns a flat selectable list
  // plus the index ranges per group so the renderer can draw headings.
  const flat = []
  const groups = []
  for (const g of GROUPS) {
    const items = byKind.get(g.kind).slice(0, g.limit)
    if (items.length === 0) continue
    groups.push({ ...g, start: flat.length, count: items.length })
    flat.push(...items)
  }
  return { flat, groups }
}

function difficultyClass(diff) {
  if (diff === 'Easy') return 'sp-diff easy'
  if (diff === 'Medium') return 'sp-diff medium'
  if (diff === 'Hard') return 'sp-diff hard'
  return 'sp-diff'
}

function ResultRow({ doc, query, active, onMouseEnter, onClick, isDone }) {
  return (
    <button
      type="button"
      className={`sp-result ${active ? 'active' : ''} ${isDone ? 'done' : ''}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {doc.kind === 'question' && (
        <>
          <span className="sp-result-icon">
            {isDone ? '✓' : doc.topicIcon || '•'}
          </span>
          <span className="sp-result-main">
            <span className="sp-result-title">
              {highlight(doc.problem || 'Untitled', query)}
              {doc.leetcodeId && (
                <span className="sp-result-lc">LC {doc.leetcodeId}</span>
              )}
            </span>
            <span className="sp-result-meta">
              <span>{doc.topicTitle}</span>
              {doc.sectionHeading && <span>· {doc.sectionHeading}</span>}
              {doc.tags && <span className="sp-result-tags">· {doc.tags}</span>}
            </span>
          </span>
          {doc.difficulty && (
            <span className={difficultyClass(doc.difficulty)}>
              {doc.difficulty}
            </span>
          )}
        </>
      )}

      {doc.kind === 'section' && (
        <>
          <span className="sp-result-icon">{doc.topicIcon || '§'}</span>
          <span className="sp-result-main">
            <span className="sp-result-title">
              {highlight(doc.heading, query)}
            </span>
            <span className="sp-result-meta">
              <span>{doc.topicTitle}</span>
              {doc.crux && (
                <span className="sp-result-crux">
                  · {highlight(doc.crux.slice(0, 140), query)}
                </span>
              )}
            </span>
          </span>
          {doc.hasConceptMap && <span className="sp-kind-pill">concept</span>}
        </>
      )}

      {doc.kind === 'snippet' && (
        <>
          <span className="sp-result-icon">⌨</span>
          <span className="sp-result-main">
            <span className="sp-result-title">
              {highlight(doc.snippetTitle, query)}
            </span>
            <span className="sp-result-meta">
              <span>{doc.topicTitle}</span>
              {doc.language && <span>· {doc.language}</span>}
            </span>
          </span>
          <span className="sp-kind-pill">snippet</span>
        </>
      )}

      {doc.kind === 'topic' && (
        <>
          <span className="sp-result-icon">{doc.topicIcon || '📄'}</span>
          <span className="sp-result-main">
            <span className="sp-result-title">
              {highlight(doc.topicTitle, query)}
            </span>
            <span className="sp-result-meta">Jump to topic</span>
          </span>
          <span className="sp-kind-pill">topic</span>
        </>
      )}
    </button>
  )
}

export default function SearchPalette({ open, onClose, doneQuestions }) {
  const { status, search, topicById } = useSearchIndex()
  const navigate = useNavigate()
  const location = useLocation()
  const { recent, push: pushRecent } = useRecentSearches()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [kindFilter, setKindFilter] = useState(null)
  const [difficultyFilter, setDifficultyFilter] = useState(null)
  const [hideDone, setHideDone] = useState(false)
  const [scopeToTopic, setScopeToTopic] = useState(false)

  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Topic we're currently viewing (if any) — used by the scope-to-topic toggle.
  const currentTopicId = useMemo(() => {
    const m = location.pathname.match(/^\/topic\/([^/?#]+)/)
    return m ? m[1] : null
  }, [location.pathname])

  // Reset state every time the palette opens. We use the "compare-to-last"
  // pattern (no effect) so React 19's set-state-in-effect rule stays happy.
  const [lastOpen, setLastOpen] = useState(open)
  if (lastOpen !== open) {
    setLastOpen(open)
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setKindFilter(null)
      setDifficultyFilter(null)
      setHideDone(false)
      setScopeToTopic(false)
    }
  }

  // Focus the input once the palette becomes visible.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 10)
    return () => clearTimeout(t)
  }, [open])

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const { text: parsedText, filters: parsedFilters } = useMemo(
    () => parseQuery(query),
    [query],
  )

  const effectiveFilters = useMemo(
    () => ({
      topicId:
        parsedFilters.topicId ||
        (scopeToTopic && currentTopicId !== 'home' ? currentTopicId : null),
      difficulty: parsedFilters.difficulty || difficultyFilter,
      kind: parsedFilters.kind || kindFilter,
    }),
    [parsedFilters, scopeToTopic, currentTopicId, difficultyFilter, kindFilter],
  )

  const rawResults = useMemo(() => {
    if (status !== 'ready') return []
    return search(parsedText, { filters: effectiveFilters, limit: 80 })
  }, [search, parsedText, effectiveFilters, status])

  const filteredResults = useMemo(() => {
    if (!hideDone) return rawResults
    return rawResults.filter(
      (doc) => doc.kind !== 'question' || !doneQuestions[doc.questionId],
    )
  }, [rawResults, hideDone, doneQuestions])

  const { flat, groups } = useMemo(
    () => groupResults(filteredResults),
    [filteredResults],
  )

  // Clamp the keyboard cursor whenever the result set changes. Derived
  // during render so we don't trip React 19's set-state-in-effect rule.
  const maxIndex = Math.max(0, flat.length - 1)
  const [lastMax, setLastMax] = useState(maxIndex)
  if (lastMax !== maxIndex) {
    setLastMax(maxIndex)
    if (activeIndex > maxIndex) setActiveIndex(maxIndex)
  }

  const commit = useCallback(
    (doc, opts = {}) => {
      if (!doc) return
      pushRecent(query)
      const url = buildResultUrl(doc)
      if (opts.newTab) {
        window.open(url, '_blank', 'noopener')
      } else {
        navigate(url)
        onClose()
      }
    },
    [navigate, onClose, pushRecent, query],
  )

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(flat.length - 1, i + 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(0, i - 1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(flat[activeIndex], { newTab: e.metaKey || e.ctrlKey })
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '.') {
      e.preventDefault()
      if (currentTopicId && currentTopicId !== 'home') {
        setScopeToTopic((v) => !v)
      }
      return
    }
    // ⌘1..⌘4 toggle kind filters.
    if ((e.metaKey || e.ctrlKey) && /^[1-4]$/.test(e.key)) {
      e.preventDefault()
      const target = GROUPS[Number(e.key) - 1]?.kind
      setKindFilter((cur) => (cur === target ? null : target))
    }
  }

  // Auto-scroll the active result into view.
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-sp-idx="${activeIndex}"]`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  const showEmptyState =
    parsedText.trim().length === 0 &&
    !effectiveFilters.topicId &&
    !effectiveFilters.difficulty &&
    !effectiveFilters.kind

  return createPortal(
    <div
      className="sp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sp-modal" onKeyDown={onKeyDown}>
        <div className="sp-search-bar">
          <span className="sp-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            className="sp-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            placeholder="Search problems, concepts, snippets…  ( @topic  #difficulty )"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="sp-kbd">Esc</kbd>
        </div>

        <div className="sp-filter-row">
          <div className="sp-filter-chips">
            <button
              type="button"
              className={`sp-chip ${!kindFilter ? 'active' : ''}`}
              onClick={() => setKindFilter(null)}
            >
              All
            </button>
            {GROUPS.map((g) => (
              <button
                type="button"
                key={g.kind}
                className={`sp-chip ${kindFilter === g.kind ? 'active' : ''}`}
                onClick={() =>
                  setKindFilter((cur) => (cur === g.kind ? null : g.kind))
                }
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="sp-filter-chips">
            {DIFFICULTY_FILTERS.map((d) => (
              <button
                type="button"
                key={d}
                className={`sp-chip sp-chip-diff ${d.toLowerCase()} ${
                  difficultyFilter === d ? 'active' : ''
                }`}
                onClick={() =>
                  setDifficultyFilter((cur) => (cur === d ? null : d))
                }
              >
                {d}
              </button>
            ))}
            <label className="sp-chip sp-chip-toggle">
              <input
                type="checkbox"
                checked={hideDone}
                onChange={(e) => setHideDone(e.target.checked)}
              />
              Hide done
            </label>
            {currentTopicId && currentTopicId !== 'home' && (
              <label className="sp-chip sp-chip-toggle">
                <input
                  type="checkbox"
                  checked={scopeToTopic}
                  onChange={(e) => setScopeToTopic(e.target.checked)}
                />
                Only {topicById.get(currentTopicId)?.title || 'this topic'}
              </label>
            )}
          </div>
        </div>

        <div className="sp-results" ref={listRef}>
          {status === 'loading' && (
            <div className="sp-empty">Loading search index…</div>
          )}
          {status === 'error' && (
            <div className="sp-empty">
              Couldn't load the search index. Try refreshing the page.
            </div>
          )}
          {status === 'ready' && showEmptyState && (
            <EmptyState
              recent={recent}
              onPick={(q) => {
                setQuery(q)
                setActiveIndex(0)
                inputRef.current?.focus()
              }}
            />
          )}
          {status === 'ready' && !showEmptyState && flat.length === 0 && (
            <div className="sp-empty">
              No matches. Try a different problem name, LC #, or pattern.
            </div>
          )}
          {status === 'ready' &&
            groups.map((g) => (
              <div className="sp-group" key={g.kind}>
                <div className="sp-group-heading">
                  {g.label}{' '}
                  <span className="sp-group-count">
                    {filteredResults.filter((r) => r.kind === g.kind).length}
                  </span>
                </div>
                {flat
                  .slice(g.start, g.start + g.count)
                  .map((doc, i) => {
                    const flatIdx = g.start + i
                    return (
                      <div key={doc.id} data-sp-idx={flatIdx}>
                        <ResultRow
                          doc={doc}
                          query={parsedText}
                          active={flatIdx === activeIndex}
                          onMouseEnter={() => setActiveIndex(flatIdx)}
                          onClick={() => commit(doc)}
                          isDone={
                            doc.kind === 'question' &&
                            Boolean(doneQuestions[doc.questionId])
                          }
                        />
                      </div>
                    )
                  })}
              </div>
            ))}
        </div>

        <div className="sp-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>⌘</kbd><kbd>↵</kbd> new tab</span>
          <span><kbd>⌘</kbd><kbd>1-4</kbd> kind</span>
          {currentTopicId && currentTopicId !== 'home' && (
            <span><kbd>⌘</kbd><kbd>.</kbd> scope</span>
          )}
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function EmptyState({ recent, onPick }) {
  return (
    <div className="sp-empty-state">
      {recent.length > 0 && (
        <div className="sp-empty-block">
          <div className="sp-empty-label">Recent</div>
          <div className="sp-empty-chips">
            {recent.map((q) => (
              <button
                type="button"
                key={q}
                className="sp-empty-chip"
                onClick={() => onPick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="sp-empty-block">
        <div className="sp-empty-label">Try</div>
        <div className="sp-empty-chips">
          {['two sum', 'dijkstra', '#hard sliding window', '@graphs bfs', 'monotonic stack', 'kadane'].map((q) => (
            <button
              type="button"
              key={q}
              className="sp-empty-chip"
              onClick={() => onPick(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <p className="sp-empty-hint">
        Tip: prefix with <code>@</code> for a topic (<code>@graphs</code>) or
        <code> # </code> for difficulty / kind (<code>#hard</code>,{' '}
        <code>#snippet</code>).
      </p>
    </div>
  )
}
