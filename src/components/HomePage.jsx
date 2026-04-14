import { Link } from 'react-router-dom'
import topics from '../topics'

export default function HomePage() {
  const topicCards = topics.filter((t) => t.id !== 'home')

  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>DSA Concepts</h1>
        <p className="home-subtitle">
          The Ultimate Interview Question Bank — <strong>2,700+</strong>{' '}
          LeetCode problems across <strong>9 core topics</strong> and{' '}
          <strong>225+ sub-categories</strong>
        </p>
        <p className="home-tagline">
          Designed for engineers preparing for Senior / Staff-level technical
          interviews at top-tier companies.
        </p>
      </header>

      <section className="topic-grid">
        {topicCards.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.id}`}
            className="topic-card"
          >
            <div className="topic-card-icon">{topic.icon}</div>
            <div className="topic-card-body">
              <h3>{topic.title}</h3>
              <p className="topic-card-desc">{topic.description}</p>
              <div className="topic-card-stats">
                <span className="stat">
                  <strong>{topic.problems}</strong> problems
                </span>
                <span className="stat">
                  <strong>{topic.categories}</strong> categories
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="home-difficulty">
        <h2>Difficulty Distribution</h2>
        <div className="difficulty-bars">
          <div className="difficulty-row">
            <span className="difficulty-label easy">Easy</span>
            <div className="difficulty-bar">
              <div className="difficulty-fill easy" style={{ width: '7.5%' }} />
            </div>
            <span className="difficulty-count">~200</span>
          </div>
          <div className="difficulty-row">
            <span className="difficulty-label medium">Medium</span>
            <div className="difficulty-bar">
              <div
                className="difficulty-fill medium"
                style={{ width: '55.5%' }}
              />
            </div>
            <span className="difficulty-count">~1,500</span>
          </div>
          <div className="difficulty-row">
            <span className="difficulty-label hard">Hard</span>
            <div className="difficulty-bar">
              <div className="difficulty-fill hard" style={{ width: '37%' }} />
            </div>
            <span className="difficulty-count">~1,000</span>
          </div>
        </div>
      </section>

      <section className="home-study-path">
        <h2>Recommended Study Path</h2>
        <div className="phases">
          <div className="phase">
            <div className="phase-header">
              <span className="phase-num">1</span>
              <h3>Foundations</h3>
              <span className="phase-weeks">Week 1-2</span>
            </div>
            <ul>
              <li>Arrays — two pointers, sliding window, prefix sum</li>
              <li>Binary Search — classic BS, BS on answer</li>
              <li>Stack & Queue — basics, parentheses, monotonic stack</li>
            </ul>
          </div>
          <div className="phase">
            <div className="phase-header">
              <span className="phase-num">2</span>
              <h3>Core Patterns</h3>
              <span className="phase-weeks">Week 3-4</span>
            </div>
            <ul>
              <li>Dynamic Programming — linear, grid, subsequence, knapsack</li>
              <li>Graphs — BFS, DFS, topo sort, union-find</li>
              <li>Two Pointers & Sliding Window</li>
              <li>Greedy — sort+greedy, intervals, jump game</li>
            </ul>
          </div>
          <div className="phase">
            <div className="phase-header">
              <span className="phase-num">3</span>
              <h3>Advanced</h3>
              <span className="phase-weeks">Week 5-6</span>
            </div>
            <ul>
              <li>DP — interval, tree, state machine, bitmask</li>
              <li>Graphs — Dijkstra, Bellman-Ford, MST</li>
              <li>Priority Queue — Top-K, two heaps, k-way merge</li>
              <li>Trie — basic trie, word search, bitwise XOR</li>
            </ul>
          </div>
          <div className="phase">
            <div className="phase-header">
              <span className="phase-num">4</span>
              <h3>Staff-Level</h3>
              <span className="phase-weeks">Week 7-8</span>
            </div>
            <ul>
              <li>DP — digit DP, game theory, SOS, profile</li>
              <li>Graphs — SCC, Euler, flow, LCA, centroid decomposition</li>
              <li>Advanced categories across all topics</li>
              <li>Cross-topic combination problems</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
