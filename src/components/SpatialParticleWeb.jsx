import { Link } from 'react-router-dom'
import soundEngine from '../utils/soundEngine'
import './SpatialParticleWeb.css'

export const DISCIPLINE_SYNAPSES = {
  "01": {
    discipline: "Realistic Oil Painting",
    domain: "Fine Art & Classical Atelier",
    artworks: [
      { id: 3, title: "The Contemplative Mind", role: "Sir Albert Einstein Portrait Study", medium: "Oil on Canvas", path: "/gallery" },
      { id: 4, title: "Visionary Statesman", role: "Dr. B. R. Ambedkar Realist Study", medium: "Tonal Realism & Oil Glaze", path: "/gallery" },
    ],
    projects: [
      { id: "ner-access", title: "NER-Access", role: "Topographic Spline Shading & Elevation Color Harmony", path: "/projects/ner-access" }
    ],
    accent: "#8C472B"
  },
  "02": {
    discipline: "Traditional & Digital Art",
    domain: "Draftsmanship & Concept Art",
    artworks: [
      { id: 6, title: "Chronicles of the Saiyans", role: "Sequential Manga Narrative Spread", medium: "Fine Liner & Dynamic Halftone", path: "/gallery" },
      { id: 7, title: "Ascension Impact", role: "Climactic Manga Action Panel", medium: "Japanese Drafting Pen", path: "/gallery" },
      { id: 2, title: "Divine Crimson Focus", role: "Super Saiyan God Character Study", medium: "Graphite & Fine Liner", path: "/gallery" },
    ],
    projects: [
      { id: "atlascore", title: "AtlasCore", role: "Concept Storyboarding & Spatial Interface Layout", path: "/projects/atlascore" }
    ],
    accent: "#D98A66"
  },
  "03": {
    discipline: "Creative Imagination",
    domain: "Conceptual World-Building",
    artworks: [
      { id: 1, title: "Aura of Ultra Instinct", role: "Dynamic Energy Contouring & Martial Aura", medium: "Ink & Halftone", path: "/gallery" },
      { id: 5, title: "Warrior's Resolve", role: "Anatomical & Tonal Muscular Study", medium: "Graphite & Shading", path: "/gallery" },
    ],
    projects: [
      { id: "linkedx", title: "LinkedX", role: "AI Sentiment Universe & Semantic Orbit Topology", path: "/projects/linkedx" },
      { id: "intellipdf", title: "IntelliPDF", role: "Unstructured Document Knowledge Parsing", path: "/projects/intellipdf" }
    ],
    accent: "#3D4734"
  },
  "04": {
    discipline: "3D Web Experiences",
    domain: "Spatial Computing & WebGL",
    artworks: [
      { id: 3, title: "The Contemplative Mind", role: "Classical 3D Lighting & Chiaroscuro Reference", medium: "Oil Glazing", path: "/gallery" }
    ],
    projects: [
      { id: "ner-access", title: "NER-Access", role: "3D Vector GIS & Topographic Campus Splines", path: "/projects/ner-access" },
      { id: "solvex-ner", title: "SolveX-NER", role: "Rotating 3D Polyhedral Logic Network", path: "/projects/solvex-ner" },
      { id: "atlascore", title: "AtlasCore", role: "Harmonic Neural Sphere & Orbital Memory", path: "/projects/atlascore" }
    ],
    accent: "#55CC77"
  },
  "05": {
    discipline: "Visual Storytelling",
    domain: "Cinematic Narrative & UX",
    artworks: [
      { id: 6, title: "Chronicles of the Saiyans", role: "Sequential Pacing & Dramatic Foreshortening", medium: "A3 Bristol Spread", path: "/gallery" }
    ],
    projects: [
      { id: "linkedx", title: "LinkedX", role: "Audience Sentiment Trajectory & Velocity Graphs", path: "/projects/linkedx" },
      { id: "intellipdf", title: "IntelliPDF", role: "Laser Scan Synthesizer & Floating Parchment", path: "/projects/intellipdf" }
    ],
    accent: "#8C472B"
  },
  "06": {
    discipline: "Creative Website Development",
    domain: "Frontend Architecture & Systems",
    artworks: [
      { id: 4, title: "Visionary Statesman", role: "High-Resolution Museum Display & Matte Bounds", medium: "Archival Cartridge", path: "/gallery" }
    ],
    projects: [
      { id: "ner-access", title: "NER-Access", role: "Interactive Mapbox & Three.js Canvas Architecture", path: "/projects/ner-access" },
      { id: "linkedx", title: "LinkedX", role: "Social Analytics Dashboard & NLP Data Pipeline", path: "/projects/linkedx" },
      { id: "intellipdf", title: "IntelliPDF", role: "Document Extraction & Real-time Graph Visualizer", path: "/projects/intellipdf" },
      { id: "solvex-ner", title: "SolveX-NER", role: "Entity Recognition & Proof Verification Engine", path: "/projects/solvex-ner" }
    ],
    accent: "#A8BA92"
  }
}

export default function SpatialParticleWeb({ activeDisciplineNum, onSelectDiscipline }) {
  const currentSynapse = DISCIPLINE_SYNAPSES[activeDisciplineNum || "01"]

  return (
    <div className="spatial-particle-web-card">
      <div className="synapse-header">
        <div className="synapse-status-pill">
          <span className="synapse-pulse-node" />
          <span>3D SPATIAL PARTICLE WEB • LIVE SYNAPSE STREAM</span>
        </div>
        <span className="synapse-active-tag">
          Discipline #{activeDisciplineNum || "01"}: {currentSynapse.discipline}
        </span>
      </div>

      <p className="synapse-desc">
        Hover over any discipline below to activate real-time neural connections bridging Harish's physical oil artworks with collaborative 3D WebGL software architectures.
      </p>

      {/* Connected Nodes Matrix */}
      <div className="synapse-matrix-grid">
        {/* Connected Artworks Column */}
        <div className="synapse-col">
          <div className="synapse-col-title">
            <span className="synapse-col-icon">🎨</span>
            <span>Connected Physical Artworks</span>
          </div>

          <div className="synapse-links-list">
            {currentSynapse.artworks.map((art) => (
              <Link
                key={art.title}
                to={art.path}
                className="synapse-node-link synapse-node-link--art"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => soundEngine.playPageTurn()}
              >
                <div className="node-link-info">
                  <span className="node-link-title">{art.title}</span>
                  <span className="node-link-role">{art.role}</span>
                </div>
                <span className="node-link-badge">{art.medium}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Neural Synapse Divider with Animated Laser Pulse */}
        <div className="synapse-divider">
          <div className="synapse-laser-beam" />
        </div>

        {/* Connected 3D Projects Column */}
        <div className="synapse-col">
          <div className="synapse-col-title">
            <span className="synapse-col-icon">⚡</span>
            <span>Connected 3D WebGL Projects</span>
          </div>

          <div className="synapse-links-list">
            {currentSynapse.projects.map((proj) => (
              <Link
                key={proj.title}
                to={proj.path}
                className="synapse-node-link synapse-node-link--project"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => soundEngine.playPortalInteract()}
              >
                <div className="node-link-info">
                  <span className="node-link-title">{proj.title}</span>
                  <span className="node-link-role">{proj.role}</span>
                </div>
                <span className="node-link-badge">Dedicated 3D Space →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

