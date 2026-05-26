// Wrap query-matching substrings in <mark> spans for highlighted result
// rendering. Tokenizes the query the same way MiniSearch does so that the
// visual highlights line up with what actually scored the hit.

import { Fragment } from 'react'

function buildPattern(query) {
  const terms = String(query || '')
    .toLowerCase()
    .split(/[\s_\-./,;:|()[\]{}]+/)
    .filter((t) => t.length >= 2)
  if (terms.length === 0) return null
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`(${escaped.join('|')})`, 'gi')
}

export function highlight(text, query) {
  const str = String(text == null ? '' : text)
  const pattern = buildPattern(query)
  if (!pattern) return str
  const parts = str.split(pattern)
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="search-mark">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
