// Build-time search index generator.
//
// Walks content/*.md, parses frontmatter into a topic manifest, and emits:
//   - src/generated/contentManifest.js    (topic list, replaces hand-curated topics.js)
//   - public/search-index.json            (search payload, fetched by the palette)
//
// Re-run on every dev .md change and on every production build. The Vite
// plugin in vite.config.js handles invocation; this file can also be run
// standalone:  node scripts/buildSearchIndex.mjs

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import matter from 'gray-matter'

import {
  getMarkdownSections,
  getCodeBlocks,
  makeQuestionId,
  slugifyHeading,
  normalizeDifficulty,
} from '../src/lib/markdownParse.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')
const GENERATED_DIR = path.join(ROOT, 'src', 'generated')

// The Home entry is purely navigational — there is no content/home.md.
// We synthesize it so Sidebar/HomePage keep working without a magic file.
const HOME_TOPIC = {
  id: 'home',
  title: 'Home',
  icon: '🏠',
  description: 'Overview & Study Guide',
  problems: '2,700+',
  categories: '225+',
  file: 'README.md',
  snippetsFile: null,
  order: 0,
}

const SNIPPETS_SUFFIX = '_snippets.md'

function isSnippetsFile(name) {
  return name.endsWith(SNIPPETS_SUFFIX)
}

function pairedBaseName(name) {
  return name.replace(SNIPPETS_SUFFIX, '.md')
}

async function readMarkdown(file) {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8')
  return matter(raw)
}

async function tryLoadConceptMaps() {
  // Best-effort load of src/conceptMaps.js. Failures are non-fatal — the
  // index simply omits concept-map text. This keeps the build robust if
  // a concept-map file has a syntax error.
  try {
    const modPath = path.join(ROOT, 'src', 'conceptMaps.js')
    const mod = await import(pathToFileURL(modPath).href)
    return mod.default || {}
  } catch (err) {
    console.warn('[search-index] could not load conceptMaps:', err.message)
    return {}
  }
}

function buildTopicDoc(topic) {
  return {
    id: `topic:${topic.id}`,
    kind: 'topic',
    topicId: topic.id,
    topicTitle: topic.title,
    topicIcon: topic.icon || '',
    text: [topic.title, topic.description, topic.id].filter(Boolean).join(' '),
  }
}

function buildSectionDoc(topic, section, concept) {
  const conceptText = concept
    ? [
        concept.crux || '',
        (concept.concepts || []).join(' '),
        (concept.pointsToPonder || []).join(' '),
      ].join(' ')
    : ''
  return {
    id: `section:${topic.id}::${section.slug}`,
    kind: 'section',
    topicId: topic.id,
    topicTitle: topic.title,
    topicIcon: topic.icon || '',
    heading: section.headingText,
    sectionSlug: section.slug,
    crux: concept?.crux || '',
    hasConceptMap: Boolean(concept),
    text: [section.headingText, conceptText].filter(Boolean).join(' '),
  }
}

function buildQuestionDoc(topic, section, cells) {
  // Table shape varies (some have leading #, some don't). We always treat
  // the last cell as difficulty and inspect the first 4 cells heuristically.
  const last = cells.length - 1
  const difficultyList = normalizeDifficulty(cells[last])
  const difficulty = difficultyList[0] || ''
  // Find the LeetCode # — typically a digit-only cell. Fall back to cell[2].
  const lcIdx = cells.findIndex((c, i) => i > 0 && i < last && /^\d+$/.test(c))
  const leetcodeId = lcIdx >= 0 ? cells[lcIdx] : (cells[2] || '')
  // Problem is the cell right before the LC# when present, else cell[1].
  const problemIdx = lcIdx > 0 ? lcIdx - 1 : 1
  const problem = cells[problemIdx] || ''
  // Tag is any remaining text cell between problem and difficulty.
  const tagCells = cells
    .slice(problemIdx + 1, last)
    .filter((c) => c && c !== leetcodeId)
  const tags = tagCells.join(' · ')

  // `questionId` is the stable key the done-state map (App.jsx's
  // doneQuestions) uses. A single problem can appear in multiple sections
  // of the same topic, so we keep a separate per-occurrence `id` for the
  // search engine — MiniSearch requires it to be unique.
  const questionId = makeQuestionId(topic.id, [cells[0], problem, leetcodeId])
  return {
    id: `q:${topic.id}::${section.slug}::${leetcodeId || 'na'}::${problem.toLowerCase().replace(/\s+/g, '-').slice(0, 40)}`,
    questionId,
    kind: 'question',
    topicId: topic.id,
    topicTitle: topic.title,
    topicIcon: topic.icon || '',
    sectionHeading: section.headingText,
    sectionSlug: section.slug,
    problem,
    leetcodeId,
    tags,
    difficulty,
    text: [problem, leetcodeId, tags, section.headingText].filter(Boolean).join(' '),
  }
}

