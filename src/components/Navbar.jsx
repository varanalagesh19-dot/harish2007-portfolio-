import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import AudioToggle from './AudioToggle'
import FocusToggle from './FocusToggle'
import soundEngine from '../utils/soundEngine'
import '../styles/navigation.css'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/gallery', label: 'Art Gallery' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header className={`atelier-header ${scrolled ? 'atelier-header--scrolled' : ''}`}>
      <div className="atelier-header__inner">
        {/* Brand Monogram */}
        <Link
          to="/"
          className="atelier-brand"
          onMouseEnter={() => soundEngine.playHoverTick()}
        >
          <span className="atelier-brand__mark">H</span>
          <div className="atelier-brand__info">
            <span className="atelier-brand__title">Harish S</span>
            <span className="atelier-brand__sub">Atelier Imagination</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Direct, Clean React Router Navigation) */}
        <nav className="atelier-desktop-nav" aria-label="Main Navigation">
          <ul className="atelier-nav-list">
            {navLinks.map((item) => (
              <li key={item.path} className="atelier-nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  className={({ isActive }) =>
                    `atelier-nav-link ${isActive ? 'atelier-nav-link--active' : ''} ${item.isSpecial ? 'atelier-nav-link--special' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          className="atelier-nav-link__bar"
                          layoutId="navUnderline"
                          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions: Focus Mode, Audio Toggle, Theme Toggle & Contact Button */}
        <div className="atelier-header__actions">
          <FocusToggle />
          <AudioToggle />
          <ThemeToggle />

          <Link
            to="/contact"
            className="btn-sage atelier-header__cta"
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span>Let's Connect</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`atelier-burger ${mobileMenuOpen ? 'atelier-burger--active' : ''}`}
            onClick={() => {
              soundEngine.playHoverTick()
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="atelier-mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="atelier-mobile-drawer__links">
              {navLinks.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `atelier-mobile-link ${isActive ? 'atelier-mobile-link--active' : ''}`
                  }
                >
                  <span className="atelier-mobile-link__num">0{idx + 1}</span>
                  <span className="atelier-mobile-link__label">{item.label}</span>
                  <span className="atelier-mobile-link__arrow">→</span>
                </NavLink>
              ))}
              <div className="atelier-mobile-drawer__footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FocusToggle />
                </div>
                <Link
                  to="/contact"
                  className="btn-sage"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Initiate Dialogue</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
