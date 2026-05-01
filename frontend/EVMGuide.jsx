import { useState } from 'react'

const EVM_STEPS = [
  {
    step: 1,
    icon: '🪪',
    title: 'Verify Your Identity',
    description: 'Arrive at your designated polling booth with your EPIC (Voter ID) or any 1 of 12 ECI-approved photo IDs (Aadhaar, PAN, passport, driving licence, etc.).',
    tip: 'Your polling booth details are printed on your EPIC card and available at elections.tn.gov.in',
  },
  {
    step: 2,
    icon: '📋',
    title: 'Electoral Roll Verification',
    description: 'The polling officer finds your name and serial number in the electoral roll register. You sign or give your thumb impression in the register.',
    tip: 'If your name is not found, ask for the Presiding Officer — do not leave without trying.',
  },
  {
    step: 3,
    icon: '🖊️',
    title: 'Indelible Ink',
    description: 'The polling officer applies indelible ink on your left index finger. This ink contains silver nitrate and cannot be washed off for 2–4 weeks — preventing double voting.',
    tip: 'The ink is proof you have voted. It is painless and safe.',
  },
  {
    step: 4,
    icon: '🗳️',
    title: 'Cast Your Vote on EVM',
    description: 'Enter the voting compartment privately. The Ballot Unit lists all candidates with their name, party name, and election symbol. Press the Blue Button next to your chosen candidate. A beep and blinking red light confirm the vote.',
    tip: 'You can press only ONE button. The machine locks after one vote per ballot button press by the officer.',
  },
  {
    step: 5,
    icon: '🧾',
    title: 'VVPAT Confirmation',
    description: 'The VVPAT (Voter Verified Paper Audit Trail) machine beside the EVM prints a slip showing your chosen candidate\'s name, serial number, and party symbol. It is visible through a transparent window for exactly 7 seconds, then falls into a sealed box.',
    tip: 'If the VVPAT slip shows the wrong candidate, inform the Presiding Officer immediately.',
  },
  {
    step: 6,
    icon: '✅',
    title: 'Vote Cast — You\'re Done!',
    description: 'Your secret ballot is recorded in the EVM. Leave the booth quietly. Your vote is completely secret — no one can know how you voted.',
    tip: 'You may receive a Voter Slip before entering. Keep it safe — it helps re-confirm your details.',
  },
]

const MACHINES = [
  {
    name: 'Control Unit',
    icon: '🎛️',
    color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    description: 'Operated by the polling officer. Has a Ballot Button that enables one vote at a time. Stores all votes securely. Manufacturer: BEL / ECIL.',
    facts: ['Stores up to 2,000 votes', 'Has no internet/Bluetooth/Wi-Fi', 'Tamper-proof sealed units', 'Result displayed on screen during counting'],
  },
  {
    name: 'Ballot Unit',
    icon: '🗳️',
    color: 'bg-navy-50 dark:bg-navy-900/30 border-navy-200 dark:border-navy-800',
    description: 'The unit you see in the voting compartment. Shows all candidates with Blue Buttons. Press once for your choice. Connected to Control Unit by a 5-metre cable.',
    facts: ['Lists all contesting candidates', 'Candidate name, party & symbol visible', 'One Blue Button per candidate', 'NOTA (None of the Above) at the bottom'],
  },
  {
    name: 'VVPAT Machine',
    icon: '🧾',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    description: 'Prints a verification slip after every vote. Visible for 7 seconds through a window. The slip falls into a sealed, tamper-proof box automatically. Used for audit trail.',
    facts: ['Slip visible 7 seconds', 'Paper trail for verification', '5 random booths verified per segment during counting', 'Introduced in 2013; expanded to all booths by 2019'],
  },
]

export default function EVMGuide() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <section id="evm-guide" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="evm-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            🗳️ How Voting Works in India
          </div>
          <h2 id="evm-heading" className="section-title">
            EVM + VVPAT<br /><span className="text-navy-700 dark:text-navy-400">Voting Guide</span>
          </h2>
          <p className="section-subtitle">Step-by-step: what happens inside the polling booth</p>
        </div>

        {/* The 3 machines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {MACHINES.map((m) => (
            <article key={m.name} className={`card border ${m.color}`}>
              <div className="text-4xl mb-3" aria-hidden="true">{m.icon}</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{m.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{m.description}</p>
              <ul className="space-y-1.5" aria-label={`Key facts about ${m.name}`}>
                {m.facts.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-navy-500 dark:text-navy-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Step-by-step voting guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step selector */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Voting Steps</h3>
            <nav aria-label="Voting steps navigation">
              <ol className="space-y-2">
                {EVM_STEPS.map((s) => (
                  <li key={s.step}>
                    <button
                      onClick={() => setActiveStep(s.step)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                        activeStep === s.step
                          ? 'bg-navy-800 text-white shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      aria-current={activeStep === s.step ? 'step' : undefined}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        activeStep === s.step ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {s.step}
                      </span>
                      <span className="text-sm font-semibold">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Step detail */}
          <div className="lg:col-span-2">
            {EVM_STEPS.filter(s => s.step === activeStep).map((s) => (
              <div key={s.step} className="card h-full animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-navy-100 dark:bg-navy-900/40 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy-600 dark:text-navy-400 bg-navy-50 dark:bg-navy-900/40 px-2 py-0.5 rounded-full">
                      Step {s.step} of {EVM_STEPS.length}
                    </span>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mt-1">{s.title}</h3>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{s.description}</p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
                  <span className="text-amber-500 text-lg flex-shrink-0" aria-hidden="true">💡</span>
                  <p className="text-amber-800 dark:text-amber-300 text-sm">{s.tip}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  {activeStep > 1 && (
                    <button
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="btn-secondary flex-1 sm:flex-none"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeStep < EVM_STEPS.length && (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="btn-primary flex-1 sm:flex-none"
                    >
                      Next Step →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security banner */}
        <div className="mt-10 bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span aria-hidden="true">🔒</span> EVM Security Facts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📡', text: 'No Wi-Fi, Bluetooth, or internet connection' },
              { icon: '🏭', text: 'Manufactured by BEL & ECIL under ECI supervision' },
              { icon: '🔏', text: 'Tamper-evident seals on all units' },
              { icon: '🔬', text: 'Verified by Supreme Court & technical committees' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">{f.icon}</span>
                <p className="text-white/75 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
