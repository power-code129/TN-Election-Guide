import { useEffect, useState } from 'react'
import { api } from '../hooks/useApi'

const FALLBACK = [
  { id: 1, name: 'Voter Helpline App', provider: 'ECI (Free)', icon: '📱', description: 'Official free ECI app — register to vote, find your booth, download free e-EPIC, track application status.', link: 'https://play.google.com/store/apps/details?id=com.eci.citizen', platform: 'Android / iOS' },
  { id: 2, name: 'cVIGIL App', provider: 'ECI (Free)', icon: '📸', description: 'Report Model Code of Conduct violations with photo/video. Location auto-tagged. 100-minute resolution guarantee.', link: 'https://play.google.com/store/apps/details?id=in.nic.cvigil', platform: 'Android / iOS' },
  { id: 3, name: 'Saksham App', provider: 'ECI (Free)', icon: '♿', description: 'Free app for PwD (Persons with Disabilities) voters — request wheelchair, assistance, and accessibility at your polling booth.', link: 'https://play.google.com/store/apps/details?id=in.gov.eci.saksham', platform: 'Android / iOS' },
  { id: 4, name: 'voters.eci.gov.in', provider: 'ECI (Free)', icon: '🌐', description: 'Register free, check voter list, download free e-EPIC, update address, find polling booth — all free online.', link: 'https://voters.eci.gov.in', platform: 'Web (Free)' },
  { id: 5, name: '1950 Voter Helpline', provider: 'ECI (Free Call)', icon: '📞', description: 'Free national voter helpline for all election queries — multilingual support, available during election periods.', link: 'tel:1950', platform: 'Phone (Free)' },
  { id: 6, name: 'elections.tn.gov.in', provider: 'TN CEO (Free)', icon: '🏛️', description: 'Tamil Nadu Chief Electoral Officer portal — free voter services, election results, booth finder, and TN-specific updates.', link: 'https://elections.tn.gov.in', platform: 'Web (Free)' },
]

const GOOGLE_FREE = [
  { name: 'Google Gemini API', tier: 'Free Tier', icon: '✨', detail: '1,500 requests/day free via AI Studio. No billing required. Powers this app\'s AI chat assistant.', link: 'https://aistudio.google.com/app/apikey', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  { name: 'Google Fonts', tier: '100% Free', icon: '🔤', detail: 'Nunito & DM Serif Display fonts served free via fonts.googleapis.com — no usage limits.', link: 'https://fonts.google.com', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { name: 'Google Analytics (GA4)', tier: '100% Free', icon: '📊', detail: 'Free website analytics — track visitor engagement, popular sections, and usage patterns. No billing required.', link: 'https://analytics.google.com', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  { name: 'Firebase Hosting', tier: 'Free Spark Plan', icon: '🔥', detail: '10GB storage, 360MB/day transfer free. No billing. Deploys this React frontend in seconds with HTTPS included.', link: 'https://firebase.google.com/docs/hosting', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
]

export default function FreeTools() {
  const [tools, setTools] = useState(FALLBACK)

  useEffect(() => {
    api.free_tools().then(d => setTools(d.tools)).catch(() => {})
  }, [])

  return (
    <section id="free-tools" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="tools-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🆓 All Free — No Payment Required
          </div>
          <h2 id="tools-heading" className="section-title">
            Free Tools for <span className="text-navy-700 dark:text-navy-400">Every Voter</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Every resource used in this platform — and every service available to you as a voter — is completely free
          </p>
        </div>

        {/* Free Google Services used in this app */}
        <div className="mb-14">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🇬</span>
            Free Google Services Powering This App
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOOGLE_FREE.map((g) => (
              <a
                key={g.name}
                href={g.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block card border hover:shadow-md transition-all duration-200 ${g.color} no-underline`}
                aria-label={`${g.name} — ${g.tier}`}
              >
                <div className="text-3xl mb-3" aria-hidden="true">{g.icon}</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{g.name}</div>
                <span className="inline-block text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full mb-2">
                  {g.tier}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{g.detail}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Free ECI voter tools */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🗳️</span>
            Free ECI Tools for Tamil Nadu Voters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <article
                key={tool.id}
                className="card hover:shadow-md transition-all duration-200 animate-slide-up flex flex-col"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-navy-50 dark:bg-navy-900/40 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tool.name}</h4>
                      <span className="flex-shrink-0 text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </div>
                    <p className="text-xs text-navy-600 dark:text-navy-400 font-medium mb-2">{tool.provider}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{tool.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span aria-hidden="true">📲</span> {tool.platform}
                  </span>
                  <a
                    href={tool.link}
                    target={tool.link.startsWith('tel') ? undefined : '_blank'}
                    rel={tool.link.startsWith('tel') ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white transition-colors"
                    aria-label={`Open ${tool.name}`}
                  >
                    {tool.link.startsWith('tel') ? 'Call Now' : 'Open Free'}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom banner */}
        <div className="mt-12 bg-gradient-to-r from-navy-800 to-navy-600 rounded-2xl p-6 text-white text-center">
          <div className="text-3xl mb-2" aria-hidden="true">🆓</div>
          <h3 className="font-bold text-lg mb-2">Your Vote. Your Right. Always Free.</h3>
          <p className="text-white/75 text-sm max-w-2xl mx-auto">
            Voting in India is a fundamental right guaranteed by the Constitution. Voter registration, EPIC cards,
            polling booths, EVM usage, and all ECI services are provided free of charge to every eligible citizen.
            If anyone asks you to pay for voting services, report it immediately to <strong>1950</strong> or the free <strong>cVIGIL app</strong>.
          </p>
        </div>
      </div>
    </section>
  )
}
