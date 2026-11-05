import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import soundEngine from '../utils/soundEngine'
import './Gallery.css'

const artworks = [
  {
    id: 1,
    title: "Aura of Ultra Instinct",
    subtitle: "Divine Awakening & Kinetic Shading",
    category: "Manga & Ink",
    categories: ["Manga & Ink", "Conceptual Studies"],
    medium: "Fine Liner Ink & Dynamic Halftone Shading",
    dimensions: "A4 Archival Paper",
    year: "2024",
    image: "/optimized-assets/Harish_Artwork_01.jpg",
    downloadName: "Harish_Artwork_01.jpg",
    description: "High-contrast character illustration capturing Goku in Ultra Instinct state, demonstrating explosive kinetic line weight and radiant aura contouring. The composition balances stark black drafting inks with delicate tonal cross-hatching to evoke a transcendent martial presence."
  },
  {
    id: 2,
    title: "Divine Crimson Focus",
    subtitle: "Super Saiyan God Study",
    category: "Conceptual Studies",
    categories: ["Conceptual Studies", "Manga & Ink"],
    medium: "Graphite, Colored Pigment & Fine Liner",
    dimensions: "A4 Heavyweight Cartridge",
    year: "2024",
    image: "/optimized-assets/Harish_Artwork_02.jpg",
    downloadName: "Harish_Artwork_02.jpg",
    description: "An intense character study exploring dynamic foreshortening, piercing gaze, and clean pen contouring inspired by modern shonen draftsmanship. Colored pigments introduce fiery tonal accents against disciplined graphite linework to convey focused divine power."
  },
  {
    id: 3,
    title: "The Contemplative Mind",
    subtitle: "Portrait Study of Sir Albert Einstein",
    category: "Oil & Realism",
    categories: ["Oil & Realism", "Portraiture"],
    medium: "Oil on Canvas / Traditional Draftsmanship",
    dimensions: "30 × 40 cm",
    year: "2023",
    image: "/optimized-assets/Harish_Artwork_03.jpg",
    downloadName: "Harish_Artwork_03.jpg",
    description: "A classical figurative work focusing on lifelike tonal luminosity, soft anatomical transitions, and emotive realism achieved through patient, layered brushwork. Formed with traditional glaze-layering techniques to capture the deep contemplative intelligence of Sir Albert Einstein."
  },
  {
    id: 4,
    title: "Visionary Statesman",
    subtitle: "Portrait of Dr. B. R. Ambedkar",
    category: "Portraiture",
    categories: ["Portraiture", "Oil & Realism"],
    medium: "Graphite & Tonal Realism Study",
    dimensions: "35 × 50 cm",
    year: "2024",
    image: "/optimized-assets/Harish_Artwork_04.jpg",
    downloadName: "Harish_Artwork_04.jpg",
    description: "An upright, dignified realist portrait study of Dr. B.R. Ambedkar capturing expressive facial anatomy, nuanced reflections in the eyewear, and statesman presence. Rendered with disciplined chiaroscuro modeling to celebrate historic visionary leadership with timeless gravitas."
  },
  {
    id: 5,
    title: "Warrior's Resolve",
    subtitle: "Anatomical & Tonal Character Study",
    category: "Conceptual Studies",
    categories: ["Conceptual Studies", "Oil & Realism"],
    medium: "Fine Art Shading, Ink & Graphite on Paper",
    dimensions: "A4 Drafting Sheet",
    year: "2023",
    image: "/optimized-assets/Harish_Artwork_05.jpg",
    downloadName: "Harish_Artwork_05.jpg",
    description: "A rigorous figurative study of warrior anatomy and muscular tension, rendered with high-contrast chiaroscuro modeling and fierce directional linework. The study investigates skeletal anatomy and the physical weight of resolve through traditional ink and graphite shading."
  },
  {
    id: 6,
    title: "Chronicles of the Saiyans",
    subtitle: "Sequential Manga Narrative Spread",
    category: "Manga & Ink",
    categories: ["Manga & Ink", "Conceptual Studies"],
    medium: "Fine Liner Ink & Dynamic Halftone Shading",
    dimensions: "A3 Bristol Spread",
    year: "2024",
    image: "/optimized-assets/Harish_Artwork_06.jpg",
    downloadName: "Harish_Artwork_06.jpg",
    description: "High-contrast sequential manga panel composition demonstrating dramatic foreshortening, expressive character acting, and razor-sharp ink line weight. The multi-panel rhythm channels classic Japanese drafting principles to produce cinematic narrative pacing."
  },
  {
    id: 7,
    title: "Ascension Impact",
    subtitle: "Climactic Manga Action Panel",
    category: "Manga & Ink",
    categories: ["Manga & Ink"],
    medium: "Sequential Ink & Japanese Drafting Pen",
    dimensions: "A4 Focus Sheet",
    year: "2024",
    image: "/optimized-assets/Harish_Artwork_07.jpg",
    downloadName: "Harish_Artwork_07.jpg",
    description: "A dramatic master ink panel focusing on extreme facial intensity, speed line hatching, and explosive kinetic energy that highlights Harish's mastery of black-and-white visual storytelling. Every pen stroke reinforces the raw velocity and atmospheric shockwave of the climactic ascension."
  }
]

