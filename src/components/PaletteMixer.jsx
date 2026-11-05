import { useState } from 'react'
import soundEngine from '../utils/soundEngine'
import './PaletteMixer.css'

const STUDIO_SWATCHES = [
  {
    name: "French Sage Green",
    hex: "#68745B",
    rgb: [104, 116, 91],
    vec3: "vec3(0.408, 0.455, 0.357)",
    cssVar: "--sage-green",
    oilFormula: "Yellow Ochre (45%) + Raw Umber (30%) + French Ultramarine (15%) + Flake White (10%)",
    role: "Studio primary accents & interactive UI states",
    oilMedium: "Stand Linseed Oil & Walnut Glaze"
  },
  {
    name: "Burnt Terracotta",
    hex: "#A65F43",
    rgb: [166, 95, 67],
    vec3: "vec3(0.651, 0.373, 0.263)",
    cssVar: "--terracotta",
    oilFormula: "Burnt Sienna (60%) + Venetian Red (25%) + Raw Sienna (15%)",
    role: "Chiaroscuro focal warmth & highlights",
    oilMedium: "Damar Varnish & Cold-Pressed Linseed"
  },
  {
    name: "Warm Canvas Stone",
    hex: "#EDE5D8",
    rgb: [237, 229, 216],
    vec3: "vec3(0.929, 0.898, 0.847)",
    cssVar: "--bg-primary",
    oilFormula: "Lead White (70%) + Yellow Ochre Light (20%) + Burnt Umber (10%)",
    role: "Passepartout canvas ground & atmospheric wash",
    oilMedium: "Traditional Rabbit-Skin Glue Gesso"
  },
  {
    name: "Forest Twilight Slate",
    hex: "#171C18",
    rgb: [23, 28, 24],
    vec3: "vec3(0.090, 0.110, 0.094)",
    cssVar: "--bg-dark",
    oilFormula: "Ivory Black (55%) + Viridian Green (30%) + Burnt Umber (15%)",
    role: "Nocturne studio shadows & 3D deep void",
    oilMedium: "Sun-Bleached Walnut Oil"
  },
  {
    name: "Muted Raw Copper",
    hex: "#B77A51",
    rgb: [183, 122, 81],
    vec3: "vec3(0.718, 0.478, 0.318)",
    cssVar: "--muted-copper",
    oilFormula: "Raw Sienna (50%) + Cadmium Orange (30%) + Burnt Umber (20%)",
    role: "Warm metallic accents & vector route tracking",
    oilMedium: "Venice Turpentine & Linseed Glaze"
  },
  {
    name: "Deep Bistre Olive",
    hex: "#0A0B09",
    rgb: [10, 11, 9],
    vec3: "vec3(0.039, 0.043, 0.035)",
    cssVar: "--text-heading",
    oilFormula: "Bistre Ground (60%) + Lamp Black (25%) + Raw Umber (15%)",
    role: "Pitch-dark editorial typography & high-contrast ink",
    oilMedium: "Sumi Ink & Pure Gum Arabic"
  }
]

