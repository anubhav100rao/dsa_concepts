import { NavLink } from 'react-router-dom'
import topics from '../topics'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <span className="sidebar-logo">🧠</span>
            DSA Sheet
          </h1>
        </div>
        <nav className="sidebar-nav">
          {topics.map((topic) => (
            <NavLink
              key={topic.id}
              to={topic.id === 'home' ? '/' : `/topic/${topic.id}`}
              end={topic.id === 'home'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{topic.icon}</span>
              <div className="sidebar-link-content">
                <span className="sidebar-link-title">{topic.title}</span>
                {topic.id !== 'home' && (
                  <span className="sidebar-link-meta">
                    {topic.problems} problems
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
