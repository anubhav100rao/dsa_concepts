// Shared markdown parsing helpers — used by both the runtime page
// (MarkdownPage.jsx) and the build-time search-index generator
// (scripts/buildSearchIndex.mjs). Pure ESM, no React, no Node-only APIs.

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

// Strip a leading YAML frontmatter block (between `---` fences) so the
// reader doesn't see "id: arrays / title: …" rendered as plain text. The
// frontmatter is used only at build time by buildSearchIndex.mjs.
export function stripFrontmatter(markdown) {
  const text = String(markdown || '')
  if (!text.startsWith('---')) return text
  const end = text.indexOf('\n---', 3)
  if (end === -1) return text
  // Skip past the trailing fence and any newline that follows it.
  let after = end + 4
  if (text[after] === '\n') after += 1
  return text.slice(after)
}

export function normalizeDifficulty(value) {
  const text = String(value || '').toLowerCase()
  const difficulties = []

  if (text.includes('easy')) difficulties.push('Easy')
  if (text.includes('medium') || text.includes('med')) difficulties.push('Medium')
  if (text.includes('hard')) difficulties.push('Hard')

  return difficulties
}

// Pipe-table row → array of trimmed cells, with the leading/trailing
// empty cells dropped. Returns null for non-table lines.
function parseTableRow(line) {
  const trimmed = line.trim()
  if (!trimmed.startsWith('|')) return null
  return trimmed
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim())
}

export function getQuestionRows(markdown) {
  return markdown
    .split('\n')
    .map(parseTableRow)
    .filter(Boolean)
    .filter((cells) => cells.length >= 4)
    .filter((cells) => cells[0] !== '#' && !cells[0].startsWith('---'))
    .filter((cells) => normalizeDifficulty(cells[cells.length - 1]).length > 0)
}

// Stable id matching the existing localStorage scheme used by the
// done-questions map (see App.jsx). Must stay byte-identical so the
// search palette and the question table agree.
export function makeQuestionId(topicId, cells) {
  const problem = cells[1] || 'unknown-problem'
  const leetcodeId = cells[2] || 'unknown-lc'
  return `${topicId}:${leetcodeId}:${problem}`.toLowerCase()
}

export function slugifyHeading(headingLine) {
  return String(headingLine)
    .replace(/^#+\s*/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Split markdown into an intro + array of `##` sections.
// Each section carries its question rows already parsed.
export function getMarkdownSections(markdown) {
  const lines = markdown.split('\n')
  const introLines = []
  const sections = []
  let currentSection = null

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (currentSection) sections.push(currentSection)
      currentSection = { heading: line, bodyLines: [] }
      return
    }
    if (currentSection) currentSection.bodyLines.push(line)
    else introLines.push(line)
  })

  if (currentSection) sections.push(currentSection)

  return {
    intro: introLines.join('\n'),
    sections: sections.map((section, index) => {
      const body = section.bodyLines.join('\n')
      const headingText = section.heading.replace(/^##\s+/, '').trim()
      return {
        id: `${index}-${section.heading}`,
        slug: slugifyHeading(section.heading),
        heading: section.heading,
        headingText,
        body,
        questionRows: getQuestionRows(body),
      }
    }),
  }
}

// Extract ``` fenced code blocks. Used by the snippet indexer.
// Returns [{ language, code }].
export function getCodeBlocks(body) {
  const blocks = []
  const lines = body.split('\n')
  let inFence = false
  let lang = ''
  let buf = []

  for (const line of lines) {
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) {
      if (inFence) {
        blocks.push({ language: lang, code: buf.join('\n') })
        inFence = false
        buf = []
        lang = ''
      } else {
        inFence = true
        lang = fence[1] || ''
      }
      continue
    }
    if (inFence) buf.push(line)
  }
  return blocks
}