export default function PaletteMixer() {
  const [selectedSwatch, setSelectedSwatch] = useState(STUDIO_SWATCHES[0])
  const [copied, setCopied] = useState(false)
  const [mixRatio, setMixRatio] = useState(65) // 0 to 100 slider blending Primary with Secondary

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    soundEngine.playHoverTick()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate mixed dynamic color between selected swatch and Warm Canvas
  const secondarySwatch = STUDIO_SWATCHES[2] // Warm Canvas
  const rMix = Math.round(selectedSwatch.rgb[0] * (mixRatio / 100) + secondarySwatch.rgb[0] * (1 - mixRatio / 100))
  const gMix = Math.round(selectedSwatch.rgb[1] * (mixRatio / 100) + secondarySwatch.rgb[1] * (1 - mixRatio / 100))
  const bMix = Math.round(selectedSwatch.rgb[2] * (mixRatio / 100) + secondarySwatch.rgb[2] * (1 - mixRatio / 100))
  const hexMix = `#${((1 << 24) + (rMix << 16) + (gMix << 8) + bMix).toString(16).slice(1).toUpperCase()}`

  return (
    <div className="palette-mixer-card">
      <div className="mixer-header">
        <div>
          <span className="mixer-eyebrow">Interactive Feature 01 • Studio Alchemy</span>
          <h3 className="mixer-title">Color-to-Code Pigment Mixer</h3>
          <p className="mixer-sub">
            In Harish's atelier, digital CSS colors and WebGL shader vectors originate from real physical oil pigments ground on glass.
          </p>
        </div>
        <div className="mixer-badge">
          <span>WebGL 2.0 × Oil Pigments</span>
        </div>
      </div>

      {/* Swatch Selection Row */}
      <div className="mixer-swatches-grid">
        {STUDIO_SWATCHES.map((swatch) => (
          <button
            key={swatch.name}
            type="button"
            className={`mixer-swatch-btn ${selectedSwatch.name === swatch.name ? 'mixer-swatch-btn--active' : ''}`}
            onClick={() => {
              soundEngine.playHoverTick()
              setSelectedSwatch(swatch)
            }}
            onMouseEnter={() => soundEngine.playHoverTick()}
          >
            <span className="swatch-color-pill" style={{ backgroundColor: swatch.hex }} />
            <div className="swatch-meta">
              <span className="swatch-name">{swatch.name}</span>
              <span className="swatch-hex">{swatch.hex}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Mixer Laboratory Main Area */}
      <div className="mixer-lab-grid">
        {/* Left: Pigment Alchemy Details */}
        <div className="mixer-formula-box">
          <div className="formula-header">
            <span className="formula-tag">Classical Easel Formula</span>
            <span className="formula-medium">{selectedSwatch.oilMedium}</span>
          </div>

          <h4 className="formula-name">{selectedSwatch.name}</h4>
          <p className="formula-oil-text">
            <strong>Pigment Ratio:</strong> {selectedSwatch.oilFormula}
          </p>
          <p className="formula-role">
            <strong>Role in Atelier:</strong> {selectedSwatch.role}
          </p>

          {/* Interactive Glaze Blending Slider */}
          <div className="glaze-slider-box">
            <div className="glaze-slider-header">
              <span>Oil Glaze Density: {mixRatio}% Pure Pigment</span>
              <span className="glaze-hex-preview" style={{ color: hexMix }}>
                Active Mix: {hexMix}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={mixRatio}
              onChange={(e) => setMixRatio(Number(e.target.value))}
              className="glaze-slider"
            />
            <div className="glaze-blend-preview-strip" style={{ backgroundColor: hexMix }} />
          </div>
        </div>

        {/* Right: Real-time Code Output (CSS & Three.js Shader) */}
        <div className="mixer-code-box">
          <div className="code-header">
            <span>Live WebGL &amp; React Output</span>
            <button
              type="button"
              className="copy-code-btn"
              onClick={() =>
                handleCopy(
                  `/* Three.js PBR Shader */\nconst material = new THREE.MeshStandardMaterial({\n  color: 0x${selectedSwatch.hex.replace('#', '')},\n  roughness: 0.35,\n  metalness: 0.12\n});\n\n/* GLSL Fragment Vector */\nvec3 studioColor = ${selectedSwatch.vec3};\n\n/* CSS Variable */\n${selectedSwatch.cssVar}: ${selectedSwatch.hex};`
                )
              }
            >
              {copied ? 'Copied ✓' : 'Copy Code Snippet'}
            </button>
          </div>

          <pre className="code-display">
            <code>
{`// 1. Three.js PBR Shader Material
const atelierMaterial = new THREE.MeshStandardMaterial({
  color: 0x${selectedSwatch.hex.replace('#', '')},
  roughness: 0.38,
  metalness: 0.08,
});

// 2. GLSL Fragment Shader Vector
vec3 baseColor = ${selectedSwatch.vec3};
gl_FragColor = vec4(baseColor, 1.0);

// 3. Root React CSS Token
${selectedSwatch.cssVar}: ${selectedSwatch.hex};`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

