import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import MarkdownPage from './components/MarkdownPage'
import './App.css'

const DONE_QUESTIONS_STORAGE_KEY = 'dsa-platform:done-questions'

function getStoredDoneQuestions() {
  try {
    const storedQuestions = window.localStorage.getItem(
      DONE_QUESTIONS_STORAGE_KEY,
    )
    return storedQuestions ? JSON.parse(storedQuestions) : {}
  } catch {
    return {}
  }
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [doneQuestions, setDoneQuestions] = useState(getStoredDoneQuestions)

  const toggleQuestionDone = (questionId) => {
    setDoneQuestions((current) => {
      const nextQuestions = { ...current }

      if (nextQuestions[questionId]) {
        delete nextQuestions[questionId]
      } else {
        nextQuestions[questionId] = true
      }

      return nextQuestions
    })
  }

  const setQuestionsDone = (questionIds, isDone) => {
    setDoneQuestions((current) => {
      const nextQuestions = { ...current }

      questionIds.forEach((questionId) => {
        if (isDone) {
          nextQuestions[questionId] = true
        } else {
          delete nextQuestions[questionId]
        }
      })

      return nextQuestions
    })
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DONE_QUESTIONS_STORAGE_KEY,
        JSON.stringify(doneQuestions),
      )
    } catch {
      // If storage is unavailable or full, the in-memory state still works.
    }
  }, [doneQuestions])

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="topbar-title">DSA Learning Platform</span>
          <a
            className="topbar-github"
            href="https://github.com/anubhav100rao/dsa_concepts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            title="View source on GitHub"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35 0.5 12 0.5z" />
            </svg>
            <span className="topbar-github-label">GitHub</span>
          </a>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/topic/:topicId"
              element={
                <MarkdownPage
                  doneQuestions={doneQuestions}
                  onToggleQuestionDone={toggleQuestionDone}
                  onSetQuestionsDone={setQuestionsDone}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
