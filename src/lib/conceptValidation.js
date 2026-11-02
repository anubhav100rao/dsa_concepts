// Checks one topic's concept map against its markdown. A wrong key or field
// name fails silently at runtime (the map or field just doesn't show), so
// scripts/validateContent.mjs runs this over every topic. Pure ESM.
import { makeQuestionId } from './markdownParse.js'

const LIST_FIELDS = ['signals', 'notThis', 'concepts', 'pitfalls', 'pointsToPonder']
const STRING_FIELDS = ['crux', 'code', 'complexity', 'snippet']
const KNOWN_FIELDS = new Set([...LIST_FIELDS, ...STRING_FIELDS, 'example', 'practice'])

function validateEntry(entry, section, snippetSlugs) {
  const errors = []

  Object.keys(entry).forEach((field) => {
    if (!KNOWN_FIELDS.has(field)) errors.push(`unknown field "${field}"`)
  })
  LIST_FIELDS.forEach((field) => {
    if (field in entry && !Array.isArray(entry[field])) {
      errors.push(`"${field}" must be a list`)
    }
  })
  STRING_FIELDS.forEach((field) => {
    if (field in entry && typeof entry[field] !== 'string') {
      errors.push(`"${field}" must be a string`)
    }
  })

  if (entry.example && !entry.example.problem) {
    errors.push('"example" needs a "problem"')
  }
  if (entry.example && !Array.isArray(entry.example.walkthrough)) {
    errors.push('"example.walkthrough" must be a list')
  }

  const sectionQuestionIds = new Set(
    section.questionRows.map((cells) => makeQuestionId(cells)),
  )
  ;(entry.practice || []).forEach((leetcodeId) => {
    if (!sectionQuestionIds.has(`lc:${leetcodeId}`)) {
      errors.push(`practice LC ${leetcodeId} isn't in this section`)
    }
  })

  if (entry.snippet && !snippetSlugs.includes(entry.snippet)) {
    errors.push(`snippet "${entry.snippet}" doesn't exist in the snippets tab`)
  }

  return errors
}

// Returns a list of error strings; empty means the topic is valid.
export function validateConceptMap({ concepts, sections, snippetSections }) {
  const sectionsByHeading = new Map(
    sections.map((section) => [section.headingText, section]),
  )
  const snippetSlugs = snippetSections.map((section) => section.slug)

  return Object.entries(concepts).flatMap(([heading, entry]) => {
    const section = sectionsByHeading.get(heading)
    if (!section) return [`"${heading}": key doesn't match any section heading`]
    return validateEntry(entry, section, snippetSlugs).map(
      (error) => `"${heading}": ${error}`,
    )
  })
}
