import { lazy, Suspense } from 'react'
import { useDarkMode } from './hooks/useDarkMode'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const ElectionTypes = lazy(() => import('./components/ElectionTypes'))
const Timeline      = lazy(() => import('./components/Timeline'))
const EVMGuide      = lazy(() => import('./components/EVMGuide'))
const FreeTools     = lazy(() => import('./components/FreeTools'))
const Chat          = lazy(() => import('./components/Chat'))
const FAQ           = lazy(() => import('./components/FAQ'))
const Myths         = lazy(() => import('./components/Myths'))

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24" aria-label="Loading section">
      <div className="w-8 h-8 border-4 border-navy-200 border-t-navy-700 rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-navy-800 focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <Navbar dark={dark} setDark={setDark} />

      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionLoader />}><ElectionTypes /></Suspense>
        <Suspense fallback={<SectionLoader />}><Timeline /></Suspense>
        <Suspense fallback={<SectionLoader />}><EVMGuide /></Suspense>
        <Suspense fallback={<SectionLoader />}><FreeTools /></Suspense>
        <Suspense fallback={<SectionLoader />}><Chat /></Suspense>
        <Suspense fallback={<SectionLoader />}><FAQ /></Suspense>
        <Suspense fallback={<SectionLoader />}><Myths /></Suspense>
      </main>

      <Footer />
    </div>
  )
}
