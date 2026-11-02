// Validates every topic's concept map against its markdown and prints a
// coverage report. Exits non-zero on any error, so content sessions can run
// `npm run validate:content` before finishing.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

import conceptMaps from '../src/conceptMaps.js'
import { validateConceptMap } from '../src/lib/conceptValidation.js'
import { getMarkdownSections } from '../src/lib/markdownParse.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = path.join(ROOT, 'content')

async function readSections(file) {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: data, sections: getMarkdownSections(content).sections }
}

const files = (await fs.readdir(CONTENT_DIR)).sort()
const errors = []
const coverage = []
const seenTopics = new Set()

for (const file of files) {
  if (!file.endsWith('.md') || file.endsWith('_snippets.md')) continue

  const { frontmatter, sections } = await readSections(file)
  const topicId = frontmatter.id || file.replace(/\.md$/, '').replace(/_/g, '-')
  const snippetsFile = file.replace(/\.md$/, '_snippets.md')
  const snippetSections = files.includes(snippetsFile)
    ? (await readSections(snippetsFile)).sections
    : []
  const concepts = conceptMaps[topicId] || {}
  seenTopics.add(topicId)

  validateConceptMap({ concepts, sections, snippetSections }).forEach((error) =>
    errors.push(`${topicId}: ${error}`),
  )

  const questionSections = sections.filter((s) => s.questionRows.length > 0)
  coverage.push({
    topic: topicId,
    sections: questionSections.length,
    withMap: questionSections.filter((s) => concepts[s.headingText]).length,
    withSignals: questionSections.filter(
      (s) => concepts[s.headingText]?.signals?.length,
    ).length,
  })
}

Object.keys(conceptMaps).forEach((topicId) => {
  if (!seenTopics.has(topicId)) {
    errors.push(`${topicId}: registered in src/conceptMaps.js but has no content file`)
  }
})

console.table(coverage)

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) found:`)
  errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

console.log('\nConcept maps are valid.')