const categories = ["All", "Oil & Realism", "Portraiture", "Manga & Ink", "Conceptual Studies"]

// Smooth Non-Shaking Gallery Reveal
const curtainContainerVariants = {
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

const curtainWipeItem = {
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

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeModalArtwork, setActiveModalArtwork] = useState(null)
  const [inspectorActive, setInspectorActive] = useState(false)
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, clientX: 0, clientY: 0, isHovering: false })
  const [zoomScale, setZoomScale] = useState(2.2)

  const handleCloseModal = () => {
    setActiveModalArtwork(null)
    setInspectorActive(false)
  }

  const currentIndex = activeModalArtwork ? artworks.findIndex(a => a.id === activeModalArtwork.id) : -1

  const handlePrev = useCallback(() => {
    soundEngine.playHoverTick()
    const newIdx = currentIndex > 0 ? currentIndex - 1 : artworks.length - 1
    setActiveModalArtwork(artworks[newIdx])
  }, [currentIndex])

  const handleNext = useCallback(() => {
    soundEngine.playHoverTick()
    const newIdx = currentIndex < artworks.length - 1 ? currentIndex + 1 : 0
    setActiveModalArtwork(artworks[newIdx])
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModalArtwork) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') handleCloseModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalArtwork, handlePrev, handleNext])

  const filteredArtworks = selectedCategory === "All"
    ? artworks
    : artworks.filter(art => art.categories.includes(selectedCategory))

  return (
    <motion.div
      className="gallery-page"
      variants={curtainContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Exhibition Header */}
      <section className="container gallery-hero">
        <span className="atelier-eyebrow">Exhibition Room • Atelier Harish</span>
        <h1 className="atelier-title">
          The <em>Original</em> Works
        </h1>
        <p className="gallery-hero__desc">
          Seven authentic physical artworks created by Harish S — spanning realistic portraiture, classical master studies, and sequential narrative manga. Each piece is preserved upright in a museum passepartout frame with high-resolution direct downloads.
        </p>

        {/* Category Filter Tabs */}
        <div className="gallery-filters" role="tablist">
          {categories.map((cat) => {
            const count = cat === "All"
              ? artworks.length
              : artworks.filter(a => a.categories.includes(cat)).length

            return (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => {
                  soundEngine.playHoverTick()
                  setSelectedCategory(cat)
                }}
                className={`filter-btn ${selectedCategory === cat ? 'filter-btn--active' : ''}`}
              >
                <span>{cat}</span>
                <span className="filter-count">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Artworks Exhibition Grid with Museum Passepartout & Auto-Crop */}
      <section className="container gallery-grid-section">
        <motion.div layout className="artworks-grid">
          <AnimatePresence>
            {filteredArtworks.map((art) => (
              <motion.article
                layout
                key={art.id}
                variants={curtainWipeItem}
                initial="initial"
                animate="animate"
                exit="exit"
                className="art-card"
              >
                {/* Museum Passepartout Frame & Auto-Crop */}
                <div className="museum-frame art-museum-frame">
                  {/* Passepartout Matte */}
                  <div
                    className="museum-matte museum-matte--portrait art-matte-clickable"
                    onClick={() => {
                      soundEngine.playPortalInteract()
                      setActiveModalArtwork(art)
                    }}
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    title="Click to inspect in high-resolution lightbox"
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="museum-img"
                      loading="lazy"
                    />
                    <div className="art-hover-overlay">
                      <span className="zoom-label">✦ Inspect Artwork</span>
                    </div>
                  </div>

                  {/* Artwork Plaque / Details */}
                  <div className="art-details">
                    <div className="art-title-row">
                      <div>
                        <h3 className="art-title">{art.title}</h3>
                        {art.subtitle && (
                          <span className="art-subtitle">{art.subtitle}</span>
                        )}
                      </div>
                      <span className="art-year">{art.year}</span>
                    </div>

                    <div className="art-meta-tags">
                      <span className="art-medium">{art.medium}</span>
                      <span className="art-dim">{art.dimensions}</span>
                    </div>

                    <p className="art-desc">{art.description}</p>

                    {/* Actions: Fullscreen Lightbox & Direct Download */}
                    <div className="art-card__actions">
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => {
                          soundEngine.playPortalInteract()
                          setActiveModalArtwork(art)
                        }}
                        className="btn-ghost art-action-btn"
                      >
                        <span>Inspect View</span>
                      </button>

                      <a
                        href={art.image}
                        download={art.downloadName}
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => soundEngine.playPortalInteract()}
                        className="btn-sage art-action-btn"
                        title={`Download ${art.title} high-resolution image`}
                      >
                        <span className="download-icon">↓</span>
                        <span>Download High-Res</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Modal with Canvas Texture & Brushwork Inspector */}
      <AnimatePresence>
        {activeModalArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gallery-modal-backdrop"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="gallery-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Prev / Next Navigation Arrows */}
              <button
                type="button"
                className="modal-nav-arrow modal-nav-arrow--left"
                onClick={handlePrev}
                aria-label="Previous Artwork"
                title="Previous Artwork (Left Arrow)"
              >
                ‹
              </button>
              <button
                type="button"
                className="modal-nav-arrow modal-nav-arrow--right"
                onClick={handleNext}
                aria-label="Next Artwork"
                title="Next Artwork (Right Arrow)"
              >
                ›
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close Lightbox"
              >
                ✕
              </button>

              <div className="modal-content-grid">
                {/* High-Res Image Display with Interactive Loupe */}
                <div className="modal-image-col">
                  <div
                    className={`modal-canvas-stage ${inspectorActive ? 'modal-canvas-stage--inspecting' : ''}`}
                    onMouseMove={(e) => {
                      if (!inspectorActive) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
                      setLoupePos({
                        x,
                        y,
                        clientX: e.clientX - rect.left,
                        clientY: e.clientY - rect.top,
                        isHovering: true
                      })
                    }}
                    onMouseEnter={() => {
                      if (inspectorActive) {
                        setLoupePos(prev => ({ ...prev, isHovering: true }))
                      }
                    }}
                    onMouseLeave={() => {
                      setLoupePos(prev => ({ ...prev, isHovering: false }))
                    }}
                  >
                    <img
                      src={activeModalArtwork.image}
                      alt={activeModalArtwork.title}
                      className="modal-full-img"
                    />

                    {/* Magnifying Loupe Overlay */}
                    {inspectorActive && loupePos.isHovering && (
                      <div
                        className="magnifying-loupe"
                        style={{
                          left: `${loupePos.clientX}px`,
                          top: `${loupePos.clientY}px`,
                        }}
                      >
                        <div
                          className="magnifying-loupe-inner"
                          style={{
                            backgroundImage: `url(${activeModalArtwork.image})`,
                            backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                            backgroundSize: `${zoomScale * 100}%`,
                          }}
                        />
                        {/* Canvas Weave & Graphite Grain Filter */}
                        <div className="magnifying-canvas-grain" />
                        {/* Crosshair Center */}
                        <div className="magnifying-crosshair" />
                        {/* Magnification Badge */}
                        <span className="magnifying-coords">
                          {zoomScale}× Lens • {Math.round(loupePos.x)}% / {Math.round(loupePos.y)}%
                        </span>
                      </div>
                    )}

                    {/* Inspector Helper Instruction Banner */}
                    {inspectorActive && (
                      <div className="inspector-guide-badge">
                        <span>✦ Glide cursor over artwork to magnify canvas tooth & stroke depth</span>
                      </div>
                    )}
                  </div>

                  {/* Inspector Toolbar Controls */}
                  <div className="modal-inspector-toolbar">
                    <button
                      type="button"
                      className={`inspector-toggle-btn ${inspectorActive ? 'inspector-toggle-btn--active' : ''}`}
                      onClick={() => {
                        soundEngine.playPortalInteract()
                        setInspectorActive(!inspectorActive)
                      }}
                      onMouseEnter={() => soundEngine.playHoverTick()}
                    >
                      <span className="inspector-icon">{inspectorActive ? '✓' : '🔍'}</span>
                      <span>{inspectorActive ? 'Brushwork Inspector Active' : 'Inspect Canvas Texture & Brushstrokes'}</span>
                    </button>

                    {inspectorActive && (
                      <div className="zoom-scale-selector">
                        <span className="zoom-scale-label">Zoom:</span>
                        {[1.5, 2.2, 3.0].map((scale) => (
                          <button
                            key={scale}
                            type="button"
                            className={`zoom-scale-btn ${zoomScale === scale ? 'zoom-scale-btn--active' : ''}`}
                            onClick={() => {
                              soundEngine.playHoverTick()
                              setZoomScale(scale)
                            }}
                            onMouseEnter={() => soundEngine.playHoverTick()}
                          >
                            {scale}×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata Sidebar */}
                <div className="modal-info-col">
                  <span className="atelier-eyebrow">{activeModalArtwork.category} • {activeModalArtwork.year}</span>
                  <h2 className="modal-title">{activeModalArtwork.title}</h2>
                  {activeModalArtwork.subtitle && (
                    <h4 className="modal-subtitle">{activeModalArtwork.subtitle}</h4>
                  )}

                  <div className="modal-spec-grid">
                    <div className="modal-spec">
                      <span className="spec-label">Medium</span>
                      <span className="spec-val">{activeModalArtwork.medium}</span>
                    </div>
                    <div className="modal-spec">
                      <span className="spec-label">Dimensions</span>
                      <span className="spec-val">{activeModalArtwork.dimensions}</span>
                    </div>
                    <div className="modal-spec">
                      <span className="spec-label">Creator</span>
                      <span className="spec-val">Harish S (Atelier 2007)</span>
                    </div>
                  </div>

                  <p className="modal-desc">{activeModalArtwork.description}</p>

                  {/* Previous / Next Piece Navigation Row */}
                  <div className="modal-nav-row">
                    <button
                      type="button"
                      className="btn-ghost modal-nav-btn"
                      onClick={handlePrev}
                      onMouseEnter={() => soundEngine.playHoverTick()}
                    >
                      <span>← Previous Piece</span>
                    </button>

                    <span className="modal-nav-counter">
                      {currentIndex + 1} of {artworks.length}
                    </span>

                    <button
                      type="button"
                      className="btn-ghost modal-nav-btn"
                      onClick={handleNext}
                      onMouseEnter={() => soundEngine.playHoverTick()}
                    >
                      <span>Next Piece →</span>
                    </button>
                  </div>

                  <div className="modal-actions">
                    <a
                      href={activeModalArtwork.image}
                      download={activeModalArtwork.downloadName}
                      className="btn-sage"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => soundEngine.playPortalInteract()}
                    >
                      <span>Download High-Resolution Image</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
