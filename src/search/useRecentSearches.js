// localStorage-backed list of recent non-empty queries. Cap of 8, MRU first.

import { useCallback, useState } from 'react'

const KEY = 'dsa-platform:recent-searches'
const CAP = 8

function read() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage unavailable */
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState(read)

  const push = useCallback((rawQuery) => {
    const q = String(rawQuery || '').trim()
    if (q.length < 2) return
    setRecent((cur) => {
      const next = [q, ...cur.filter((x) => x !== q)].slice(0, CAP)
      write(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setRecent([])
    write([])
  }, [])

  return { recent, push, clear }
}
