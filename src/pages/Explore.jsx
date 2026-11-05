import { motion } from 'framer-motion'
import CinematicPortalDoors from '../components/doors/CinematicPortalDoors'
import WebGLErrorBoundary from '../components/WebGLErrorBoundary'
import { Link } from 'react-router-dom'
import soundEngine from '../utils/soundEngine'
import './Explore.css'

const exploreVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

function ExploreFallback() {
  return (
    <div className="container explore-fallback-container">
      <h2 className="explore-fallback-title">3D Atelier Gallery</h2>
      <p className="explore-fallback-desc">
        Select an architectural portal to enter Harish's portfolio:
      </p>
      <div className="explore-fallback-grid">
        <Link to="/about" className="explore-fallback-card" onClick={() => soundEngine.playHoverTick()}>
          <span className="card-num">01</span>
          <h3>About</h3>
          <p>Biography & 4 Creative Pillars</p>
        </Link>
        <Link to="/gallery" className="explore-fallback-card" onClick={() => soundEngine.playHoverTick()}>
          <span className="card-num">02</span>
          <h3>Art Gallery</h3>
          <p>7 Original Museum Artworks</p>
        </Link>
        <Link to="/projects" className="explore-fallback-card" onClick={() => soundEngine.playHoverTick()}>
          <span className="card-num">03</span>
          <h3>Projects</h3>
          <p>3D WebGL Lab & 5 Interactive Rooms</p>
        </Link>
        <Link to="/skills" className="explore-fallback-card" onClick={() => soundEngine.playHoverTick()}>
          <span className="card-num">04</span>
          <h3>Skills</h3>
          <p>Six Master Disciplines</p>
        </Link>
        <Link to="/contact" className="explore-fallback-card" onClick={() => soundEngine.playHoverTick()}>
          <span className="card-num">05</span>
          <h3>Contact</h3>
          <p>Studio Inquiries & Direct Line</p>
        </Link>
      </div>
    </div>
  )
}

export default function Explore() {
  return (
    <motion.div
      className="explore-page"
      variants={exploreVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <WebGLErrorBoundary fallback={<ExploreFallback />}>
        <CinematicPortalDoors />
      </WebGLErrorBoundary>
    </motion.div>
  )
}

