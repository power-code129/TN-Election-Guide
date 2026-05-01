import { useEffect, useState } from 'react'
import { api } from '../hooks/useApi'

const FALLBACK_MYTHS = [
  { id: 1, myth: 'EVMs can be hacked or tampered remotely', fact: "India's EVMs have no Wi-Fi, Bluetooth, internet, or network connectivity. Standalone machines made by BEL/ECIL under strict ECI supervision. Supreme Court and multiple expert committees confirmed their integrity. VVPAT provides additional paper audit trail." },
  { id: 2, myth: 'One vote doesn\'t matter in Tamil Nadu', fact: 'Several Tamil Nadu assembly constituencies have been decided by under 500 votes. In 2021 TN elections, multiple segments had margins under 1,000 votes. Your single vote can be the deciding factor.' },
  { id: 3, myth: 'You need Voter ID to vote — nothing else works', fact: 'ECI accepts 12 alternative photo IDs at booths: Aadhaar, PAN card, passport, driving licence, MNREGA job card, bank passbook with photo, and more. If registered, you can vote with any approved photo ID.' },
  { id: 4, myth: 'Indelible ink can be washed off to vote twice', fact: "Indelible ink contains silver nitrate and penetrates beneath the skin's surface — it cannot be washed off. Remains visible 2–4 weeks. Attempting to vote twice is a criminal offence under Section 171D IPC." },
  { id: 5, myth: 'NOTA majority means the election is re-held', fact: 'NOTA (None Of The Above) was introduced in 2013. Even if NOTA gets the highest votes, the candidate with the next highest count wins. NOTA does not trigger a re-election under current Indian law.' },
]

export default function Myths() {
  const [myths, setMyths] = useState(FALLBACK_MYTHS)
  const [flipped, setFlipped] = useState({})

  useEffect(() => {
    api.myths().then(d => setMyths(d.myths)).catch(() => {})
  }, [])

  function toggle(id) {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="myths" className="py-20 bg-slate-50 dark:bg-slate-950" aria-labelledby="myths-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            ⚡ Election Fact Check
          </div>
          <h2 id="myths-heading" className="section-title">
            Myths vs <span className="text-navy-700 dark:text-navy-400">Facts</span>
          </h2>
          <p className="section-subtitle">Common misconceptions about Indian elections — debunked</p>
          <p className="text-sm text-slate-400 mt-2">Click any card to reveal the truth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myths.map((item, i) => {
            const isFlipped = flipped[item.id]
            return (
              <div
                key={item.id}
                className="relative h-64 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => toggle(item.id)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(item.id)}
                tabIndex={0}
                role="button"
                aria-pressed={isFlipped}
                aria-label={`Myth ${i + 1}: ${item.myth}. Press to see the fact.`}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front — Myth */}
                  <div
                    className="absolute inset-0 bg-red-600 rounded-2xl p-6 flex flex-col justify-between shadow-md"
                    style={{ backfaceVisibility: 'hidden' }}
                    aria-hidden={isFlipped}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">❌ MYTH</span>
                        <span className="text-white/60 text-xs">Click to fact-check</span>
                      </div>
                      <p className="text-white font-bold text-lg leading-snug">"{item.myth}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs">#{i + 1}</span>
                      <span className="text-white/50 text-xs">Tap to flip →</span>
                    </div>
                  </div>

                  {/* Back — Fact */}
                  <div
                    className="absolute inset-0 bg-green-700 rounded-2xl p-6 flex flex-col justify-between shadow-md"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    aria-hidden={!isFlipped}
                  >
                    <div>
                      <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full mb-4 inline-block">✅ FACT</span>
                      <p className="text-white text-sm leading-relaxed mt-2">{item.fact}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs">#{i + 1}</span>
                      <span className="text-white/50 text-xs">← Tap to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ECI reminder */}
        <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3" aria-hidden="true">🏛️</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">
            Trust Only Official Sources
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            For official election information, always refer to{' '}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-navy-700 dark:text-navy-300 underline hover:no-underline">eci.gov.in</a>,{' '}
            <a href="https://elections.tn.gov.in" target="_blank" rel="noopener noreferrer" className="text-navy-700 dark:text-navy-300 underline hover:no-underline">elections.tn.gov.in</a>, or call{' '}
            <a href="tel:1950" className="text-navy-700 dark:text-navy-300 font-bold">1950</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
