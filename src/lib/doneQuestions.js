// Persistence for the done-questions map (question id → true). See
// makeQuestionId for the id format. Pure ESM, so it can run under node --test.
import { makeQuestionId } from './markdownParse.js'

export const DONE_QUESTIONS_STORAGE_KEY = 'dsa-platform:done-questions:v2'
const LEGACY_STORAGE_KEY = 'dsa-platform:done-questions'

// Legacy keys were per-topic: `topic:leetcodeId:problem name`, where the id
// could be `—` or several numbers (`729/731/732`).
export function migrateLegacyDoneQuestions(legacyQuestions) {
  const migrated = {}

  Object.entries(legacyQuestions).forEach(([legacyKey, isDone]) => {
    const [, leetcodeIds, ...nameParts] = legacyKey.split(':')
    if (!isDone || !leetcodeIds || nameParts.length === 0) return

    leetcodeIds.split('/').forEach((leetcodeId) => {
      migrated[makeQuestionId(['', nameParts.join(':'), leetcodeId])] = true
    })
  })

  return migrated
}

// The legacy entry is left in place as a backup.
export function loadDoneQuestions(storage) {
  const stored = storage.getItem(DONE_QUESTIONS_STORAGE_KEY)
  if (stored) return JSON.parse(stored)

  const legacy = storage.getItem(LEGACY_STORAGE_KEY)
  return legacy ? migrateLegacyDoneQuestions(JSON.parse(legacy)) : {}
}
