import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import MarkdownPage from './components/MarkdownPage'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            <Route path="/topic/:topicId" element={<MarkdownPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
