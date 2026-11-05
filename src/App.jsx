import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { PortalTransitionProvider } from './context/PortalTransitionContext'
import PortalLight from './components/PortalLight'
import WebGLErrorBoundary from './components/WebGLErrorBoundary'

// Components & Layout
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Loader from './components/Loader/Loader'
import Ambient3DBackground from './components/Ambient3DBackground'
import KineticSpotlight from './components/KineticSpotlight'

// Lazy-Loaded Top-Level Pages (Strict Multi-Page Separation)
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const About = lazy(() => import('./pages/About'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Projects = lazy(() => import('./pages/Projects'))
const Skills = lazy(() => import('./pages/Skills'))
const Contact = lazy(() => import('./pages/Contact'))

// Lazy-Loaded 3D Project Detail Pages
const NerAccess = lazy(() => import('./pages/projects/NerAccess'))
const LinkedX = lazy(() => import('./pages/projects/LinkedX'))
const IntelliPDF = lazy(() => import('./pages/projects/IntelliPDF'))
const SolveX = lazy(() => import('./pages/projects/SolveX'))
const AtlasCore = lazy(() => import('./pages/projects/AtlasCore'))

// Styles
import './styles/global.css'
import './styles/navigation.css'
import './App.css'

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid var(--warm-border)',
            borderTopColor: 'var(--sage-green)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Loading Studio Canvas...
        </span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

function GlobalErrorFallback() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-heading)',
          fontSize: '2rem',
          marginBottom: '16px',
        }}
      >
        Studio Canvas Restoring...
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '24px' }}>
        Please select a destination below to continue exploring:
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/"
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            background: 'var(--sage-green)',
            color: '#FAF6F0',
            textDecoration: 'none',
          }}
        >
          Home
        </a>
        <a
          href="/gallery"
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--warm-border)',
            color: 'var(--text-heading)',
            textDecoration: 'none',
          }}
        >
          Gallery
        </a>
        <a
          href="/projects"
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--warm-border)',
            color: 'var(--text-heading)',
            textDecoration: 'none',
          }}
        >
          Projects
        </a>
        <a
          href="/about"
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--warm-border)',
            color: 'var(--text-heading)',
            textDecoration: 'none',
          }}
        >
          About
        </a>
        <a
          href="/contact"
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--warm-border)',
            color: 'var(--text-heading)',
            textDecoration: 'none',
          }}
        >
          Contact
        </a>
      </div>
    </div>
  )
}

// Inner routes component wired to useLocation() for strict single-page mounting
function AnimatedAppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Top-Level Independent Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />

          {/* Individual 3D Interactive Project Detail Routes */}
          <Route path="/projects/ner-access" element={<NerAccess />} />
          <Route path="/projects/linkedx" element={<LinkedX />} />
          <Route path="/projects/intellipdf" element={<IntelliPDF />} />
          <Route path="/projects/solvex-ner" element={<SolveX />} />
          <Route path="/projects/solvex" element={<SolveX />} />
          <Route path="/projects/atlascore" element={<AtlasCore />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Quick artistic entrance splash (500ms)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <PortalTransitionProvider>
          <ScrollToTop />
          <CustomCursor />
          <PortalLight />

          <AnimatePresence mode="wait">
            {loading ? (
              <Loader key="loader" />
            ) : (
              <motion.div
                key="atelier-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="app"
              >
                <Ambient3DBackground />
                <KineticSpotlight />
                <Navbar />

                <main style={{ position: 'relative', zIndex: 1 }}>
                  <WebGLErrorBoundary fallback={<GlobalErrorFallback />}>
                    <AnimatedAppRoutes />
                  </WebGLErrorBoundary>
                </main>

                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        </PortalTransitionProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
