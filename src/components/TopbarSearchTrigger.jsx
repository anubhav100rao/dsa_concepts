// The visible "Search… ⌘K" button in the topbar. Clicking opens the palette;
// the same palette also responds to the global ⌘K / Ctrl+K / "/" hotkey
// registered in App.jsx.

function isMac() {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
}

export default function TopbarSearchTrigger({ onOpen }) {
  const mod = isMac() ? '⌘' : 'Ctrl'
  return (
    <button
      type="button"
      className="topbar-search-trigger"
      onClick={onOpen}
      aria-label="Open search"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="topbar-search-label">Search problems, concepts…</span>
      <kbd className="topbar-search-kbd">
        <span>{mod}</span>
        <span>K</span>
      </kbd>
    </button>
  )
}