function buildSnippetDocs(topic, snippetMarkdown) {
  // Snippet files use the same `## heading` shape; code blocks live under
  // each section. We index one doc per code block, titled by its section.
  const { sections } = getMarkdownSections(snippetMarkdown)
  const docs = []
  for (const section of sections) {
    const blocks = getCodeBlocks(section.body)
    blocks.forEach((block, i) => {
      docs.push({
        id: `snippet:${topic.id}::${section.slug}::${i}`,
        kind: 'snippet',
        topicId: topic.id,
        topicTitle: topic.title,
        topicIcon: topic.icon || '',
        snippetTitle: section.headingText,
        sectionSlug: section.slug,
        language: block.language || '',
        // Cap the indexed code body at ~1200 chars — enough for substring
        // matching of API names without bloating the JSON for huge templates.
        code: block.code.slice(0, 1200),
        text: [section.headingText, block.language, block.code].filter(Boolean).join(' '),
      })
    })
  }
  return docs
}

export async function buildSearchIndex({ silent = false } = {}) {
  const entries = await fs.readdir(CONTENT_DIR)
  const mdFiles = entries.filter((f) => f.endsWith('.md')).sort()
  const conceptMaps = await tryLoadConceptMaps()

  const topics = [HOME_TOPIC]
  const docs = [buildTopicDoc(HOME_TOPIC)]
  const snippetByPair = new Map() // base file → snippet file

  // First pass: index snippet companions by their base file so we can
  // attach them to their topic in the second pass.
  for (const file of mdFiles) {
    if (isSnippetsFile(file)) {
      snippetByPair.set(pairedBaseName(file), file)
    }
  }

  for (const file of mdFiles) {
    if (isSnippetsFile(file)) continue

    const { data: frontmatter, content } = await readMarkdown(file)

    const id = frontmatter.id || file.replace(/\.md$/, '').replace(/_/g, '-')
    const title = frontmatter.title || id
    const icon = frontmatter.icon || '📄'
    const description = frontmatter.description || ''
    const problems = frontmatter.problems || ''
    const categories = frontmatter.categories || ''
    const order = frontmatter.order ?? 1000

    const snippetsFile = snippetByPair.get(file) || null

    const topic = {
      id,
      title,
      icon,
      description,
      problems,
      categories,
      file,
      snippetsFile,
      order,
    }
    topics.push(topic)

    // -- topic itself
    docs.push(buildTopicDoc(topic))

    // -- sections + questions
    const { sections } = getMarkdownSections(content)
    // The same problem can legitimately appear under two H3 subsections of
    // one H2 (e.g. a knapsack problem listed under both "0/1" and "bounded").
    // Section slugs are H2-level, so those rows would otherwise collide on
    // `id` and the second occurrence would be dropped from the index. Track
    // used ids per topic and suffix duplicates so every row stays searchable.
    const usedQuestionIds = new Set()
    for (const section of sections) {
      const concept = conceptMaps[topic.id]?.[section.headingText] || null
      docs.push(buildSectionDoc(topic, section, concept))
      for (const cells of section.questionRows) {
        const doc = buildQuestionDoc(topic, section, cells)
        if (usedQuestionIds.has(doc.id)) {
          let k = 2
          while (usedQuestionIds.has(`${doc.id}::${k}`)) k++
          doc.id = `${doc.id}::${k}`
        }
        usedQuestionIds.add(doc.id)
        docs.push(doc)
      }
    }

    // -- snippets
    if (snippetsFile) {
      const { content: snippetContent } = await readMarkdown(snippetsFile)
      docs.push(...buildSnippetDocs(topic, snippetContent))
    }
  }

  // Stable order: explicit `order` ascending, then home first, then alpha.
  topics.sort((a, b) => {
    if (a.id === 'home') return -1
    if (b.id === 'home') return 1
    if (a.order !== b.order) return a.order - b.order
    return a.title.localeCompare(b.title)
  })

  await fs.mkdir(GENERATED_DIR, { recursive: true })
  await fs.mkdir(PUBLIC_DIR, { recursive: true })

  const manifestSource =
    '// AUTO-GENERATED by scripts/buildSearchIndex.mjs — do not edit by hand.\n' +
    '// Re-run `npm run dev` or `npm run build` to regenerate.\n' +
    `const topics = ${JSON.stringify(topics, null, 2)}\n\nexport default topics\n`

  await fs.writeFile(
    path.join(GENERATED_DIR, 'contentManifest.js'),
    manifestSource,
    'utf8',
  )

  const indexPayload = {
    version: 1,
    builtAt: new Date().toISOString(),
    topics: topics.map(({ id, title, icon, description, file, snippetsFile }) => ({
      id,
      title,
      icon,
      description,
      file,
      snippetsFile,
    })),
    docs,
  }

  await fs.writeFile(
    path.join(PUBLIC_DIR, 'search-index.json'),
    JSON.stringify(indexPayload),
    'utf8',
  )

  if (!silent) {
    const counts = docs.reduce((acc, d) => {
      acc[d.kind] = (acc[d.kind] || 0) + 1
      return acc
    }, {})
    console.log(
      `[search-index] ${topics.length} topics · ` +
        Object.entries(counts)
          .map(([k, v]) => `${v} ${k}`)
          .join(' · '),
    )
  }

  return { topics, docs }
}

// Run directly via `node scripts/buildSearchIndex.mjs`
const isDirectRun =
  import.meta.url === pathToFileURL(process.argv[1] || '').href
if (isDirectRun) {
  buildSearchIndex().catch((err) => {
    console.error('[search-index] build failed:', err)
    process.exit(1)
  })
}
