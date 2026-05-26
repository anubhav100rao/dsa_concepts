import { Children, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import topics from '../topics'
import conceptMaps from '../conceptMaps'
import {
  DIFFICULTIES,
  normalizeDifficulty,
  getQuestionRows,
  getMarkdownSections,
  makeQuestionId,
  slugifyHeading,
  stripFrontmatter,
} from '../lib/markdownParse'

const REMARK_PLUGINS = [remarkGfm]
// `rehype-raw` must run before `rehype-highlight` so any raw HTML is parsed
// before the highlighter walks `<code>` nodes.
const REHYPE_PLUGINS = [rehypeRaw, rehypeHighlight]

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

function SectionConceptMap({ concept, sectionId, forceOpen }) {
  const [isOpen, setIsOpen] = useState(Boolean(forceOpen))

  // If the URL flips on the concept-open flag after mount, open the panel.
  // Compare-to-last pattern avoids a set-state-in-effect lint hit.
  const [lastForce, setLastForce] = useState(forceOpen)
  if (lastForce !== forceOpen) {
    setLastForce(forceOpen)
    if (forceOpen) setIsOpen(true)
  }

  return (
    <div className={`concept-map ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="concept-map-toggle"
        aria-expanded={isOpen}
        aria-controls={`concept-${sectionId}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="concept-map-toggle-icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
        <span className="concept-map-toggle-label">
          {isOpen ? 'Hide concept map' : 'Show concept map'}
        </span>
        <span className="concept-map-toggle-hint">
          crux · key concepts · points to ponder · code
        </span>
      </button>

      {isOpen && (
        <div className="concept-map-body" id={`concept-${sectionId}`}>
          {concept.crux && (
            <div className="concept-block concept-crux">
              <div className="concept-label">Crux</div>
              <p>{concept.crux}</p>
            </div>
          )}

          {concept.concepts && concept.concepts.length > 0 && (
            <div className="concept-block">
              <div className="concept-label">Key concepts</div>
              <ul>
                {concept.concepts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {concept.pointsToPonder && concept.pointsToPonder.length > 0 && (
            <div className="concept-block">
              <div className="concept-label">Points to ponder</div>
              <ul>
                {concept.pointsToPonder.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {concept.code && (
            <div className="concept-block">
              <div className="concept-label">Code sketch</div>
              <pre className="concept-code">
                <code>{concept.code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuestionSectionToolbar({
  doneQuestions,
  onSetQuestionsDone,
  questionRows,
  topicId,
}) {
  const questionIds = questionRows.map((cells) => makeQuestionId(topicId, cells))
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
          onClick={() => onSetQuestionsDone(questionIds, false)}
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default function MarkdownPage({
  doneQuestions,
  onToggleQuestionDone,
  onSetQuestionsDone,
}) {
  const { topicId } = useParams()
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
  // If the URL asks for the snippets tab (e.g. via the search palette), honor
  // it on every search-params change too.
  const [lastRequestedTab, setLastRequestedTab] = useState(requestedTab)
  if (lastRequestedTab !== requestedTab) {
    setLastRequestedTab(requestedTab)
    if (requestedTab === 'snippets') setActiveTab('snippets')
    if (requestedTab === 'questions') setActiveTab('questions')
  }

  // When the user lands via a question deep-link, force all difficulty
  // filters on so the target row is actually rendered. Compare-to-last
  // pattern keeps this out of an effect.
  const [difficultyFilters, setDifficultyFilters] = useState({
    Easy: true,
    Medium: true,
    Hard: true,
  })
  const [lastTarget, setLastTarget] = useState(targetQuestionId)
  if (lastTarget !== targetQuestionId) {
    setLastTarget(targetQuestionId)
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

  const activeDifficulties = DIFFICULTIES.filter(
    (difficulty) => difficultyFilters[difficulty],
  )
  const content = loadedTopic.content
  const contentSections = getMarkdownSections(content)
  const questionRows = getQuestionRows(content)
  const visibleQuestionRows = questionRows.filter((cells) =>
    normalizeDifficulty(cells[cells.length - 1]).some(
      (difficulty) => difficultyFilters[difficulty],
    ),
  )
  const doneVisibleCount = visibleQuestionRows.filter(
    (cells) => doneQuestions[makeQuestionId(topicId, cells)],
  ).length

  const difficultyCounts = DIFFICULTIES.reduce((counts, difficulty) => {
    counts[difficulty] = questionRows.filter((cells) =>
      normalizeDifficulty(cells[cells.length - 1]).includes(difficulty),
    ).length
    return counts
  }, {})

  const toggleDifficultyFilter = (difficulty) => {
    setDifficultyFilters((current) => ({
      ...current,
      [difficulty]: !current[difficulty],
    }))
  }

  const markdownComponents = {
    // Stamp section slugs on every ## heading so the deep-link scroll-to
    // works in both the questions view (where the parent <section> already
    // carries the slug) and the snippets view (where headings are inline).
    h2({ children, ...rest }) {
      const text = getTextContent(children)
      const slug = slugifyHeading(text)
      return (
        <h2 data-section-slug={slug} id={slug} {...rest}>
          {children}
        </h2>
      )
    },
    tr({ children }) {
      const cells = Children.toArray(children)
      const cellTexts = cells.map((child) =>
        getTextContent(child?.props?.children).trim(),
      )
      const isQuestionHeader =
        cellTexts.includes('Problem') && cellTexts.includes('Difficulty')
      const rowDifficulties = normalizeDifficulty(cellTexts[cellTexts.length - 1])
      const isQuestionRow =
        cellTexts.length >= 4 &&
        !isQuestionHeader &&
        rowDifficulties.length > 0

      if (isQuestionRow) {
        const isVisible = rowDifficulties.some(
          (difficulty) => difficultyFilters[difficulty],
        )

        if (!isVisible) return null

        const questionId = makeQuestionId(topicId, cellTexts)
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

      if (isQuestionHeader) {
        return (
          <tr>
            <th className="question-done-heading">Done</th>
            {children}
          </tr>
        )
      }

      return <tr>{children}</tr>
    },
  }

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
    if (!content) return
    if (loadedTopic.id !== topic?.id) return

    // Defer one frame so React has flushed the new markdown.
    const id = requestAnimationFrame(() => {
      let target = null
      if (targetQuestionId) {
        target = document.querySelector(
          `[data-question-id="${CSS.escape(targetQuestionId)}"]`,
        )
      } else if (targetSectionSlug) {
        target = document.querySelector(
          `[data-section-slug="${CSS.escape(targetSectionSlug)}"]`,
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
    loadedTopic.id,
    topic?.id,
    targetQuestionId,
    targetSectionSlug,
    isSnippetsView,
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

  if (loadedTopic.id !== topic.id || loadedTopic.tab !== effectiveTab) {
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

  return (
    <div className="markdown-page">
      {hasSnippets && (
        <TopicTabs activeTab={effectiveTab} onChange={setActiveTab} />
      )}
      {!isSnippetsView && (
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
          <p className="question-progress">
            {doneVisibleCount} / {visibleQuestionRows.length} done
            {activeDifficulties.length > 0 &&
              activeDifficulties.length < DIFFICULTIES.length &&
              ` in ${activeDifficulties.join(', ')}`}
          </p>
        </section>
      )}
      <article className="markdown-content">
        {isSnippetsView ? (
          // Pass the h2 override so snippet section headings get
          // `data-section-slug` — without it, deep-links from the search
          // palette (?tab=snippets&section=…) have nothing to scroll to.
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={REMARK_PLUGINS}
              rehypePlugins={REHYPE_PLUGINS}
              components={markdownComponents}
            >
              {contentSections.intro}
            </ReactMarkdown>
            {contentSections.sections.map((section) => {
              const sectionConcept = getSectionConcept(topicId, section.heading)
              const isTargetSection =
                !!targetSectionSlug && targetSectionSlug === section.slug

              return (
                <section
                  className="question-section"
                  data-section-slug={section.slug}
                  key={section.id}
                >
                  <ReactMarkdown
                    remarkPlugins={REMARK_PLUGINS}
                    rehypePlugins={REHYPE_PLUGINS}
                    components={markdownComponents}
                  >
                    {section.heading}
                  </ReactMarkdown>
                  {sectionConcept && (
                    <SectionConceptMap
                      concept={sectionConcept}
                      sectionId={section.id}
                      forceOpen={wantConceptOpen && isTargetSection}
                    />
                  )}
                  {section.questionRows.length > 0 && (
                    <QuestionSectionToolbar
                      doneQuestions={doneQuestions}
                      onSetQuestionsDone={onSetQuestionsDone}
                      questionRows={section.questionRows}
                      topicId={topicId}
                    />
                  )}
                  <ReactMarkdown
                    remarkPlugins={REMARK_PLUGINS}
                    rehypePlugins={REHYPE_PLUGINS}
                    components={markdownComponents}
                  >
                    {section.body}
                  </ReactMarkdown>
                </section>
              )
            })}
          </>
        )}
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
