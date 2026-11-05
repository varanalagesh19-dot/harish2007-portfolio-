import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectCardVisual from '../components/ProjectCardVisual'
import ProjectHologramModal from '../components/ProjectHologramModal'
import soundEngine from '../utils/soundEngine'
import './Projects.css'

const projects = [
  {
    id: "ner-access",
    path: "/projects/ner-access",
    title: "NER-Access",
    subtitle: "Spatial GIS & Campus Wayfinding",
    category: "Spatial Navigation & GIS",
    year: "2025",
    accent: "sage",
    description: "Interactive 3D campus navigation and spatial GIS wayfinding platform engineered for accessible routing and real-time terrain visualization.",
    tags: ["React", "Three.js", "Vector GIS", "Accessibility Routing", "WebGL"],
    highlight: "Topographic Spline Tracking"
  },
  {
    id: "linkedx",
    path: "/projects/linkedx",
    title: "LinkedX",
    subtitle: "Social Content Analysis",
    category: "Social Analytics & NLP",
    year: "2025",
    accent: "terracotta",
    description: "AI-powered social content intelligence engine visualizing audience sentiment, engagement velocity, and semantic topic clusters.",
    tags: ["React", "Three.js", "NLP Metrics", "Sentiment Graphs", "Spatial Cards"],
    highlight: "3D Sentiment Core"
  },
  {
    id: "intellipdf",
    path: "/projects/intellipdf",
    title: "IntelliPDF",
    subtitle: "Document Intelligence",
    category: "Document AI & Retrieval",
    year: "2025",
    accent: "copper",
    description: "Automated document parsing and semantic extraction pipeline that converts complex unstructured PDFs into structured knowledge graphs.",
    tags: ["React", "Three.js", "Document AI", "Semantic Laser Scan", "Vector Search"],
    highlight: "Laser Scan Synthesizer"
  },
  {
    id: "solvex-ner",
    path: "/projects/solvex-ner",
    title: "SolveX-NER",
    subtitle: "Algorithmic Reasoning",
    category: "Algorithmic Reasoning",
    year: "2024",
    accent: "olive",
    description: "Named-entity recognition and multi-step algorithmic reasoning system built to resolve complex structured queries with high precision.",
    tags: ["React", "Three.js", "Graph Algorithms", "Polyhedral Nodes", "Proof Engine"],
    highlight: "Dynamic Logic Constellation"
  },
  {
    id: "atlascore",
    path: "/projects/atlascore",
    title: "AtlasCore",
    subtitle: "Conversational AI",
    category: "Conversational AI",
    year: "2024",
    accent: "sage",
    description: "Next-generation conversational AI architecture featuring contextual memory retention, real-time voice synthesis, and neural state visualization.",
    tags: ["React", "Three.js", "Audio Ribbons", "Orbital Memory", "Spatial UI"],
    highlight: "Harmonic Neural Sphere"
  }
]

// Smooth Non-Shaking Projects Reveal
const projectsContainerVariants = {
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

const blueprintFlipItem = {
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

export default function Projects() {
  const [activeHologramProject, setActiveHologramProject] = useState(null)

  return (
    <motion.div
      className="projects-page"
      variants={projectsContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <section className="container projects-hero">
        <div className="projects-hero__header">
          <div>
            <span className="atelier-eyebrow">Digital Atelier • 3D Showcase</span>
            <h1 className="atelier-title">
              The <em>Interactive</em> Projects
            </h1>
            <p className="projects-hero__lead">
              Five exploratory web applications combining spatial 3D WebGL interfaces with intelligent software architectures. Each project features its own dedicated interactive 3D simulation room.
            </p>
          </div>

          {/* Mandatory Collaboration Badge */}
          <div className="projects-collab-badge">
            <span className="collab-sparkle">✦</span>
            <div>
              <span className="collab-title">Collaborative Foundations</span>
              <p className="collab-text">
                Built through collaboration, experimentation and creative teamwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Cards Grid */}
      <section className="container projects-grid-section">
        <div className="projects-grid">
          {projects.map((proj, idx) => (
            <motion.article
              key={proj.id}
              variants={blueprintFlipItem}
              className="project-card"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              {/* Dedicated 220px High Visual Preview Banner (Click for 3D Hologram) */}
              <div
                className="project-visual-link"
                role="button"
                tabIndex={0}
                onClick={() => {
                  soundEngine.playPortalInteract()
                  setActiveHologramProject(proj)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    soundEngine.playPortalInteract()
                    setActiveHologramProject(proj)
                  }
                }}
                title="Click to inspect 3D Hologram Preview"
              >
                <ProjectCardVisual project={proj} index={idx} />
                <div className="holo-preview-hint-badge">
                  <span>✦ Click for 3D Hologram Preview</span>
                </div>
              </div>

              {/* Card Information */}
              <div className="project-card__body">
                <div className="project-meta-row">
                  <span className="project-category">{proj.category}</span>
                  <span className="project-year">{proj.year}</span>
                </div>

                <h3 className="project-title">{proj.title}</h3>
                <p className="project-subtitle">{proj.subtitle}</p>

                <p className="project-desc">{proj.description}</p>

                {/* Tech Tags */}
                <div className="project-tags">
                  {proj.tags.map((t, i) => (
                    <span key={i} className="proj-tag">{t}</span>
                  ))}
                </div>

                {/* Action Buttons: 3D Hologram Popup + Dedicated 3D Room */}
                <div className="project-actions">
                  <button
                    type="button"
                    className="btn-ghost holo-card-btn"
                    onClick={() => {
                      soundEngine.playPortalInteract()
                      setActiveHologramProject(proj)
                    }}
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    title="Open interactive 3D Hologram Preview"
                  >
                    <span>🔮 3D Hologram</span>
                  </button>

                  <Link
                    to={proj.path}
                    className="btn-sage project-launch-btn"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                  >
                    <span>Dedicated 3D Room</span>
                    <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Feature 2: Glassmorphic 3D Hologram Modal */}
      {activeHologramProject && (
        <ProjectHologramModal
          project={activeHologramProject}
          onClose={() => setActiveHologramProject(null)}
        />
      )}

      {/* Collaborative Culture Statement */}
      <section className="container projects-philosophy">
        <div className="projects-philosophy__card">
          <span className="atelier-eyebrow">Creative Synergy</span>
          <h2 className="philosophy-title">The Art of Collaborative Building</h2>
          <p className="philosophy-p">
            True innovation rarely happens in a vacuum. Just as Renaissance studios relied on dialogue between master draughtsmen, color grinders, and architects, modern software development flourishes through shared experimentation, healthy debate, and multidisciplinary peer teamwork.
          </p>
          <p className="philosophy-p">
            Every project presented in this portfolio represents the collective energy of teammates and peers who contributed ideas, testing, code architectures, and shared vision to push digital boundaries forward.
          </p>
          <div className="philosophy-quote">
            <span>"Built through collaboration, experimentation and creative teamwork."</span>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
