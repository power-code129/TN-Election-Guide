const QUICK_LINKS = [
  { label: 'Election Types',   href: '#election-types' },
  { label: 'Election Timeline', href: '#timeline' },
  { label: 'EVM & VVPAT Guide', href: '#evm-guide' },
  { label: 'Free Voter Tools',  href: '#free-tools' },
  { label: 'Ask AI Guide',      href: '#chat' },
  { label: 'FAQ',               href: '#faq' },
  { label: 'Myths vs Facts',    href: '#myths' },
]

const OFFICIAL_LINKS = [
  { label: 'Election Commission of India', href: 'https://eci.gov.in' },
  { label: 'Register to Vote (Free)',      href: 'https://voters.eci.gov.in' },
  { label: 'Check Voter List (Free)',      href: 'https://electoralsearch.eci.gov.in' },
  { label: 'TN CEO Portal (Free)',         href: 'https://elections.tn.gov.in' },
  { label: 'TNSEC Local Body Elections',   href: 'https://tnlbse.tn.gov.in' },
  { label: 'ECI Results (Free)',           href: 'https://results.eci.gov.in' },
]

const FREE_GOOGLE = [
  { name: 'Gemini API',      tier: 'Free Tier',      icon: '✨' },
  { name: 'Google Fonts',    tier: '100% Free',       icon: '🔤' },
  { name: 'Google Analytics',tier: '100% Free (GA4)', icon: '📊' },
  { name: 'Firebase Hosting',tier: 'Free Spark Plan', icon: '🔥' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white" role="contentinfo">
      {/* Tricolour stripe */}
      <div className="flex h-1.5" aria-hidden="true">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">🗳️</span>
              <span className="font-display text-xl">TN Election Guide</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              A free, AI-powered educational platform helping Tamil Nadu citizens understand
              the Indian election process — from free voter registration to government formation.
            </p>
            <div className="flex flex-col gap-1.5 mb-4">
              <a href="tel:1950" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <span aria-hidden="true">📞</span> Free Helpline: 1950
              </a>
              <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <span aria-hidden="true">🌐</span> eci.gov.in
              </a>
            </div>
            {/* Free badge */}
            <div className="inline-flex items-center gap-1.5 bg-green-900/40 border border-green-700/50 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" aria-hidden="true" />
              <span className="text-green-300 text-xs font-semibold">100% Free Google Services</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Quick Links</h3>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official resources */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Official Resources</h3>
            <ul className="space-y-2" role="list">
              {OFFICIAL_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                    {link.label}
                    <span className="text-white/30 text-xs" aria-label="opens in new tab">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer card */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">About This Project</h3>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-lg flex-shrink-0" aria-hidden="true">👩‍💻</div>
                <div>
                  <div className="font-bold text-white text-sm">Priyanka Gandhi A</div>
                  <div className="text-white/50 text-xs">Developer</div>
                </div>
              </div>
              <dl className="space-y-2 text-xs text-white/60 mb-4">
                <div className="flex items-start gap-1.5">
                  <span aria-hidden="true">🎓</span>
                  <dd>B.E Electronics and Communication Engineering</dd>
                </div>
                <div className="flex items-start gap-1.5">
                  <span aria-hidden="true">🏫</span>
                  <dd>Avinashilingam Institute for Home Science and Higher Education for Women</dd>
                </div>
                <div className="flex items-start gap-1.5">
                  <span aria-hidden="true">🏆</span>
                  <dd>Google Services Challenge — Election Process Education</dd>
                </div>
              </dl>

              {/* Free Google services used */}
              <div className="border-t border-white/10 pt-3">
                <p className="text-white/40 text-xs mb-2">Free Google Services Used:</p>
                <div className="space-y-1">
                  {FREE_GOOGLE.map(s => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span className="text-xs text-white/60 flex items-center gap-1">
                        <span aria-hidden="true">{s.icon}</span> {s.name}
                      </span>
                      <span className="text-xs bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded-full">{s.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} TN Election Guide — Educational platform for civic awareness.
            Not affiliated with ECI or any political party.
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true">🇮🇳</span>
            Made free in Tamil Nadu, India
          </p>
        </div>
      </div>
    </footer>
  )
}
