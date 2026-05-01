import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',           href: '#home' },
  { label: 'Election Types', href: '#election-types' },
  { label: 'Timeline',       href: '#timeline' },
  { label: 'EVM & VVPAT',   href: '#evm-guide' },
  { label: 'Free Tools',     href: '#free-tools' },
  { label: 'Ask AI',         href: '#chat' },
  { label: 'FAQ',            href: '#faq' },
  { label: 'Myths vs Facts', href: '#myths' },
]

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800"
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16" aria-label="Main navigation">
        <a href="#home" className="flex items-center gap-2 font-display text-lg text-navy-900 dark:text-white" aria-label="TN Election Guide — Home">
          <span aria-hidden="true" className="text-2xl">🗳️</span>
          <span className="hidden sm:block font-bold">TN Election Guide</span>
          <span className="sm:hidden font-bold">ElectionGuide</span>
        </a>

        <ul className="hidden xl:flex items-center gap-0.5" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden lg:inline-flex items-center gap-1 text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-2.5 py-1">
            🆓 All Free
          </span>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="xl:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle navigation menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pb-4">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
