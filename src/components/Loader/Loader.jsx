import { motion } from 'framer-motion'
import './Loader.css'

export default function Loader() {
  return (
    <motion.div
      className="atelier-loader"
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="atelier-loader__canvas-grain" />

      <div className="atelier-loader__inner">
        {/* Artistic Compass / Emblem */}
        <div className="atelier-loader__emblem">
          <motion.div
            className="atelier-loader__ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
          />
          <motion.div
            className="atelier-loader__monogram"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            H
          </motion.div>
        </div>

        {/* Text Block */}
        <motion.div
          className="atelier-loader__meta"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="atelier-loader__studio-label">ATELIER IMAGINATION</span>
          <h1 className="atelier-loader__name">Harish S</h1>
          <p className="atelier-loader__subtitle">Artist’s Studio & Digital Universe</p>
        </motion.div>

        {/* Subtle Pigment / Ink Bar */}
        <motion.div
          className="atelier-loader__progress-track"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="atelier-loader__progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
