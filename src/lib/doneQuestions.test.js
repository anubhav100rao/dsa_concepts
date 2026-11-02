import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DONE_QUESTIONS_STORAGE_KEY,
  loadDoneQuestions,
  migrateLegacyDoneQuestions,
} from './doneQuestions.js'
import { makeQuestionId } from './markdownParse.js'

function fakeStorage(entries) {
  return { getItem: (key) => entries[key] ?? null }
}

test('makeQuestionId keys numbered rows by LeetCode number alone', () => {
  const plain = makeQuestionId(['1', 'Trapping Rain Water', '42', 'Hard'])
  const reworded = makeQuestionId([
    '9',
    'Trapping Rain Water (left/right max pointers)',
    '42',
    'Hard',
  ])
  assert.equal(plain, 'lc:42')
  assert.equal(reworded, 'lc:42')
})

test('makeQuestionId keys unnumbered rows by slugified name', () => {
  assert.equal(
    makeQuestionId(['18', 'Palindrome Check (classic)', '—', 'Easy']),
    'name:palindrome-check-classic',
  )
})

test('migration merges the same problem from different topics', () => {
  assert.deepEqual(
    migrateLegacyDoneQuestions({
      'arrays:42:trapping rain water': true,
      'greedy:42:trapping rain water (left max + right max)': true,
    }),
    { 'lc:42': true },
  )
})

test('migration keeps unnumbered problems, including colons in names', () => {
  assert.deepEqual(
    migrateLegacyDoneQuestions({
      'dynamic-programming:—:matrix chain multiplication (classic)': true,
      'graphs:—:euler: tour basics': true,
    }),
    {
      'name:matrix-chain-multiplication-classic': true,
      'name:euler-tour-basics': true,
    },
  )
})

test('migration marks every id of an old multi-id row', () => {
  assert.deepEqual(
    migrateLegacyDoneQuestions({
      'arrays:729/731/732:my calendar i / ii / iii': true,
    }),
    { 'lc:729': true, 'lc:731': true, 'lc:732': true },
  )
})

test('migration skips malformed and unset entries', () => {
  assert.deepEqual(
    migrateLegacyDoneQuestions({ garbage: true, 'arrays:1:two sum': false }),
    {},
  )
})

test('loadDoneQuestions migrates when only legacy data exists', () => {
  const storage = fakeStorage({
    'dsa-platform:done-questions': JSON.stringify({ 'arrays:1:two sum': true }),
  })
  assert.deepEqual(loadDoneQuestions(storage), { 'lc:1': true })
})

test('loadDoneQuestions prefers saved v2 data over legacy data', () => {
  const storage = fakeStorage({
    [DONE_QUESTIONS_STORAGE_KEY]: JSON.stringify({ 'lc:2': true }),
    'dsa-platform:done-questions': JSON.stringify({ 'arrays:1:two sum': true }),
  })
  assert.deepEqual(loadDoneQuestions(storage), { 'lc:2': true })
})

test('loadDoneQuestions starts empty for a new learner', () => {
  assert.deepEqual(loadDoneQuestions(fakeStorage({})), {})
})
