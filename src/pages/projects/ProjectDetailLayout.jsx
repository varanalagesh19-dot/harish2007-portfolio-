import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePortalTransition } from '../../context/PortalTransitionContext'
import soundEngine from '../../utils/soundEngine'
import './ProjectDetail.css'

// Smooth Non-Shaking Project Detail Reveal
const projectDetailVariants = {
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
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export default function ProjectDetailLayout({
  id,
  title,
  subtitle,
  category,
  year,
  role,
  overview,
  challenge,
  solution,
  canvasComponent: CanvasComponent,
  features = [],
  techStack = [],
  prevProject,
  nextProject,
}) {
  const { triggerPortalNavigation } = usePortalTransition()

  const handleNav = (e, path) => {
    e.preventDefault()
    triggerPortalNavigation(path)
  }

  return (
    <motion.div
      className="project-detail-page"
      variants={projectDetailVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top Header & Breadcrumbs */}
      <div className="container project-detail__header">
        <Link
          to="/projects"
          className="project-detail__back-btn"
          onMouseEnter={() => soundEngine.playHoverTick()}
          onClick={(e) => handleNav(e, '/projects')}
        >
          <span className="arrow">←</span>
          <span>Back to All Projects</span>
        </Link>

        {/* Mandatory Collaborative Notice */}
        <div className="project-detail__collab-banner">
          <span className="collab-icon">✦</span>
          <span>Built through collaboration, experimentation and creative teamwork.</span>
        </div>
      </div>

      {/* Hero Title & Meta */}
      <section className="container project-detail__hero">
        <div className="project-detail__title-row">
          <div>
            <span className="atelier-eyebrow">{category} • {year}</span>
            <h1 className="atelier-title">{title}</h1>
            <p className="project-detail__subtitle">{subtitle}</p>
          </div>
          <div className="project-detail__meta-box">
            <div className="meta-item">
              <span className="meta-label">Domain</span>
              <span className="meta-val">{category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Creative Focus</span>
              <span className="meta-val">{role}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Nature</span>
              <span className="meta-val">Collaborative Team Exploration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Canvas Showcase */}
      <section className="container project-detail__canvas-section">
        <div className="canvas-frame">
          <div className="canvas-header-bar">
            <div className="canvas-status">
              <span className="canvas-indicator"></span>
              <span>Spatial 3D Model • 60 FPS WebGL</span>
            </div>
            <span className="canvas-tip">Drag & Move to Orbit</span>
          </div>
          <div className="canvas-wrapper">
            <CanvasComponent />
          </div>
        </div>
      </section>

      {/* Project Narrative & Deep Dive */}
      <section className="container project-detail__narrative">
        <div className="narrative-grid">
          <div className="narrative-main">
            <div className="narrative-block">
              <h2 className="narrative-heading">Project Overview</h2>
              <p className="narrative-text">{overview}</p>
            </div>

            <div className="narrative-block">
              <h3 className="narrative-subheading">The Challenge & Conceptualization</h3>
              <p className="narrative-text">{challenge}</p>
            </div>

            <div className="narrative-block">
              <h3 className="narrative-subheading">Collaborative Solution & Artistry</h3>
              <p className="narrative-text">{solution}</p>
            </div>

            {/* Key Capabilities */}
            <div className="narrative-block">
              <h3 className="narrative-subheading">Key Functional Capabilities</h3>
              <ul className="capabilities-list">
                {features.map((feat, idx) => (
                  <li key={idx} className="capability-card">
                    <span className="capability-index">0{idx + 1}</span>
                    <div>
                      <h4 className="capability-title">{feat.title}</h4>
                      <p className="capability-desc">{feat.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar: Tech Stack & Teammate Note */}
          <aside className="narrative-sidebar">
            <div className="sidebar-card">
              <h4 className="sidebar-heading">Applied Technologies</h4>
              <div className="tech-tags-list">
                {techStack.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="sidebar-card sidebar-card--highlight">
              <h4 className="sidebar-heading">Collaborative Spirit</h4>
              <p className="sidebar-text">
                This project was forged in a collaborative team setting where ideas, code, and creative experiments came together through shared effort and multidisciplinary synergy.
              </p>
              <div className="team-credit">
                <span>Collective Innovation</span>
              </div>
            </div>

            <div className="sidebar-card">
              <h4 className="sidebar-heading">Inquiries</h4>
              <p className="sidebar-text">
                Interested in discussing the technical architecture or design explorations behind this project?
              </p>
              <Link
                to="/contact"
                className="btn-sage"
                style={{ width: '100%', justifyContent: 'center' }}
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={(e) => handleNav(e, '/contact')}
              >
                <span>Contact Harish</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Next / Previous Project Navigation */}
      <section className="container project-detail__nav-footer">
        <div className="project-nav-split">
          {prevProject ? (
            <Link
              to={prevProject.path}
              className="project-nav-link prev"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={(e) => handleNav(e, prevProject.path)}
            >
              <span className="nav-dir">← Previous Project</span>
              <span className="nav-title">{prevProject.title}</span>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              to={nextProject.path}
              className="project-nav-link next"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={(e) => handleNav(e, nextProject.path)}
            >
              <span className="nav-dir">Next Project →</span>
              <span className="nav-title">{nextProject.title}</span>
            </Link>
          ) : <div />}
        </div>
      </section>
    </motion.div>
  )
}
