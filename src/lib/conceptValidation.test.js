import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateConceptMap } from './conceptValidation.js'

const sections = [
  {
    headingText: '1. Intervals',
    questionRows: [['1', 'Merge Intervals', '56', 'Medium']],
  },
]
const snippetSections = [{ slug: '3-merge-intervals' }]

function validate(concepts) {
  return validateConceptMap({ concepts, sections, snippetSections })
}

test('a valid entry has no errors', () => {
  const errors = validate({
    '1. Intervals': {
      crux: 'Sort first.',
      signals: ['merge overlapping'],
      example: { problem: 'Merge Intervals', lc: 56, walkthrough: ['Sort.'] },
      practice: [56],
      snippet: '3-merge-intervals',
    },
  })
  assert.deepEqual(errors, [])
})

test('flags a key that matches no heading', () => {
  const errors = validate({ '1. Interval': { crux: 'Sort first.' } })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /doesn't match any section heading/)
})

test('flags practice ids outside the section', () => {
  const errors = validate({ '1. Intervals': { practice: [56, 57] } })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /practice LC 57/)
})

test('flags a snippet slug that does not exist', () => {
  const errors = validate({ '1. Intervals': { snippet: 'nope' } })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /snippet "nope"/)
})

test('flags misspelled fields and wrong shapes', () => {
  const errors = validate({
    '1. Intervals': { signal: [], pitfalls: 'x', example: { lc: 56 } },
  })
  assert.equal(errors.length, 4)
})
