// Pull `@topic` and `#difficulty` filters out of a free-text query so the
// rest can be handed to MiniSearch as plain text. Power users get terse
// scoping ("@graphs dijkstra", "#hard sliding"), everyone else just types.

const DIFFICULTY_ALIASES = {
  easy: 'Easy',
  e: 'Easy',
  medium: 'Medium',
  med: 'Medium',
  m: 'Medium',
  hard: 'Hard',
  h: 'Hard',
}

const KIND_ALIASES = {
  q: 'question',
  question: 'question',
  questions: 'question',
  s: 'snippet',
  snip: 'snippet',
  snippet: 'snippet',
  snippets: 'snippet',
  c: 'section',
  concept: 'section',
  concepts: 'section',
  section: 'section',
  sections: 'section',
  t: 'topic',
  topic: 'topic',
  topics: 'topic',
}

export function parseQuery(raw) {
  const tokens = String(raw || '').trim().split(/\s+/).filter(Boolean)
  const filters = { topicId: null, difficulty: null, kind: null }
  const rest = []

  for (const tok of tokens) {
    if (tok.startsWith('@') && tok.length > 1) {
      filters.topicId = tok.slice(1).toLowerCase()
      continue
    }
    if (tok.startsWith('#') && tok.length > 1) {
      const key = tok.slice(1).toLowerCase()
      if (DIFFICULTY_ALIASES[key]) {
        filters.difficulty = DIFFICULTY_ALIASES[key]
        continue
      }
      if (KIND_ALIASES[key]) {
        filters.kind = KIND_ALIASES[key]
        continue
      }
    }
    rest.push(tok)
  }

  return { text: rest.join(' '), filters }
}
