import { motion } from 'framer-motion'
import { useEffect } from 'react'

const calmEditorialVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
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

export default function PageTransitionWrapper({ children }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <motion.div
      variants={calmEditorialVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: '100%',
        minHeight: '80vh',
      }}
    >
      {children}
    </motion.div>
  )
}

