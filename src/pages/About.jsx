import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PaletteMixer from '../components/PaletteMixer'
import soundEngine from '../utils/soundEngine'
import './About.css'

// Smooth Non-Shaking Reveal for About
const aboutPageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function About() {
  return (
    <motion.div
      className="about-page"
      variants={aboutPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Header */}
      <motion.section className="about-hero" variants={fadeUp}>
        <div className="container">
          <span className="atelier-eyebrow">Artist Biography &amp; Philosophy</span>
          <h1 className="atelier-title">
            An <em>Artist’s Mind</em>.<br />A Creator’s Universe.
          </h1>
          <p className="about-hero__lead">
            Harish S is a multidisciplinary artist and creative developer based in Tamil Nadu, India, operating at the fertile intersection where traditional oil painting craftsmanship meets interactive 3D digital environments.
          </p>
        </div>
      </motion.section>

      {/* Main Architectural Split: Left Portrait & Studio Vitals, Right Biography & Pillars */}
      <section className="about-story">
        <div className="container about-story__grid">
          {/* Left Column: Full Uncut Museum Portrait Frame & Studio Vitals */}
          <motion.aside className="about-portrait-col" variants={fadeUp}>
            {/* Museum Portrait Frame (Exclusively Here — Never Cut in Half) */}
            <div className="museum-frame about-portrait-frame">
              <div className="about-portrait-matte">
                <img
                  src="/optimized-assets/harish-portrait-bw.jpg"
                  alt="Harish S — Multidisciplinary Artist & Creative Technologist"
                  className="about-portrait-img"
                />
                <div className="about-portrait-badge">
                  <span className="badge-sparkle">✦</span>
                  <span>Harish S • Atelier 2007</span>
                </div>
              </div>
              <div className="about-portrait-caption">
                <span className="caption-name">Harish S</span>
                <span className="caption-role">Multidisciplinary Artist &amp; Creative Technologist</span>
                <span className="caption-detail">Realistic Oil Painting × 3D Spatial Systems</span>
              </div>
            </div>

            {/* Studio Vitals */}
            <div className="vitals-card">
              <h3 className="vitals-title">Studio Vitals</h3>
              <ul className="vitals-list">
                <li>
                  <span className="v-label">Identity</span>
                  <span className="v-val">Harish S</span>
                </li>
                <li>
                  <span className="v-label">Disciplines</span>
                  <span className="v-val">Oil Painting, 3D WebGL, Creative Dev</span>
                </li>
                <li>
                  <span className="v-label">Core Mediums</span>
                  <span className="v-val">Oil on Linen, Ink, React, Three.js</span>
                </li>
                <li>
                  <span className="v-label">Origin</span>
                  <span className="v-val">Tamil Nadu, India</span>
                </li>
                <li>
                  <span className="v-label">Email</span>
                  <a href="mailto:hsenthilkumar68@gmail.com" className="v-link">
                    hsenthilkumar68@gmail.com
                  </a>
                </li>
                <li>
                  <span className="v-label">Phone</span>
                  <a href="tel:+919597461434" className="v-link">
                    +91 95974 61434
                  </a>
                </li>
                <li>
                  <span className="v-label">Network</span>
                  <a
                    href="https://www.linkedin.com/in/harish-senthilkumar-7b95b035a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v-link v-linkedin"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </motion.aside>

          {/* Right Column: Editorial Biography & Pillars */}
          <motion.div className="about-story__content" variants={fadeUp}>
            <div className="story-block">
              <span className="story-badge">ORIGIN &amp; CRAFT</span>
              <h2 className="story-title">The Classical Atelier Foundation</h2>
              <p>
                Before writing a line of code or compiling a 3D shader, Harish spent countless hours before the physical easel. Working with oil on linen, charcoal on paper, and ink on vellum instilled a profound respect for materiality, patience, and light.
              </p>
              <p>
                In traditional oil painting, light is not a computational variable — it is constructed through delicate layers of glaze, subtle value gradients, and chromatic temperature shifts. This deep tactile foundation dictates Harish's distinct approach to digital design: interfaces should not feel sterile or purely computational; they should breathe with the depth and texture of physical artistry.
              </p>
            </div>

            <div className="story-block">
              <span className="story-badge">TRANSMUTATION</span>
              <h2 className="story-title">Bridging Canvas to 3D Space</h2>
              <p>
                Moving from the two-dimensional canvas into interactive 3D web experiences was a natural evolution of Harish's spatial imagination. The principles that govern a compelling portrait — focal hierarchy, chiaroscuro contrast, anatomical rhythm, and emotional resonance — translate directly into 3D camera choreography, ambient lighting setups, and fluid motion physics.
              </p>
              <p>
                Harish does not view technology as a replacement for human art; rather, technology is the contemporary canvas. Through WebGL, Three.js, and modern frontend architecture, he creates digital spaces that transport visitors into an artist's living imagination.
              </p>
            </div>

            {/* Artist Statement Blockquote */}
            <blockquote className="artist-quote-box">
              <p className="artist-quote-text">
                "Art is the discipline of seeing what others merely glance past. Technology is the architecture that allows others to step inside that vision."
              </p>
              <cite className="artist-quote-author">— Harish S, Atelier Imagination</cite>
            </blockquote>

            {/* The Four Studio Pillars */}
            <div className="about-pillars-sub">
              <span className="story-badge">METHODOLOGY</span>
              <h2 className="story-title">The Four Studio Pillars</h2>

              <div className="pillars-grid-compact">
                <div className="pillar-item">
                  <span className="pillar-num">01</span>
                  <div className="pillar-info">
                    <h4 className="pillar-item-title">Classical Oil Craftsmanship</h4>
                    <p className="pillar-item-p">
                      Rooted in realistic figurative painting, study of anatomy, tonal value control, and chiaroscuro lighting.
                    </p>
                  </div>
                </div>

                <div className="pillar-item">
                  <span className="pillar-num">02</span>
                  <div className="pillar-info">
                    <h4 className="pillar-item-title">Imaginative 3D Worlds</h4>
                    <p className="pillar-item-p">
                      Building bespoke spatial environments, custom WebGL geometry, dynamic lighting systems, and tactile digital surfaces.
                    </p>
                  </div>
                </div>

                <div className="pillar-item">
                  <span className="pillar-num">03</span>
                  <div className="pillar-info">
                    <h4 className="pillar-item-title">Visual Storytelling</h4>
                    <p className="pillar-item-p">
                      Crafting narrative sequential art, character psychology, and evocative pacing that pulls audiences into the creator's universe.
                    </p>
                  </div>
                </div>

                <div className="pillar-item">
                  <span className="pillar-num">04</span>
                  <div className="pillar-info">
                    <h4 className="pillar-item-title">Collaborative Synergy</h4>
                    <p className="pillar-item-p">
                      Working closely with engineers and creative peers to turn bold experimental concepts into robust, accessible software.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="about-story-actions">
              <Link
                to="/gallery"
                className="btn-sage"
                onMouseEnter={() => soundEngine.playHoverTick()}
              >
                <span>Enter Art Gallery (7 Works)</span>
                <span>→</span>
              </Link>
              <Link
                to="/projects"
                className="btn-terracotta-outline"
                onMouseEnter={() => soundEngine.playHoverTick()}
              >
                <span>Explore 3D Lab Projects</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 1: Interactive Color-to-Code Pigment Mixer */}
      <section className="container about-mixer-section" style={{ marginTop: '50px' }}>
        <PaletteMixer />
      </section>
    </motion.div>
  )
}
