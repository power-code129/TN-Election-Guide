import { useEffect, useState } from 'react'
import { api } from '../hooks/useApi'

const FALLBACK_FAQS = [
  { id: 1, question: 'Who can register as a voter in India?', answer: 'Any Indian citizen aged 18+ on the qualifying date (1 January) who is ordinarily resident in a constituency. NRIs can also register under Section 20A of the Representation of the People Act, 1950.', category: 'Eligibility' },
  { id: 2, question: 'What documents are needed to get a Voter ID (EPIC)?', answer: 'For Form 6: Age proof (Aadhaar, birth certificate, school leaving certificate) + Address proof (Aadhaar, passport, utility bill) + passport-size photo. Apply at voters.eci.gov.in or the Voter Helpline App.', category: 'Voter ID / EPIC' },
  { id: 3, question: 'How do I check my name in the Tamil Nadu voter list?', answer: 'Visit electoralsearch.eci.gov.in or elections.tn.gov.in. Search by name, age, and constituency. Also: call 1950, use the Voter Helpline App, or check display rolls at designated offices.', category: 'Voter List' },
  { id: 4, question: 'Can I use Aadhaar instead of Voter ID at the booth?', answer: 'Yes. ECI accepts 12 alternative photo IDs: Aadhaar, passport, driving licence, PAN card, MNREGA job card, bank/post office passbook with photo, and others notified by ECI.', category: 'Voting' },
  { id: 5, question: 'What is the difference between Lok Sabha and TN Assembly elections?', answer: 'Lok Sabha: 543 national constituencies; elects MPs; 272+ = Central Government. Tamil Nadu Assembly: 234 state constituencies; elects MLAs; 118+ = State Government. Both use EVM+VVPAT and are conducted by ECI.', category: 'Types of Elections' },
  { id: 6, question: 'How are Panchayat elections different in Tamil Nadu?', answer: 'Tamil Nadu Panchayat and Municipal elections are conducted by TNSEC (not ECI). Covers village panchayats, panchayat unions, district panchayats, municipalities, and corporations. Women reservation: 33–50%.', category: 'Local Body' },
  { id: 7, question: 'What is the Model Code of Conduct?', answer: 'MCC is ECI guidelines from announcement to results. Prevents ruling government from announcing new schemes, misusing resources, or making inflammatory speeches. Report violations to Returning Officer or call 1950.', category: 'Rules' },
  { id: 8, question: 'What if my EPIC is lost or damaged?', answer: 'Apply for duplicate EPIC using Form 002 at voters.eci.gov.in. You can download e-EPIC (digital PDF Voter ID) from the portal by verifying your registered mobile number. e-EPIC is valid at polling booths.', category: 'Voter ID / EPIC' },
  { id: 9, question: 'Can I vote from outside my home constituency?', answer: 'You must vote where registered. Service voters (armed forces, central govt employees) get postal ballots. NRIs can apply for proxy voting. ECI\'s Facility for Migrants pilot allows remote voting in select elections.', category: 'Special Cases' },
  { id: 10, question: 'What is the role of the District Election Officer in Tamil Nadu?', answer: 'The DEO (District Collector) manages electoral rolls, polling booth setup, security deployment, EVM/VVPAT logistics, MCC enforcement, and counting centre operations. Reports to CEO Tamil Nadu at elections.tn.gov.in.', category: 'Administration' },
]

const CATEGORY_COLORS = {
  Eligibility: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Voter ID / EPIC': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Voter List': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Voting: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Types of Elections': 'bg-navy-100 text-navy-700 dark:bg-navy-900/30 dark:text-navy-300',
  'Local Body': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Rules: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Special Cases': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Administration: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

export default function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS)
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.faq().then(d => setFaqs(d.faqs)).catch(() => {})
  }, [])

  const categories = ['All', ...new Set(faqs.map(f => f.category))]
  const filtered = filter === 'All' ? faqs : faqs.filter(f => f.category === filter)

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-900" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            ❓ Common Questions
          </div>
          <h2 id="faq-heading" className="section-title">
            Frequently Asked <span className="text-navy-700 dark:text-navy-400">Questions</span>
          </h2>
          <p className="section-subtitle">Everything you need to know about Indian elections</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center" role="group" aria-label="Filter FAQs by category">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === cat
                  ? 'bg-navy-800 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-pressed={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <dl className="space-y-3">
          {filtered.map((faq) => (
            <div key={faq.id} className="card">
              <dt>
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full text-left flex items-start gap-3"
                  aria-expanded={open === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[faq.category] || CATEGORY_COLORS.Administration}`}>
                        {faq.category}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200 ${open === faq.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </dt>
              {open === faq.id && (
                <dd id={`faq-answer-${faq.id}`} className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </dd>
              )}
            </div>
          ))}
        </dl>

        {/* Useful links */}
        <div className="mt-12 bg-navy-50 dark:bg-navy-900/20 rounded-2xl p-6">
          <h3 className="font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <span aria-hidden="true">🔗</span> Official Election Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Register / Get EPIC — voters.eci.gov.in', href: 'https://voters.eci.gov.in' },
              { label: 'Check Voter List — electoralsearch.eci.gov.in', href: 'https://electoralsearch.eci.gov.in' },
              { label: 'TN CEO Portal — elections.tn.gov.in', href: 'https://elections.tn.gov.in' },
              { label: 'ECI Results — results.eci.gov.in', href: 'https://results.eci.gov.in' },
              { label: 'Voter Helpline — 1950', href: 'tel:1950' },
              { label: 'TNSEC — tnlbse.tn.gov.in', href: 'https://tnlbse.tn.gov.in' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                <span className="text-navy-400" aria-hidden="true">→</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
