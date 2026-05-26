import { Children, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import topics from '../topics'
import conceptMaps from '../conceptMaps'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
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

function normalizeDifficulty(value) {
  const text = value.toLowerCase()
  const difficulties = []

  if (text.includes('easy')) difficulties.push('Easy')
  if (text.includes('medium') || text.includes('med')) difficulties.push('Medium')
  if (text.includes('hard')) difficulties.push('Hard')

  return difficulties
}

function getQuestionRows(markdown) {
  return markdown
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter((cells) => cells.length >= 4)
    .filter((cells) => cells[0] !== '#' && !cells[0].startsWith('---'))
    .filter((cells) => normalizeDifficulty(cells[cells.length - 1]).length > 0)
}

function getMarkdownSections(markdown) {
  const lines = markdown.split('\n')
  const introLines = []
  const sections = []
  let currentSection = null

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection)
      }

      currentSection = {
        heading: line,
        bodyLines: [],
      }
      return
    }

    if (currentSection) {
      currentSection.bodyLines.push(line)
    } else {
      introLines.push(line)
    }
  })

  if (currentSection) {
    sections.push(currentSection)
  }

  return {
    intro: introLines.join('\n'),
    sections: sections.map((section, index) => {
      const body = section.bodyLines.join('\n')

      return {
        id: `${index}-${section.heading}`,
        heading: section.heading,
        body,
        questionRows: getQuestionRows(body),
      }
    }),
  }
}

function makeQuestionId(topicId, cells) {
  const problem = cells[1] || 'unknown-problem'
  const leetcodeId = cells[2] || 'unknown-lc'
  return `${topicId}:${leetcodeId}:${problem}`.toLowerCase()
}

function getSectionConcept(topicId, headingLine) {
  const topicMap = conceptMaps[topicId]
  if (!topicMap) return null
  const key = headingLine.replace(/^##\s+/, '').trim()
  return topicMap[key] || null
}

function SectionConceptMap({ concept, sectionId }) {
  const [isOpen, setIsOpen] = useState(false)

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
  const [loadedTopic, setLoadedTopic] = useState({
    id: null,
    tab: 'questions',
    content: '',
  })
  const [activeTab, setActiveTab] = useState('questions')
  // Reset the tab when the topic changes by comparing against the last seen
  // topicId during render — avoids cascading renders from a useEffect.
  const [lastTopicId, setLastTopicId] = useState(topicId)
  if (lastTopicId !== topicId) {
    setLastTopicId(topicId)
    setActiveTab('questions')
  }
  const [difficultyFilters, setDifficultyFilters] = useState({
    Easy: true,
    Medium: true,
    Hard: true,
  })

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
          <tr className={isDone ? 'question-row done' : 'question-row'}>
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
        setLoadedTopic({ id: topic.id, tab: effectiveTab, content: text })
        window.scrollTo(0, 0)
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
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
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

              return (
                <section className="question-section" key={section.id}>
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
