import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpatialParticleWeb from '../components/SpatialParticleWeb'
import soundEngine from '../utils/soundEngine'
import './Skills.css'

const disciplines = [
  {
    num: "01",
    title: "Realistic Oil Painting",
    domain: "Fine Art & Classical Atelier",
    tagline: "The craft of light, pigment, and anatomical truth.",
    mastery: "Master Level",
    overview: "Formed through rigorous easel practice, mastering the alchemy of oils, turpentine, damar varnish, and fine linen. Applying Rembrandt-style chiaroscuro and delicate glazing layers to capture lifelike human presence.",
    techniques: [
      "Chiaroscuro & Value Grading",
      "Skin Undertone Glazing",
      "Impasto Textural Modulation",
      "Linen Stretching & Gesso Priming",
      "Anatomical Proportions & Bone Structure"
    ],
    tools: ["Oil on Linen", "Hog & Sable Brushes", "Palette Knife", "Linseed Oil", "Natural Pigments"]
  },
  {
    num: "02",
    title: "Traditional & Digital Art",
    domain: "Draftsmanship & Concept Art",
    tagline: "Expressive line weight, cross-hatching, and character conceptualization.",
    mastery: "Master Level",
    overview: "Fluid transition between classical physical drawing on Bristol board and digital tablets. Deep command of line dynamics, graphic rhythm, and stylized character silhouettes.",
    techniques: [
      "Sequential Manga Panel Composition",
      "Cross-Hatching & Feathered Inking",
      "Gestural Figure Drawing",
      "Dynamic Perspective & Foreshortening",
      "Character Costume & Drape Physics"
    ],
    tools: ["G-Pen & Maru Pen", "Sumi Black Ink", "Charcoal & Willow", "Graphite 2B-8B", "Drawing Tablet"]
  },
  {
    num: "03",
    title: "Creative Imagination",
    domain: "Conceptual World-Building",
    tagline: "Where surreal metaphors and architectural dreams take shape.",
    mastery: "Core Essence",
    overview: "The ability to look beyond conventional templates and imagine completely original digital spaces. Translating internal emotional landscapes into tangible visual worlds.",
    techniques: [
      "Metaphorical Spatial Architecture",
      "Surrealist Atmospheric Composition",
      "Curated Moodboard Curation",
      "Symbolic Visual Vocabulary",
      "Experimental Design Prototyping"
    ],
    tools: ["Mind Mapping", "Generative Visioning", "Spatial Sketches", "Chromatic Mood Boards"]
  },
  {
    num: "04",
    title: "3D Web Experiences",
    domain: "Spatial Computing & WebGL",
    tagline: "Transforming flat web browsers into immersive 3D realms.",
    mastery: "Advanced WebGL",
    overview: "Engineering interactive Three.js environments that run smoothly at 60 FPS across desktop and mobile. Designing custom geometries, procedural particle systems, and realistic lighting setups.",
    techniques: [
      "Three.js Scene Graph & Camera Rigging",
      "Custom PBR Lighting & Shadow Maps",
      "Parametric Curves & Spline Animation",
      "Particle Emitters & Ambient Shaders",
      "Mobile WebGL Performance Optimization"
    ],
    tools: ["Three.js", "WebGL Shaders", "GSAP ScrollTrigger", "ACESFilmic Tone Mapping", "Raycasting"]
  },
  {
    num: "05",
    title: "Visual Storytelling",
    domain: "Cinematic Narrative & UX",
    tagline: "Guiding the human gaze through emotional pacing and tension.",
    mastery: "Advanced Narrative",
    overview: "Applying cinematic directing principles to digital interfaces. Choreographing scroll sequences, reveal transitions, and typographic rhythm to evoke genuine wonder.",
    techniques: [
      "Editorial Narrative Arc Construction",
      "Visual Hierarchy & Typographic Scale",
      "Atmospheric Lighting Shifts",
      "Emotional Color Theory Distribution",
      "Pacing & Anticipation Timing"
    ],
    tools: ["Editorial Layouts", "Cinematography Rules", "Framer Motion", "Typography Systems"]
  },
  {
    num: "06",
    title: "Creative Website Development",
    domain: "Frontend Architecture & Systems",
    tagline: "Clean, component-driven code that breathes with life.",
    mastery: "Production Architecture",
    overview: "Architecting modular, multi-page web applications with React, Vite, and modern CSS variables. Balancing visual expressiveness with clean architecture and responsive fluidity.",
    techniques: [
      "React 19 & React Router Architecture",
      "Dual-Theme CSS Variable Engines",
      "Framer Motion Page & Scroll Choreography",
      "Fluid Typography & Clamp Calculations",
      "Cross-Browser Responsive Layouts"
    ],
    tools: ["React", "Vite", "React Router", "Modern CSS / PostCSS", "Framer Motion", "Git"]
  }
]

