import { useEffect, useState } from 'react'
import { api } from '../hooks/useApi'

const FALLBACK_TIMELINE = [
  { id: 1, phase: 'Voter Registration', icon: '📋', duration: 'Ongoing — deadline ~30 days before polling', description: 'Register using Form 6 at voters.eci.gov.in. BLO verifies and EPIC (Voter ID) is issued.', steps: ['Check eligibility: citizen, 18+, resident', 'Fill Form 6 at voters.eci.gov.in', 'Upload Aadhaar + address proof', 'BLO field verification', 'Receive EPIC or download e-EPIC'] },
  { id: 2, phase: 'Election Announcement & MCC', icon: '📢', duration: '4–6 weeks before polling', description: 'ECI announces schedule. Model Code of Conduct (MCC) comes into force immediately.', steps: ['ECI announces polling dates', 'MCC enforced — no new schemes', 'Parties register manifestos', 'Returning Officers issue notifications'] },
  { id: 3, phase: 'Candidate Nomination', icon: '🏛️', duration: '5–7 day window', description: 'Candidates file nomination with Returning Officer along with Form 26 affidavit and security deposit.', steps: ['File nomination form + Form 26', 'Pay deposit (₹25,000 LS / ₹10,000 Assembly)', 'Scrutiny by Returning Officer', 'Withdrawal period — final list published'] },
  { id: 4, phase: 'Campaign Period', icon: '🗣️', duration: '2–3 weeks', description: 'Candidates campaign through rallies, media, social media within ECI limits. Ends 48 hours before polling.', steps: ['Public rallies and town halls', 'TV/radio debates', 'Social media (MCMC monitored)', 'Silence period 48 hrs before polls'] },
  { id: 5, phase: 'Polling Day', icon: '🗳️', duration: '7 AM – 6 PM', description: 'Voters bring EPIC or alternate ID, get finger inked, cast vote on EVM. VVPAT confirms choice.', steps: ['Bring EPIC or 1 of 12 approved IDs', 'Polling officer checks electoral roll', 'Indelible ink on left index finger', 'Press Blue Button on EVM', 'VVPAT slip confirms vote — 7 seconds'] },
  { id: 6, phase: 'Vote Counting', icon: '🔢', duration: 'ECI-notified counting day', description: 'EVMs from strong rooms counted round-by-round. VVPAT slips from 5 random booths verified. Winner declared.', steps: ['EVMs moved under CCTV + security', 'Postal ballots counted first', 'EVM count displayed round-by-round', 'VVPAT verification', 'Returning Officer declares winner'] },
  { id: 7, phase: 'Government Formation', icon: '🏛️', duration: 'Days after results', description: 'Majority party forms government. TN: Governor invites CM, sworn at Raj Bhavan. Delhi: President invites PM.', steps: ['Majority identified (118+ TN / 272+ LS)', 'Governor/President invites leader', 'Floor test if coalition needed', 'Cabinet sworn in', 'New government begins term'] },
]

export default function Timeline() {
  const [phases, setPhases] = useState(FALLBACK_TIMELINE)
  const [active, setActive] = useState(null)

  useEffect(() => {
    api.timeline().then(d => setPhases(d.timeline)).catch(() => {})
  }, [])

  return (
    <section id="timeline" className="py-20 bg-slate-50 dark:bg-slate-950" aria-labelledby="timeline-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            📅 Step-by-Step Process
          </div>
          <h2 id="timeline-heading" className="section-title">
            Indian Election <span className="text-navy-700 dark:text-navy-400">Timeline</span>
          </h2>
          <p className="section-subtitle">Click any phase to see the detailed steps</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy-800 to-navy-400 -translate-x-1/2 hidden sm:block" aria-hidden="true" />

          <div className="space-y-6">
            {phases.map((phase, i) => {
              const isLeft = i % 2 === 0
              const isOpen = active === phase.id
              return (
                <div
                  key={phase.id}
                  className={`relative flex flex-col sm:flex-row gap-4 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start sm:items-center`}
                >
                  {/* Center dot */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-navy-800 dark:bg-navy-600 rounded-full items-center justify-center text-xl shadow-lg z-10" aria-hidden="true">
                    {phase.icon}
                  </div>

                  {/* Card */}
                  <div className={`w-full sm:w-5/12 ${isLeft ? 'sm:mr-auto sm:pr-8' : 'sm:ml-auto sm:pl-8'}`}>
                    <button
                      onClick={() => setActive(isOpen ? null : phase.id)}
                      className="w-full text-left card hover:shadow-md transition-all duration-200 cursor-pointer group"
                      aria-expanded={isOpen}
                      aria-controls={`phase-steps-${phase.id}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="sm:hidden text-2xl" aria-hidden="true">{phase.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-navy-600 dark:text-navy-400 bg-navy-50 dark:bg-navy-900/40 px-2 py-0.5 rounded-full">
                              Step {phase.id}
                            </span>
                            <svg
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white mt-1 group-hover:text-navy-700 dark:group-hover:text-navy-300 transition-colors">
                            {phase.phase}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                        <span aria-hidden="true">⏱️</span> {phase.duration}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{phase.description}</p>

                      {isOpen && (
                        <div id={`phase-steps-${phase.id}`} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <ol className="space-y-2" aria-label={`Steps for ${phase.phase}`}>
                            {phase.steps.map((step, si) => (
                              <li key={si} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                <span className="flex-shrink-0 w-5 h-5 bg-navy-100 dark:bg-navy-900/50 text-navy-700 dark:text-navy-300 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                  {si + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
