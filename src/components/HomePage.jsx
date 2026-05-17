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
          LeetCode problems across <strong>10 core topics</strong> and{' '}
          <strong>245+ sub-categories</strong>
        </p>
        <p className="home-tagline">
          Built for everyone preparing for technical interviews — at every
          level, from your first coding round to advanced deep dives.
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
              <h3>Expert</h3>
              <span className="phase-weeks">Week 7-8</span>
            </div>
            <ul>
              <li>DP — digit DP, game theory, SOS, profile</li>
              <li>Graphs — SCC, Euler, flow, LCA, centroid decomposition</li>
              <li>Range Queries — segment tree, BIT, lazy propagation</li>
              <li>Cross-topic combination problems</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-contribute">
        <div className="home-contribute-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35 0.5 12 0.5z" />
          </svg>
        </div>
        <div className="home-contribute-body">
          <h2>Contribute on GitHub</h2>
          <p>
            Found a bug, a typo, or a problem that belongs in a different
            category? Want to add a new pattern, template, or topic? Please
            open a pull request — contributions of every size are welcome.
          </p>
          <div className="home-contribute-actions">
            <a
              className="home-contribute-btn primary"
              href="https://github.com/anubhav100rao/dsa_concepts/pulls"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open a Pull Request
            </a>
            <a
              className="home-contribute-btn"
              href="https://github.com/anubhav100rao/dsa_concepts/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an Issue
            </a>
            <a
              className="home-contribute-btn"
              href="https://github.com/anubhav100rao/dsa_concepts"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repository
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