// Smooth Non-Shaking Skills Reveal
const constellationContainer = {
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

const constellationItem = {
  initial: {
    opacity: 0,
    y: 10,
  },
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
    transition: { duration: 0.2 },
  },
}

export default function Skills() {
  const [activeDisciplineNum, setActiveDisciplineNum] = useState("01")

  return (
    <motion.div
      className="skills-page"
      variants={constellationContainer}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <section className="container skills-hero">
        <span className="atelier-eyebrow">Studio Competencies & Disciplines</span>
        <h1 className="atelier-title">
          The <em>Creative</em> Disciplines
        </h1>
        <p className="skills-hero__lead">
          Harish S is not an ordinary website developer. He merges classical oil craftsmanship, expressive draughtsmanship, and spatial 3D WebGL engineering into a singular creative practice.
        </p>
      </section>

      {/* 3D Spatial Particle Web: Interactive Neural Synapse Stream */}
      <section className="container">
        <SpatialParticleWeb
          activeDisciplineNum={activeDisciplineNum}
          onSelectDiscipline={setActiveDisciplineNum}
        />
      </section>

      {/* Six Core Disciplines Bento Grid */}
      <section className="container disciplines-section">
        <div className="disciplines-grid">
          {disciplines.map((item) => (
            <motion.article
              key={item.num}
              variants={constellationItem}
              className={`discipline-card ${activeDisciplineNum === item.num ? 'discipline-card--active-synapse' : ''}`}
              onMouseEnter={() => {
                soundEngine.playHoverTick()
                setActiveDisciplineNum(item.num)
              }}
              onClick={() => {
                soundEngine.playHoverTick()
                setActiveDisciplineNum(item.num)
              }}
            >
              <div className="discipline-header">
                <span className="discipline-num">{item.num}</span>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="discipline-domain">{item.domain}</span>
                    <span className="discipline-mastery-tag">{item.mastery}</span>
                  </div>
                  <h2 className="discipline-title">{item.title}</h2>
                </div>
              </div>

              <p className="discipline-tagline">{item.tagline}</p>
              <p className="discipline-overview">{item.overview}</p>

              {/* Techniques */}
              <div className="discipline-detail-box">
                <h4 className="detail-heading">Signature Techniques</h4>
                <ul className="techniques-list">
                  {item.techniques.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>

              {/* Tools & Mediums */}
              <div className="discipline-tools">
                <h4 className="detail-heading">Tools & Mediums</h4>
                <div className="tools-pills">
                  {item.tools.map((tool, i) => (
                    <span key={i} className="tool-pill">{tool}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Synthesis Section: Why Art Matters in Tech */}
      <section className="container synthesis-section">
        <div className="synthesis-card">
          <div className="synthesis-text">
            <span className="atelier-eyebrow">The Cross-Disciplinary Advantage</span>
            <h2 className="synthesis-title">Why Fine Art Transmutes Code</h2>
            <p className="synthesis-p">
              Most web developers build from components and containers. An artist builds from negative space, focal balance, tonal hierarchy, and emotional presence.
            </p>
            <p className="synthesis-p">
              When you understand how physical oil paint catches real daylight on a canvas, you do not configure WebGL lighting arbitrarily — you know how to make digital surfaces convey weight and warmth.
            </p>
          </div>
          <div className="synthesis-quote-wrap">
            <div className="synthesis-quote-card">
              <span className="synthesis-quote-mark">“</span>
              <p className="synthesis-quote">
                "Where Imagination Becomes Reality."
              </p>
              <span className="synthesis-author">— Harish S</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container skills-cta">
        <div className="skills-cta__inner">
          <div>
            <h3 className="cta-headline">Ready to Experience These Disciplines?</h3>
            <p className="cta-sub">
              Explore the original physical works in the Art Gallery or launch the interactive 3D project environments.
            </p>
          </div>
          <div className="cta-buttons">
            <Link
              to="/gallery"
              className="btn-sage"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>View Artworks</span>
              <span>→</span>
            </Link>
            <Link
              to="/projects"
              className="btn-terracotta-outline"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>View 3D Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
