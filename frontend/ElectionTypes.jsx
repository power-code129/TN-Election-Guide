import { useEffect, useState } from 'react'
import { api } from '../hooks/useApi'

const FALLBACK = [
  { id: 1, title: 'Lok Sabha Elections', subtitle: 'Parliament of India', icon: '🏛️', seats: 543, tn_seats: 39, frequency: 'Every 5 years', conductor: 'ECI', description: 'India\'s lower house. 543 directly elected MPs. Tamil Nadu elects 39. Party winning 272+ seats forms Central Government.' },
  { id: 2, title: 'Rajya Sabha Elections', subtitle: 'Council of States', icon: '🏅', seats: 245, tn_seats: 18, frequency: 'Biennial', conductor: 'ECI', description: 'Upper house. Members elected by State MLAs using STV — not directly by citizens. Tamil Nadu sends 18 members.' },
  { id: 3, title: 'Tamil Nadu Assembly', subtitle: 'Vidhan Sabha — 234 Constituencies', icon: '⚖️', seats: 234, tn_seats: 234, frequency: 'Every 5 years', conductor: 'ECI', description: '234 constituencies each elect one MLA. Party winning 118+ seats forms TN State Government. Last election: 2021.' },
  { id: 4, title: 'Panchayat / Municipal', subtitle: 'Local Body Elections', icon: '🏘️', seats: null, tn_seats: null, frequency: 'Every 5 years', conductor: 'TNSEC', description: 'Conducted by TNSEC. Covers village panchayats, municipalities, and corporations. Women reservation: 33–50%.' },
]

const CONDUCTOR_COLORS = {
  ECI: 'bg-navy-100 text-navy-800 dark:bg-navy-900/40 dark:text-navy-300',
  TNSEC: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
}

export default function ElectionTypes() {
  const [types, setTypes] = useState(FALLBACK)

  useEffect(() => {
    api.election_types && api.election_types().then(d => setTypes(d.election_types)).catch(() => {})
  }, [])

  return (
    <section id="election-types" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="et-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🇮🇳 Types of Elections in India
          </div>
          <h2 id="et-heading" className="section-title">
            Four Levels of<br /><span className="text-navy-700 dark:text-navy-400">Indian Democracy</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From Parliament to your local panchayat — India's multi-tier election system explained
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {types.map((t, i) => (
            <article
              key={t.id}
              className="card hover:shadow-md transition-shadow duration-200 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0" aria-hidden="true">{t.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CONDUCTOR_COLORS[t.conductor] || CONDUCTOR_COLORS.ECI}`}>
                      {t.conductor}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{t.subtitle}</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">{t.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {t.seats && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-center">
                        <div className="font-bold text-navy-700 dark:text-navy-300 text-lg leading-none">{t.seats}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Total Seats</div>
                      </div>
                    )}
                    {t.tn_seats && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2 text-center">
                        <div className="font-bold text-orange-700 dark:text-orange-400 text-lg leading-none">{t.tn_seats}</div>
                        <div className="text-slate-500 text-xs mt-0.5">TN Seats</div>
                      </div>
                    )}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-center">
                      <div className="font-bold text-slate-700 dark:text-slate-300 text-sm leading-none">{t.frequency}</div>
                      <div className="text-slate-500 text-xs mt-0.5">Frequency</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Info banner */}
        <div className="mt-10 bg-navy-50 dark:bg-navy-900/30 border border-navy-200 dark:border-navy-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl flex-shrink-0" aria-hidden="true">ℹ️</div>
          <div>
            <h3 className="font-bold text-navy-900 dark:text-white mb-1">ECI vs TNSEC</h3>
            <p className="text-navy-700 dark:text-navy-300 text-sm">
              <strong>Lok Sabha and State Assembly</strong> elections are conducted by the <strong>Election Commission of India (ECI)</strong> — a constitutional body.
              <strong> Panchayat and Municipal</strong> elections in Tamil Nadu are conducted by the <strong>Tamil Nadu State Election Commission (TNSEC)</strong> — a separate state body.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
