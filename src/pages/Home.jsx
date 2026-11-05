import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import soundEngine from '../utils/soundEngine'
import './Home.css'

// Gentle Landing-Page Reveal (Subtle, clean, 60fps)
const homeVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
}

export default function Home() {
  return (
    <motion.div
      className="home-page"
      variants={homeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container home-container">
        {/* ===================================================
            HERO MONUMENT SECTION
            =================================================== */}
        <section className="home-hero-center">
          <div className="home-overline-wrap">
            <span className="home-overline-badge">
              ATELIER IMAGINATION • HARISH S
            </span>
          </div>

          <h1 className="home-monument-title">HARISH S</h1>

          <div className="home-taglines-block">
            <h2 className="home-tagline-primary">
              Where <em>Imagination</em> Becomes Reality.
            </h2>
            <p className="home-tagline-secondary">
              An Artist's Mind. A Creator's Universe.
            </p>
          </div>

          <p className="home-poetic-lead">
            Multidisciplinary Artist, Creative Developer & Spatial Explorer bridging classical realistic oil painting, fine chiaroscuro draftsmanship, and sequential Japanese manga with interactive 3D WebGL architectures.
          </p>

          {/* Primary Action Buttons */}
          <div className="home-pill-nav">
            <Link
              to="/explore"
              className="home-nav-pill home-nav-pill--portal"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span className="pill-dot" />
              <span>Enter 3D Colonnade</span>
              <span className="pill-arrow">✦</span>
            </Link>

            <Link
              to="/gallery"
              className="home-nav-pill home-nav-pill--primary"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>Explore Art Gallery</span>
              <span className="pill-arrow">→</span>
            </Link>

            <Link
              to="/projects"
              className="home-nav-pill home-nav-pill--secondary"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>View 3D Lab Projects</span>
              <span className="pill-arrow">→</span>
            </Link>

            <Link
              to="/about"
              className="home-nav-pill home-nav-pill--ghost"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>Biography & Pillars</span>
              <span className="pill-arrow">→</span>
            </Link>
          </div>
        </section>

        <div className="home-hairline" />

        {/* ===================================================
            IMMERSIVE 3D EXPLORE TEASER BANNER
            =================================================== */}
        <section className="home-portal-teaser">
          <div className="teaser-inner">
            <div className="teaser-content">
              <span className="teaser-badge">SPATIAL NAVIGATION</span>
              <h3 className="teaser-title">The Five Atelier Portals</h3>
              <p className="teaser-desc">
                Step inside an interactive 3D European museum salon featuring physically modeled architectural doors leading into About, Art Gallery, Projects, Skills, and Contact.
              </p>
            </div>
            <Link
              to="/explore"
              className="teaser-cta-button"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>Launch 3D Explore</span>
              <span className="cta-icon">🏛️</span>
            </Link>
          </div>
        </section>

        {/* ===================================================
            FOUR CREATIVE PILLARS
            =================================================== */}
        <section className="home-pillars-section">
          <div className="section-head">
            <span className="section-kicker">FOUNDATIONS</span>
            <h2 className="section-title">Four Creative Pillars</h2>
            <p className="section-sub">
              The disciplined artistic principles and technical mastery that define Harish's dual studio practice.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-num">01</span>
              <h4 className="pillar-title">Classical Realism & Oil Painting</h4>
              <p className="pillar-text">
                Trained in anatomical accuracy, chiaroscuro lighting, and wet-on-wet glazing. Translating the luminous weight of traditional masterworks onto physical linen.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">02</span>
              <h4 className="pillar-title">Sequential Narrative & Manga Inks</h4>
              <p className="pillar-text">
                Dynamic panel pacing, emotional character depth, and sharp dip-pen cross-hatching that drives story and dramatic graphic tension.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">03</span>
              <h4 className="pillar-title">Spatial WebGL & Creative Code</h4>
              <p className="pillar-text">
                Crafting performant 60fps Three.js environments, GLSL fragment shaders, and procedural physical simulations that immerse visitors into spatial dimensions.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-num">04</span>
              <h4 className="pillar-title">Architectural Frontend Engineering</h4>
              <p className="pillar-text">
                Production-grade React 19 architecture, strict type contracts, GSAP animation orchestration, and museum-grade typographic systems.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            3-COLUMN ARCHITECTURAL INDEX
            =================================================== */}
        <section className="home-architectural-index">
          <Link
            to="/gallery"
            className="index-column"
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <div className="index-col-header">
              <span className="index-num">01</span>
              <span className="index-tag">MUSEUM EXHIBITION</span>
            </div>
            <h3 className="index-title">Physical Artworks</h3>
            <p className="index-desc">
              Seven original physical masterworks spanning realistic portraiture, chiaroscuro studies, and sequential manga in museum frames.
            </p>
            <span className="index-link-cue">Enter Exhibition Room →</span>
          </Link>

          <Link
            to="/projects"
            className="index-column"
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <div className="index-col-header">
              <span className="index-num">02</span>
              <span className="index-tag">3D DIGITAL LAB</span>
            </div>
            <h3 className="index-title">Interactive 3D Projects</h3>
            <p className="index-desc">
              Five collaborative web applications pairing spatial WebGL simulations with intelligent software architectures.
            </p>
            <span className="index-link-cue">Launch 3D Spaces →</span>
          </Link>

          <Link
            to="/skills"
            className="index-column"
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <div className="index-col-header">
              <span className="index-num">03</span>
              <span className="index-tag">CREATIVE RIGOR</span>
            </div>
            <h3 className="index-title">Studio Disciplines</h3>
            <p className="index-desc">
              Six authentic disciplines integrating easel oil painting and sequential inks with React architecture and Three.js shaders.
            </p>
            <span className="index-link-cue">Explore Disciplines →</span>
          </Link>
        </section>

        {/* ===================================================
            STUDIO CONTACT TEASER BANNER
            =================================================== */}
        <section className="home-contact-banner">
          <div className="contact-banner-content">
            <span className="contact-banner-overline">DIRECT STUDIO ACCESS</span>
            <h3 className="contact-banner-title">Let's Build Something Exceptional</h3>
            <p className="contact-banner-desc">
              Available for commissions, creative frontend contracts, and collaborative 3D spatial web environments.
            </p>
          </div>
          <div className="contact-banner-actions">
            <Link
              to="/contact"
              className="btn-sage"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>Initiate Dialogue</span>
            </Link>
            <a
              href="mailto:hsenthilkumar68@gmail.com"
              className="btn-contact-outline"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>hsenthilkumar68@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
