import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { makeQuestionId } from '../lib/markdownParse'

const REHYPE_PLUGINS = [rehypeHighlight]

function ConceptList({ label, items, className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <div className={`concept-block ${className}`}>
      <div className="concept-label">{label}</div>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function WorkedExample({ example }) {
  return (
    <div className="concept-block">
      <div className="concept-label">Worked example</div>
      <p className="concept-example-title">
        {example.problem}
        {example.lc && ` (LC ${example.lc})`}
      </p>
      {example.walkthrough && (
        <ol className="concept-steps">
          {example.walkthrough.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

function PracticeList({ practice, questionRows, topicId, sectionSlug }) {
  return (
    <div className="concept-block">
      <div className="concept-label">Practice, easiest first</div>
      <ul className="concept-practice">
        {practice.map((leetcodeId) => {
          const questionId = `lc:${leetcodeId}`
          const cells = questionRows.find(
            (row) => makeQuestionId(row) === questionId,
          )
          const params = new URLSearchParams({
            q: questionId,
            section: sectionSlug,
          })

          return (
            <li key={leetcodeId}>
              <Link to={`/topic/${topicId}?${params}`}>
                {cells ? cells[1] : `LC ${leetcodeId}`}
              </Link>
              {cells && (
                <span className="concept-practice-meta">
                  LC {leetcodeId} · {cells[cells.length - 1]}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function SectionConceptMap({
  concept,
  sectionId,
  forceOpen,
  topicId,
  sectionSlug,
  questionRows,
}) {
  const [isOpen, setIsOpen] = useState(Boolean(forceOpen))

  // If the URL flips on the concept-open flag after mount, open the panel.
  // Compare-to-last pattern avoids a set-state-in-effect lint hit.
  const [lastForce, setLastForce] = useState(forceOpen)
  if (lastForce !== forceOpen) {
    setLastForce(forceOpen)
    if (forceOpen) setIsOpen(true)
  }

  const hint = concept.signals?.length
    ? 'crux · how to spot it · example · code · practice'
    : 'crux · key concepts · points to ponder · code'

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
        <span className="concept-map-toggle-hint">{hint}</span>
      </button>

      {isOpen && (
        <div className="concept-map-body" id={`concept-${sectionId}`}>
          {concept.crux && (
            <div className="concept-block concept-crux">
              <div className="concept-label">Crux</div>
              <p>{concept.crux}</p>
            </div>
          )}

          <ConceptList
            label="How to spot it"
            items={concept.signals}
            className="concept-signals"
          />
          <ConceptList
            label="Looks similar, but isn't"
            items={concept.notThis}
            className="concept-not-this"
          />
          <ConceptList label="Key concepts" items={concept.concepts} />

          {concept.example && <WorkedExample example={concept.example} />}

          {concept.code && (
            <div className="concept-block concept-code">
              <div className="concept-label">Code sketch</div>
              <ReactMarkdown rehypePlugins={REHYPE_PLUGINS}>
                {`\`\`\`python\n${concept.code}\n\`\`\``}
              </ReactMarkdown>
            </div>
          )}

          {concept.complexity && (
            <div className="concept-block">
              <div className="concept-label">Complexity</div>
              <p className="concept-complexity">{concept.complexity}</p>
            </div>
          )}

          <ConceptList
            label="Common pitfalls"
            items={concept.pitfalls}
            className="concept-pitfalls"
          />
          <ConceptList label="Points to ponder" items={concept.pointsToPonder} />

          {concept.practice?.length > 0 && (
            <PracticeList
              practice={concept.practice}
              questionRows={questionRows}
              topicId={topicId}
              sectionSlug={sectionSlug}
            />
          )}

          {concept.snippet && (
            <div className="concept-block">
              <Link
                className="concept-snippet-link"
                to={`/topic/${topicId}?tab=snippets&section=${concept.snippet}`}
              >
                See the full C++ template →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
