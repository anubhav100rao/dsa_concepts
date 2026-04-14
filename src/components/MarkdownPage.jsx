import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import topics from '../topics'

export default function MarkdownPage() {
  const { topicId } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const topic = topicId
    ? topics.find((t) => t.id === topicId)
    : topics.find((t) => t.id === 'home')

  useEffect(() => {
    if (!topic) return
    setLoading(true)
    fetch(`/content/${topic.file}`)
      .then((res) => res.text())
      .then((text) => {
        setContent(text)
        setLoading(false)
        window.scrollTo(0, 0)
      })
      .catch(() => {
        setContent('# Error\nFailed to load content.')
        setLoading(false)
      })
  }, [topic])

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

  if (loading) {
    return (
      <div className="markdown-page">
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading {topic.title}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="markdown-page">
      <article className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
