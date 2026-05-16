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
