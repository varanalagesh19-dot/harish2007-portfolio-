import { motion } from 'framer-motion'
import { useEffect } from 'react'

const spatialPageVariants = {
  initial: {
    opacity: 0,
    rotateX: 6,
    scale: 0.96,
    y: 24,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    rotateX: -6,
    scale: 1.03,
    y: -20,
    filter: 'blur(4px)',
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export default function PageTransition({ children }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <motion.div
      variants={spatialPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: '100%',
        minHeight: '80vh',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.div>
  )
}
