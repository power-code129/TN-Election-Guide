export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: 'linear-gradient(135deg, #000e52 0%, #0022aa 50%, #1a50ff 100%)' }}
      aria-labelledby="hero-heading"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/3 -left-40 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl" aria-hidden="true" />

      {/* Tricolour top bar */}
      <div className="absolute top-0 left-0 right-0 flex h-1.5" aria-hidden="true">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-600" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/80 text-sm font-semibold mb-8">
          <span aria-hidden="true">🇮🇳</span>
          <span>Tamil Nadu & Indian Election Education Platform</span>
        </div>

        <h1 id="hero-heading" className="font-display text-5xl md:text-7xl text-white leading-tight mb-6">
          Understand<br />
          <span style={{ color: '#f5c842' }}>Tamil Nadu</span> Elections
        </h1>

        <p className="text-white/75 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-4">
          From voter registration and EPIC cards to EVM voting, Lok Sabha, Tamil Nadu Assembly,
          Panchayat elections — all explained simply and clearly.
        </p>
        <p className="text-white/50 text-base mb-12">
          Powered by the Election Commission of India (ECI) knowledge base & AI
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-2xl text-lg hover:bg-navy-50 active:scale-95 transition-all shadow-xl"
          >
            <span aria-hidden="true">💬</span>
            Ask the AI Guide
          </a>
          <a
            href="#timeline"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-2xl text-lg border-2 border-white/30 hover:border-white/60 hover:bg-white/10 active:scale-95 transition-all"
          >
            <span aria-hidden="true">📋</span>
            Election Timeline
          </a>
          <a
            href="#evm-guide"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-2xl text-lg border-2 border-white/30 hover:border-white/60 hover:bg-white/10 active:scale-95 transition-all"
          >
            <span aria-hidden="true">🗳️</span>
            How to Vote (EVM)
          </a>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { value: '234', label: 'TN Assembly Seats' },
            { value: '39', label: 'Lok Sabha MPs (TN)' },
            { value: '7', label: 'Election Phases' },
            { value: 'EVM', label: '+ VVPAT Voting' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="font-display text-3xl text-yellow-400 mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            { label: '📋 Register to Vote', href: 'https://voters.eci.gov.in', external: true },
            { label: '🔍 Check Voter List', href: 'https://electoralsearch.eci.gov.in', external: true },
            { label: '🌐 TN CEO Portal', href: 'https://elections.tn.gov.in', external: true },
            { label: '📞 Helpline 1950', href: 'tel:1950', external: false },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 text-sm font-medium transition-colors"
            >
              {link.label}
              {link.external && <span aria-label="opens in new tab" className="text-white/40 text-xs">↗</span>}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
