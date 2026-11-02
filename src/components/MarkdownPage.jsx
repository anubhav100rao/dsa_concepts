import {
  Children,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import topics from '../topics'
import conceptMaps from '../conceptMaps'
import SectionConceptMap from './SectionConceptMap'
import {
  DIFFICULTIES,
  normalizeDifficulty,
  getQuestionRows,
  getMarkdownSections,
  makeQuestionId,
  stripFrontmatter,
} from '../lib/markdownParse'

const REMARK_PLUGINS = [remarkGfm]
// `rehype-raw` must run before `rehype-highlight` so any raw HTML is parsed
// before the highlighter walks `<code>` nodes.
const REHYPE_PLUGINS = [rehypeRaw, rehypeHighlight]
// Headings render inside a <button> inside the <h2>, so only inline markup
// survives; the heading element itself gets unwrapped.
const HEADING_ELEMENTS = ['code', 'em', 'strong']

const COLLAPSED_SECTIONS_STORAGE_KEY = 'dsa-platform:collapsed-sections'
const NO_COLLAPSED_SECTIONS = {}

function getStoredCollapsedSections() {
  try {
    const stored = window.localStorage.getItem(COLLAPSED_SECTIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function countUniqueQuestions(rows) {
  return new Set(rows.map((cells) => makeQuestionId(cells))).size
}

// Done state and filters reach the rows through context, so ticking a box
// re-renders only the rows and counters instead of re-parsing every section's
// markdown.
const QuestionStateContext = createContext(null)

function getTextContent(children) {
  if (children == null || typeof children === 'boolean') return ''
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('')
  }
  if (children.props) {
    return getTextContent(children.props.children)
  }
  return ''
}

function getSectionConcept(topicId, headingLine) {
  const topicMap = conceptMaps[topicId]
  if (!topicMap) return null
  const key = headingLine.replace(/^##\s+/, '').trim()
  return topicMap[key] || null
}

function QuestionSectionToolbar({ questionRows }) {
  const { doneQuestions, onSetQuestionsDone } = useContext(QuestionStateContext)
  const questionIds = questionRows.map((cells) => makeQuestionId(cells))
  const doneCount = questionIds.filter((questionId) => doneQuestions[questionId])
    .length
  const isDone = doneCount === questionIds.length
  const isStarted = doneCount > 0

  return (
    <div className="question-section-toolbar">
      <label className="section-check">
        <input
          type="checkbox"
          checked={isDone}
          ref={(input) => {
            if (input) {
              input.indeterminate = isStarted && !isDone
            }
          }}
          onChange={(event) =>
            onSetQuestionsDone(questionIds, event.target.checked)
          }
        />
        <span>Mark section done</span>
      </label>
      <span className="section-progress">
        {doneCount} / {questionIds.length} done
      </span>
      {isStarted && (
        <button
          type="button"
          className="section-clear-btn"
          title="Also clears these questions everywhere else they appear"
          onClick={() => onSetQuestionsDone(questionIds, false)}
        >
          Clear
        </button>
      )}
    </div>
  )
}

function CollapsedSectionProgress({ questionRows }) {
  const { doneQuestions } = useContext(QuestionStateContext)
  const doneCount = questionRows.filter(
    (cells) => doneQuestions[makeQuestionId(cells)],
  ).length
  const isComplete = doneCount === questionRows.length

  return (
    <span
      className={`section-heading-progress ${isComplete ? 'complete' : ''}`}
    >
      {doneCount} / {questionRows.length} done
    </span>
  )
}

function QuestionRow({ cellTexts, rowDifficulties, children }) {
  const { doneQuestions, difficultyFilters, onToggleQuestionDone } =
    useContext(QuestionStateContext)
  const isVisible = rowDifficulties.some(
    (difficulty) => difficultyFilters[difficulty],
  )

  if (!isVisible) return null

  const questionId = makeQuestionId(cellTexts)
  const isDone = Boolean(doneQuestions[questionId])
  const problemName = cellTexts[1] || 'question'

  return (
    <tr
      data-question-id={questionId}
      className={isDone ? 'question-row done' : 'question-row'}
    >
      <td className="question-done-cell">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggleQuestionDone(questionId)}
          aria-label={`Mark ${problemName} as done`}
        />
      </td>
      {children}
    </tr>
  )
}

function MarkdownTableRow({ children }) {
  const cells = Children.toArray(children)
  const cellTexts = cells.map((child) =>
    getTextContent(child?.props?.children).trim(),
  )
  const isQuestionHeader =
    cellTexts.includes('Problem') && cellTexts.includes('Difficulty')
  const rowDifficulties = normalizeDifficulty(cellTexts[cellTexts.length - 1])
  const isQuestionRow =
    cellTexts.length >= 4 && !isQuestionHeader && rowDifficulties.length > 0

  if (isQuestionRow) {
    return (
      <QuestionRow cellTexts={cellTexts} rowDifficulties={rowDifficulties}>
        {children}
      </QuestionRow>
    )
  }

  if (isQuestionHeader) {
    return (
      <tr>
        <th className="question-done-heading">Done</th>
        {children}
      </tr>
    )
  }

  return <tr>{children}</tr>
}

const MARKDOWN_COMPONENTS = { tr: MarkdownTableRow }

const MarkdownBlock = memo(function MarkdownBlock({ markdown }) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={MARKDOWN_COMPONENTS}
    >
      {markdown}
    </ReactMarkdown>
  )
})

const CollapsibleSection = memo(function CollapsibleSection({
  topicId,
  section,
  isCollapsed,
  onToggle,
  showQuestionTools,
  concept,
  forceConceptOpen,
}) {
  const bodyId = `section-body-${section.slug}`
  const hasQuestions = showQuestionTools && section.questionRows.length > 0
  const sectionClass = showQuestionTools ? 'question-section' : 'snippet-section'

  return (
    <section
      className={`collapsible-section ${sectionClass} ${
        isCollapsed ? 'is-collapsed' : ''
      }`}
      data-section-slug={section.slug}
    >
      <h2
        className="section-heading"
        id={section.slug}
        data-section-slug={section.slug}
      >
        <button
          type="button"
          className="section-toggle"
          aria-expanded={!isCollapsed}
          aria-controls={isCollapsed ? undefined : bodyId}
          onClick={() => onToggle(section.slug)}
        >
          <svg
            className="section-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span>
            <ReactMarkdown
              remarkPlugins={REMARK_PLUGINS}
              allowedElements={HEADING_ELEMENTS}
              unwrapDisallowed
            >
              {section.heading}
            </ReactMarkdown>
          </span>
        </button>
        {isCollapsed && hasQuestions && (
          <CollapsedSectionProgress questionRows={section.questionRows} />
        )}
      </h2>
      {!isCollapsed && (
        <div id={bodyId}>
          {concept && (
            <SectionConceptMap
              concept={concept}
              sectionId={section.id}
              forceOpen={forceConceptOpen}
              topicId={topicId}
              sectionSlug={section.slug}
              questionRows={section.questionRows}
            />
          )}
          {hasQuestions && (
            <QuestionSectionToolbar questionRows={section.questionRows} />
          )}
          <MarkdownBlock markdown={section.body} />
        </div>
      )}
    </section>
  )
})

function SectionBulkActions({ sections, collapsedInScope, onSetAllCollapsed }) {
  const collapsedCount = sections.filter(
    (section) => collapsedInScope[section.slug],
  ).length

  return (
    <div className="section-bulk-actions">
      <button
        type="button"
        className="section-bulk-btn"
        disabled={collapsedCount === sections.length}
        onClick={() => onSetAllCollapsed(true)}
      >
        Collapse all
      </button>
      <button
        type="button"
        className="section-bulk-btn"
        disabled={collapsedCount === 0}
        onClick={() => onSetAllCollapsed(false)}
      >
        Expand all
      </button>
    </div>
  )
}

export default function MarkdownPage({
  doneQuestions,
  onToggleQuestionDone,
  onSetQuestionsDone,
}) {
  const { topicId } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const targetQuestionId = searchParams.get('q')
  const targetSectionSlug = searchParams.get('section')
  const wantConceptOpen = searchParams.get('concept') === '1'
  const requestedTab = searchParams.get('tab')

  const [loadedTopic, setLoadedTopic] = useState({
    id: null,
    tab: 'questions',
    content: '',
  })
  const [activeTab, setActiveTab] = useState(
    requestedTab === 'snippets' ? 'snippets' : 'questions',
  )
  // Reset the tab when the topic changes by comparing against the last seen
  // topicId during render — avoids cascading renders from a useEffect.
  const [lastTopicId, setLastTopicId] = useState(topicId)
  if (lastTopicId !== topicId) {
    setLastTopicId(topicId)
    setActiveTab(requestedTab === 'snippets' ? 'snippets' : 'questions')
  }
  // On each navigation, honor a tab requested by the URL (e.g. via the search
  // palette or a concept map link). And when the user lands via a question
  // deep-link, force all difficulty filters on so the target row is actually
  // rendered. Compare-to-last pattern keeps this out of an effect. Keyed on
  // the navigation so reopening the same link still works.
  const [difficultyFilters, setDifficultyFilters] = useState({
    Easy: true,
    Medium: true,
    Hard: true,
  })
  const [lastLocationKey, setLastLocationKey] = useState(location.key)
  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key)
    if (requestedTab === 'snippets') setActiveTab('snippets')
    if (requestedTab === 'questions') setActiveTab('questions')
    if (targetQuestionId) {
      setDifficultyFilters({ Easy: true, Medium: true, Hard: true })
    }
  }

  const topic = topicId
    ? topics.find((t) => t.id === topicId)
    : topics.find((t) => t.id === 'home')

  const hasSnippets = Boolean(topic?.snippetsFile)
  // Snippets tab is only meaningful when the topic has a snippets file.
  const effectiveTab = hasSnippets ? activeTab : 'questions'
  const isSnippetsView = effectiveTab === 'snippets'
  const isContentReady =
    loadedTopic.id === topic?.id && loadedTopic.tab === effectiveTab

  const activeDifficulties = DIFFICULTIES.filter(
    (difficulty) => difficultyFilters[difficulty],
  )
  const content = loadedTopic.content
  const contentSections = useMemo(() => getMarkdownSections(content), [content])
  const questionRows = useMemo(() => getQuestionRows(content), [content])
  const visibleQuestionRows = questionRows.filter((cells) =>
    normalizeDifficulty(cells[cells.length - 1]).some(
      (difficulty) => difficultyFilters[difficulty],
    ),
  )
  // A problem can repeat across a topic's sections, so topic-level numbers
  // count each one once; the per-section toolbars count their own rows.
  const visibleQuestionIds = new Set(
    visibleQuestionRows.map((cells) => makeQuestionId(cells)),
  )
  const doneVisibleCount = [...visibleQuestionIds].filter(
    (questionId) => doneQuestions[questionId],
  ).length

  const difficultyCounts = DIFFICULTIES.reduce((counts, difficulty) => {
    counts[difficulty] = countUniqueQuestions(
      questionRows.filter((cells) =>
        normalizeDifficulty(cells[cells.length - 1]).includes(difficulty),
      ),
    )
    return counts
  }, {})

  const toggleDifficultyFilter = (difficulty) => {
    setDifficultyFilters((current) => ({
      ...current,
      [difficulty]: !current[difficulty],
    }))
  }

  const questionState = useMemo(
    () => ({
      doneQuestions,
      difficultyFilters,
      onToggleQuestionDone,
      onSetQuestionsDone,
    }),
    [doneQuestions, difficultyFilters, onToggleQuestionDone, onSetQuestionsDone],
  )

  // Collapsed sections are remembered per topic and per tab.
  const [collapsedSections, setCollapsedSections] = useState(
    getStoredCollapsedSections,
  )
  const collapseScope = `${topicId}:${effectiveTab}`
  const collapsedInScope =
    collapsedSections[collapseScope] || NO_COLLAPSED_SECTIONS

  const toggleSection = useCallback(
    (slug) => {
      setCollapsedSections((current) => {
        const nextScope = { ...current[collapseScope] }
        if (nextScope[slug]) {
          delete nextScope[slug]
        } else {
          nextScope[slug] = true
        }
        return { ...current, [collapseScope]: nextScope }
      })
    },
    [collapseScope],
  )

  const setAllSectionsCollapsed = (isCollapsed) => {
    const nextScope = {}
    if (isCollapsed) {
      contentSections.sections.forEach((section) => {
        nextScope[section.slug] = true
      })
    }
    setCollapsedSections((current) => ({
      ...current,
      [collapseScope]: nextScope,
    }))
  }

  // A deep link must open its section before the scroll effect below looks
  // for the target. The section comes from the parsed markdown because a
  // collapsed section's rows aren't in the DOM. Runs once per navigation, so
  // the learner can still collapse that section afterwards.
  const deepLinkKey = isContentReady ? `${location.key}:${collapseScope}` : null
  const [lastDeepLinkKey, setLastDeepLinkKey] = useState(null)
  if (lastDeepLinkKey !== deepLinkKey) {
    setLastDeepLinkKey(deepLinkKey)
    const sectionSlug =
      targetSectionSlug ||
      contentSections.sections.find((section) =>
        section.questionRows.some(
          (cells) => makeQuestionId(cells) === targetQuestionId,
        ),
      )?.slug
    if (deepLinkKey && sectionSlug && collapsedInScope[sectionSlug]) {
      toggleSection(sectionSlug)
    }
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(
        COLLAPSED_SECTIONS_STORAGE_KEY,
        JSON.stringify(collapsedSections),
      )
    } catch {
      // If storage is unavailable or full, the in-memory state still works.
    }
  }, [collapsedSections])

  useEffect(() => {
    if (!topic) return
    let isCurrent = true

    const fileToLoad =
      isSnippetsView && topic.snippetsFile ? topic.snippetsFile : topic.file

    fetch(`/content/${fileToLoad}`)
      .then((res) => res.text())
      .then((text) => {
        if (!isCurrent) return
        setLoadedTopic({
          id: topic.id,
          tab: effectiveTab,
          content: stripFrontmatter(text),
        })
        // Defer the scroll-to-top until the deep-link effect has had a chance
        // to find its target; if it doesn't fire, we scroll to top below.
      })
      .catch(() => {
        if (!isCurrent) return
        setLoadedTopic({
          id: topic.id,
          tab: effectiveTab,
          content: '# Error\nFailed to load content.',
        })
      })

    return () => {
      isCurrent = false
    }
  }, [topic, effectiveTab, isSnippetsView])

  // Deep-link scroll: after content is in the DOM, locate the target row or
  // section, scroll it into view, and flash it briefly. The dependency on
  // `content` ensures this runs once the markdown actually rendered.
  useEffect(() => {
    if (!isContentReady || !content) return

    // Defer one frame so React has flushed the new markdown.
    const id = requestAnimationFrame(() => {
      let target = null
      if (targetQuestionId) {
        // A problem can repeat within a topic, so prefer the row in the
        // section the link came from.
        const rowSelector = `[data-question-id="${CSS.escape(targetQuestionId)}"]`
        const section =
          targetSectionSlug &&
          document.querySelector(
            `section[data-section-slug="${CSS.escape(targetSectionSlug)}"]`,
          )
        target =
          (section && section.querySelector(rowSelector)) ||
          document.querySelector(rowSelector)
      } else if (targetSectionSlug) {
        target = document.querySelector(
          `h2[data-section-slug="${CSS.escape(targetSectionSlug)}"]`,
        )
      }

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        target.classList.add('flash')
        setTimeout(() => target.classList.remove('flash'), 1700)
      } else if (!targetQuestionId && !targetSectionSlug) {
        window.scrollTo(0, 0)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [
    content,
    isContentReady,
    location.key,
    targetQuestionId,
    targetSectionSlug,
  ])

  if (!topic) {
    return (
      <div className="markdown-page">
        <div className="not-found">
          <h2>Topic not found</h2>
          <p>The requested topic does not exist.</p>
        </div>
      </div>
    )
  }

  if (!isContentReady) {
    return (
      <div className="markdown-page">
        {hasSnippets && (
          <TopicTabs activeTab={effectiveTab} onChange={setActiveTab} />
        )}
        <div className="loading">
          <div className="loading-spinner" />
          <p>
            Loading {topic.title}
            {isSnippetsView ? ' snippets' : ''}...
          </p>
        </div>
      </div>
    )
  }

  const bulkActions = contentSections.sections.length > 0 && (
    <SectionBulkActions
      sections={contentSections.sections}
      collapsedInScope={collapsedInScope}
      onSetAllCollapsed={setAllSectionsCollapsed}
    />
  )

  return (
    <div className="markdown-page">
      {hasSnippets && (
        <TopicTabs activeTab={effectiveTab} onChange={setActiveTab} />
      )}
      {isSnippetsView ? (
        <div className="snippet-toolbar">{bulkActions}</div>
      ) : (
        <section className="question-toolbar" aria-label="Question filters">
          <div className="question-filter-group">
            {DIFFICULTIES.map((difficulty) => (
              <label
                key={difficulty}
                className={`difficulty-filter ${difficulty.toLowerCase()} ${
                  difficultyFilters[difficulty] ? 'active' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={difficultyFilters[difficulty]}
                  onChange={() => toggleDifficultyFilter(difficulty)}
                />
                <span>{difficulty}</span>
                <strong>{difficultyCounts[difficulty] || 0}</strong>
              </label>
            ))}
          </div>
          <div className="question-toolbar-side">
            <p className="question-progress">
              {doneVisibleCount} / {visibleQuestionIds.size} done
              {activeDifficulties.length > 0 &&
                activeDifficulties.length < DIFFICULTIES.length &&
                ` in ${activeDifficulties.join(', ')}`}
            </p>
            {bulkActions}
          </div>
        </section>
      )}
      <article className="markdown-content">
        <QuestionStateContext.Provider value={questionState}>
          <MarkdownBlock markdown={contentSections.intro} />
          {contentSections.sections.map((section) => (
            <CollapsibleSection
              key={section.id}
              topicId={topicId}
              section={section}
              isCollapsed={Boolean(collapsedInScope[section.slug])}
              onToggle={toggleSection}
              showQuestionTools={!isSnippetsView}
              concept={
                isSnippetsView ? null : getSectionConcept(topicId, section.heading)
              }
              forceConceptOpen={
                wantConceptOpen && targetSectionSlug === section.slug
              }
            />
          ))}
        </QuestionStateContext.Provider>
      </article>
    </div>
  )
}

function TopicTabs({ activeTab, onChange }) {
  return (
    <div className="topic-tabs" role="tablist" aria-label="Topic view">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'questions'}
        className={`topic-tab ${activeTab === 'questions' ? 'active' : ''}`}
        onClick={() => onChange('questions')}
      >
        Questions
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'snippets'}
        className={`topic-tab ${activeTab === 'snippets' ? 'active' : ''}`}
        onClick={() => onChange('snippets')}
      >
        Snippets
      </button>
    </div>
  )
}
