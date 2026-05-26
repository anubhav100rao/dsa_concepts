// One-shot: add YAML frontmatter to each content/*.md (non-snippet) so the
// generated contentManifest replaces the hand-curated src/topics.js. Safe to
// re-run — skips files that already have a frontmatter block.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = path.join(ROOT, 'content')

// Mirrors the original src/topics.js (which we are replacing). The `home`
// topic is synthesized by buildSearchIndex.mjs and is not listed here.
const FRONTMATTER = {
  'arrays.md': {
    id: 'arrays',
    title: 'Arrays',
    icon: '📊',
    description: 'Two pointers, sliding window, prefix sum, and more',
    problems: '400+',
    categories: '28',
    order: 10,
  },
  'binary_search.md': {
    id: 'binary-search',
    title: 'Binary Search',
    icon: '🔍',
    description: 'BS on answer, Kth element, matrix search',
    problems: '250+',
    categories: '25',
    order: 20,
  },
  'dynamic_programming.md': {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '🧩',
    description: 'Linear DP, bitmask, digit DP, game theory',
    problems: '300+',
    categories: '22',
    order: 30,
  },
  'graphs.md': {
    id: 'graphs',
    title: 'Graphs',
    icon: '🕸️',
    description: 'BFS, DFS, Dijkstra, Union-Find, MST, SCC',
    problems: '300+',
    categories: '30',
    order: 40,
  },
  'greedy.md': {
    id: 'greedy',
    title: 'Greedy Algorithms',
    icon: '🎯',
    description: 'Exchange argument, interval scheduling, regret-based',
    problems: '350+',
    categories: '25',
    order: 50,
  },
  'priority_queue.md': {
    id: 'priority-queue',
    title: 'Priority Queue / Heap',
    icon: '⛰️',
    description: 'Top-K, two heaps, Dijkstra, k-way merge',
    problems: '280+',
    categories: '25',
    order: 60,
  },
  'range_queries_segment_trees.md': {
    id: 'range-queries',
    title: 'Range Queries & Segment Trees',
    icon: '📐',
    description: "Prefix sum, BIT, segment tree, lazy propagation, Mo's",
    problems: '250+',
    categories: '18',
    order: 70,
  },
  'stack_queue.md': {
    id: 'stack-queue',
    title: 'Stack & Queue',
    icon: '📚',
    description: 'Monotonic stack, expression eval, BFS, deque',
    problems: '300+',
    categories: '25',
    order: 80,
  },
  'trees.md': {
    id: 'trees',
    title: 'Trees',
    icon: '🌳',
    description: 'Binary trees, BST, traversals, construction',
    problems: '300+',
    categories: '25',
    order: 90,
  },
  'tries.md': {
    id: 'tries',
    title: 'Trie (Prefix Tree)',
    icon: '🔤',
    description: 'Bitwise trie, Aho-Corasick, autocomplete',
    problems: '200+',
    categories: '20',
    order: 100,
  },
  'two_pointers_sliding_window.md': {
    id: 'two-pointers',
    title: 'Two Pointers & Sliding Window',
    icon: '👆',
    description: 'Opposite/same direction, fixed/variable window',
    problems: '350+',
    categories: '25',
    order: 110,
  },
}

function renderFrontmatter(meta) {
  const lines = ['---']
  for (const [k, v] of Object.entries(meta)) {
    // Strings that contain quotes or start with special chars get quoted.
    const needsQuote = typeof v === 'string' && /[:'"#&*!|>%@`]/.test(v)
    lines.push(`${k}: ${needsQuote ? JSON.stringify(v) : v}`)
  }
  lines.push('---', '')
  return lines.join('\n')
}

for (const [file, meta] of Object.entries(FRONTMATTER)) {
  const full = path.join(CONTENT_DIR, file)
  let text
  try {
    text = await fs.readFile(full, 'utf8')
  } catch {
    console.warn(`[frontmatter] skipping missing file: ${file}`)
    continue
  }
  if (text.startsWith('---\n')) {
    console.log(`[frontmatter] already has frontmatter: ${file}`)
    continue
  }
  await fs.writeFile(full, renderFrontmatter(meta) + text, 'utf8')
  console.log(`[frontmatter] wrote: ${file}`)
}
