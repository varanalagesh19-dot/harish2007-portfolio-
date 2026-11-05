export default function ProjectCardVisual({ project, index }) {
  if (project.image) {
    return (
      <div className="project-card-visual project-card-visual--image">
        <img src={project.image} alt={project.title} className="project-card-banner-img" />
        <div className="project-card-visual__tag-bar">
          <span className="project-index">0{index + 1}</span>
          <span className="project-highlight-badge">{project.highlight}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`project-card-visual project-card-visual--${project.id}`}>
      {/* Top Tag Bar */}
      <div className="project-card-visual__tag-bar">
        <span className="project-index">0{index + 1}</span>
        <span className="project-highlight-badge">{project.highlight}</span>
      </div>

      {/* Visual Banners Based on Project ID */}
      {project.id === 'ner-access' && (
        <div className="banner-art banner-art--ner">
          <svg className="banner-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nerGrid" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(104, 116, 91, 0.15)" />
                <stop offset="1" stopColor="rgba(104, 116, 91, 0.02)" />
              </linearGradient>
              <linearGradient id="nerRoute" x1="60" y1="160" x2="340" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#68745B" />
                <stop offset="0.5" stopColor="#A65F43" />
                <stop offset="1" stopColor="#B77A51" />
              </linearGradient>
              <filter id="nerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Campus Grid Background */}
            <path d="M0 40 H400 M0 80 H400 M0 120 H400 M0 160 H400 M0 200 H400" stroke="rgba(104, 116, 91, 0.12)" strokeWidth="1" />
            <path d="M40 0 V220 M80 0 V220 M120 0 V220 M160 0 V220 M200 0 V220 M240 0 V220 M280 0 V220 M320 0 V220 M360 0 V220" stroke="rgba(104, 116, 91, 0.12)" strokeWidth="1" />

            {/* Topographic Elevation Contours */}
            <path d="M-20 180 C80 140, 140 210, 240 160 C320 120, 360 180, 420 150" stroke="rgba(166, 95, 67, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <path d="M-20 140 C90 100, 170 170, 260 120 C340 80, 380 140, 420 110" stroke="rgba(104, 116, 91, 0.35)" strokeWidth="1.5" fill="none" />
            <path d="M-20 100 C100 60, 190 130, 280 80 C350 40, 390 100, 420 70" stroke="rgba(104, 116, 91, 0.2)" strokeWidth="1" fill="none" />

            {/* Route Spline with Glowing Waypoints */}
            <path d="M70 160 Q130 145 170 110 T260 100 T330 70" stroke="url(#nerRoute)" strokeWidth="3.5" fill="none" filter="url(#nerGlow)" />
            
            {/* Start Pin */}
            <circle cx="70" cy="160" r="7" fill="#68745B" />
            <circle cx="70" cy="160" r="14" stroke="#68745B" strokeWidth="1.5" opacity="0.4" />
            <circle cx="70" cy="160" r="3" fill="#FAF6F0" />

            {/* Mid Node */}
            <circle cx="170" cy="110" r="4.5" fill="#A65F43" />
            <circle cx="260" cy="100" r="4.5" fill="#A65F43" />

            {/* End Waypoint */}
            <circle cx="330" cy="70" r="7" fill="#A65F43" filter="url(#nerGlow)" />
            <circle cx="330" cy="70" r="16" stroke="#A65F43" strokeWidth="1.5" opacity="0.5" />
            <circle cx="330" cy="70" r="3" fill="#FAF6F0" />
            <text x="330" y="52" fill="var(--terracotta)" fontSize="9" fontFamily="var(--font-ui)" fontWeight="600" textAnchor="middle">WAYPOINT B</text>

            {/* Compass Rose Badge */}
            <g transform="translate(350, 175)">
              <circle cx="0" cy="0" r="22" fill="rgba(23, 28, 24, 0.7)" stroke="rgba(104, 116, 91, 0.4)" strokeWidth="1" />
              <path d="M0 -15 L4 0 L0 15 L-4 0 Z" fill="rgba(104, 116, 91, 0.5)" />
              <path d="M0 -15 L4 0 L0 0 Z" fill="#A65F43" />
              <text x="0" y="-18" fill="#A65F43" fontSize="8" fontFamily="var(--font-ui)" fontWeight="bold" textAnchor="middle">N</text>
              <text x="0" y="5" fill="#FAF6F0" fontSize="7" fontFamily="var(--font-ui)" textAnchor="middle">342°</text>
            </g>

            {/* Elevation Label */}
            <g transform="translate(25, 45)">
              <rect width="96" height="20" rx="3" fill="rgba(23, 28, 24, 0.65)" stroke="rgba(104, 116, 91, 0.3)" />
              <text x="8" y="14" fill="#91A17E" fontSize="8" fontFamily="var(--font-ui)" letterSpacing="0.1em">CAMPUS GIS • LVL 3</text>
            </g>
          </svg>
        </div>
      )}

      {project.id === 'linkedx' && (
        <div className="banner-art banner-art--linkedx">
          <svg className="banner-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="80" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(166, 95, 67, 0.35)" />
                <stop offset="1" stopColor="rgba(166, 95, 67, 0.0)" />
              </linearGradient>
              <linearGradient id="waveLine" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#68745B" />
                <stop offset="0.5" stopColor="#A65F43" />
                <stop offset="1" stopColor="#D49065" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="40" y1="180" x2="360" y2="180" stroke="rgba(166, 95, 67, 0.15)" strokeWidth="1" />
            <line x1="40" y1="140" x2="360" y2="140" stroke="rgba(166, 95, 67, 0.1)" strokeWidth="1" />
            <line x1="40" y1="100" x2="360" y2="100" stroke="rgba(166, 95, 67, 0.1)" strokeWidth="1" />

            {/* Area Under Wave */}
            <path d="M40 180 C90 170, 120 110, 170 125 C220 140, 260 70, 310 90 C335 100, 350 80, 360 85 V180 H40 Z" fill="url(#waveGrad)" />

            {/* Main Engagement Wave */}
            <path d="M40 180 C90 170, 120 110, 170 125 C220 140, 260 70, 310 90 C335 100, 350 80, 360 85" stroke="url(#waveLine)" strokeWidth="3" fill="none" />

            {/* Wave Data Points */}
            <circle cx="120" cy="110" r="5" fill="#A65F43" />
            <circle cx="120" cy="110" r="9" stroke="#A65F43" strokeWidth="1" opacity="0.4" />

            <circle cx="260" cy="70" r="6" fill="#D49065" />
            <circle cx="260" cy="70" r="12" stroke="#D49065" strokeWidth="1.5" opacity="0.5" />

            {/* Sentiment Meter Ring */}
            <g transform="translate(90, 75)">
              <circle cx="0" cy="0" r="28" fill="rgba(23, 28, 24, 0.75)" stroke="rgba(166, 95, 67, 0.25)" strokeWidth="3" />
              <circle cx="0" cy="0" r="28" stroke="#A65F43" strokeWidth="3" strokeDasharray="175" strokeDashoffset="45" strokeLinecap="round" />
              <text x="0" y="2" fill="#FAF6F0" fontSize="11" fontFamily="var(--font-ui)" fontWeight="bold" textAnchor="middle">88%</text>
              <text x="0" y="13" fill="#B8B5A7" fontSize="6.5" fontFamily="var(--font-ui)" textAnchor="middle">SENTIMENT</text>
            </g>

            {/* Social Metric Floating Card */}
            <g transform="translate(240, 130)">
              <rect width="125" height="42" rx="4" fill="rgba(23, 28, 24, 0.85)" stroke="rgba(166, 95, 67, 0.35)" />
              <circle cx="16" cy="21" r="6" fill="#68745B" />
              <text x="28" y="18" fill="#FAF6F0" fontSize="9" fontFamily="var(--font-ui)" fontWeight="600">+148% VELOCITY</text>
              <text x="28" y="30" fill="#9E9789" fontSize="7.5" fontFamily="var(--font-ui)">Viral Resonance Score</text>
            </g>
          </svg>
        </div>
      )}

      {project.id === 'intellipdf' && (
        <div className="banner-art banner-art--intellipdf">
          <svg className="banner-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(104, 116, 91, 0.8)" />
                <stop offset="1" stopColor="rgba(104, 116, 91, 0)" />
              </linearGradient>
            </defs>

            {/* Angled Document 1 (Back Layer) */}
            <rect x="70" y="45" width="130" height="150" rx="4" fill="rgba(222, 213, 199, 0.12)" stroke="rgba(183, 122, 81, 0.3)" transform="rotate(-6 70 45)" />

            {/* Main Document Layer */}
            <g transform="translate(140, 30)">
              <rect width="160" height="170" rx="4" fill="rgba(245, 240, 231, 0.08)" stroke="rgba(104, 116, 91, 0.4)" strokeWidth="1.5" />
              
              {/* Header Lines */}
              <line x1="20" y1="25" x2="70" y2="25" stroke="#A65F43" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="36" x2="140" y2="36" stroke="rgba(104, 116, 91, 0.3)" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="46" x2="125" y2="46" stroke="rgba(104, 116, 91, 0.3)" strokeWidth="2" strokeLinecap="round" />

              {/* Highlighted AI Text Extraction Blocks */}
              <rect x="18" y="58" width="90" height="14" rx="2" fill="rgba(166, 95, 67, 0.25)" stroke="#A65F43" strokeWidth="0.8" />
              <line x1="22" y1="65" x2="102" y2="65" stroke="#F1EBDD" strokeWidth="2" />

              {/* Bounding Box Around Figure */}
              <rect x="18" y="82" width="124" height="48" rx="2" fill="rgba(104, 116, 91, 0.08)" stroke="#68745B" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="14" y="78" width="6" height="6" fill="#68745B" />
              <rect x="138" y="78" width="6" height="6" fill="#68745B" />
              <rect x="14" y="126" width="6" height="6" fill="#68745B" />
              <rect x="138" y="126" width="6" height="6" fill="#68745B" />
              <text x="24" y="96" fill="#91A17E" fontSize="7" fontFamily="var(--font-ui)">FIGURE 3: VECTOR CLUSTER</text>
              <circle cx="80" cy="112" r="8" stroke="#A65F43" strokeWidth="1.5" />
              <circle cx="80" cy="112" r="3" fill="#A65F43" />

              {/* Horizontal Glowing Laser Scan Beam */}
              <g transform="translate(0, 110)">
                <rect x="0" y="0" width="160" height="12" fill="url(#scanBeam)" />
                <line x1="0" y1="0" x2="160" y2="0" stroke="#91A17E" strokeWidth="2" />
              </g>

              {/* Paragraph Lines */}
              <line x1="20" y1="145" x2="140" y2="145" stroke="rgba(104, 116, 91, 0.3)" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="155" x2="105" y2="155" stroke="rgba(104, 116, 91, 0.3)" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* OCR Accuracy Badge */}
            <g transform="translate(25, 140)">
              <rect width="105" height="36" rx="4" fill="rgba(23, 28, 24, 0.85)" stroke="rgba(104, 116, 91, 0.4)" />
              <text x="10" y="16" fill="#91A17E" fontSize="7.5" fontFamily="var(--font-ui)" fontWeight="600">99.4% OCR ACCURACY</text>
              <text x="10" y="28" fill="#FAF6F0" fontSize="7" fontFamily="var(--font-ui)">3D Semantic Tokens</text>
            </g>
          </svg>
        </div>
      )}

      {project.id === 'solvex-ner' && (
        <div className="banner-art banner-art--solvex">
          <svg className="banner-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="solvexGlow" cx="50%" cy="50%" r="50%">
                <stop stopColor="rgba(104, 116, 91, 0.35)" />
                <stop offset="1" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Center Aura */}
            <circle cx="200" cy="110" r="70" fill="url(#solvexGlow)" />

            {/* Interconnected Polyhedral Graph Lines */}
            <line x1="120" y1="70" x2="200" y2="50" stroke="#68745B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="200" y1="50" x2="280" y2="80" stroke="#A65F43" strokeWidth="2" />
            <line x1="280" y1="80" x2="270" y2="150" stroke="#68745B" strokeWidth="1.5" />
            <line x1="270" y1="150" x2="190" y2="170" stroke="#A65F43" strokeWidth="2" />
            <line x1="190" y1="170" x2="120" y2="140" stroke="#68745B" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="120" y1="140" x2="120" y2="70" stroke="#68745B" strokeWidth="1.5" />

            {/* Cross Struts */}
            <line x1="120" y1="70" x2="270" y2="150" stroke="rgba(104, 116, 91, 0.25)" strokeWidth="1" />
            <line x1="200" y1="50" x2="190" y2="170" stroke="rgba(166, 95, 67, 0.3)" strokeWidth="1.5" />
            <line x1="120" y1="140" x2="280" y2="80" stroke="rgba(104, 116, 91, 0.25)" strokeWidth="1" />

            {/* Central Node */}
            <circle cx="200" cy="110" r="16" fill="rgba(23, 28, 24, 0.9)" stroke="#A65F43" strokeWidth="2" />
            <circle cx="200" cy="110" r="8" fill="#A65F43" />
            <text x="200" y="113" fill="#FAF6F0" fontSize="8" fontFamily="var(--font-ui)" fontWeight="bold" textAnchor="middle">Ω</text>

            {/* Outer Nodes */}
            <circle cx="120" cy="70" r="7" fill="#68745B" />
            <circle cx="200" cy="50" r="8" fill="#68745B" />
            <circle cx="280" cy="80" r="9" fill="#A65F43" />
            <circle cx="270" cy="150" r="7" fill="#68745B" />
            <circle cx="190" cy="170" r="8" fill="#A65F43" />
            <circle cx="120" cy="140" r="7" fill="#68745B" />

            {/* Mathematical Tags */}
            <g transform="translate(35, 45)">
              <rect width="72" height="22" rx="3" fill="rgba(23, 28, 24, 0.85)" stroke="rgba(104, 116, 91, 0.4)" />
              <text x="7" y="15" fill="#91A17E" fontSize="8" fontFamily="var(--font-ui)">∇ · B = 0</text>
            </g>

            <g transform="translate(295, 135)">
              <rect width="84" height="22" rx="3" fill="rgba(23, 28, 24, 0.85)" stroke="rgba(166, 95, 67, 0.4)" />
              <text x="7" y="15" fill="#D49065" fontSize="8" fontFamily="var(--font-ui)">O(log N) PROOF ✓</text>
            </g>
          </svg>
        </div>
      )}

      {project.id === 'atlascore' && (
        <div className="banner-art banner-art--atlascore">
          <svg className="banner-svg" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop stopColor="#68745B" stopOpacity="0.6" />
                <stop offset="0.6" stopColor="#A65F43" stopOpacity="0.25" />
                <stop offset="1" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Glowing Orb Aura */}
            <circle cx="200" cy="105" r="65" fill="url(#coreGlow)" />

            {/* Orbital Rings */}
            <ellipse cx="200" cy="105" rx="100" ry="32" stroke="rgba(104, 116, 91, 0.35)" strokeWidth="1.5" strokeDasharray="6 4" transform="rotate(-15 200 105)" />
            <ellipse cx="200" cy="105" rx="80" ry="24" stroke="rgba(166, 95, 67, 0.4)" strokeWidth="1.5" transform="rotate(25 200 105)" />
            
            {/* Core Sphere */}
            <circle cx="200" cy="105" r="28" fill="rgba(23, 28, 24, 0.95)" stroke="#68745B" strokeWidth="2" />
            <circle cx="200" cy="105" r="20" fill="none" stroke="#A65F43" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="200" cy="105" r="10" fill="#68745B" />

            {/* Orbital Memory Satellites */}
            <circle cx="115" cy="90" r="5" fill="#A65F43" />
            <circle cx="280" cy="125" r="4" fill="#91A17E" />
            <circle cx="250" cy="65" r="5" fill="#D49065" />

            {/* Audio Waveform Ribbon Running Across Bottom */}
            <g transform="translate(50, 165)">
              <rect x="0" y="10" width="4" height="20" rx="2" fill="#68745B" opacity="0.6" />
              <rect x="10" y="4" width="4" height="32" rx="2" fill="#68745B" opacity="0.8" />
              <rect x="20" y="14" width="4" height="12" rx="2" fill="#68745B" opacity="0.5" />
              <rect x="30" y="2" width="4" height="36" rx="2" fill="#A65F43" />
              <rect x="40" y="8" width="4" height="24" rx="2" fill="#A65F43" opacity="0.9" />
              <rect x="50" y="0" width="4" height="40" rx="2" fill="#D49065" />
              <rect x="60" y="6" width="4" height="28" rx="2" fill="#A65F43" opacity="0.9" />
              <rect x="70" y="12" width="4" height="16" rx="2" fill="#68745B" opacity="0.7" />
              
              <rect x="230" y="12" width="4" height="16" rx="2" fill="#68745B" opacity="0.7" />
              <rect x="240" y="4" width="4" height="32" rx="2" fill="#68745B" opacity="0.8" />
              <rect x="250" y="0" width="4" height="40" rx="2" fill="#D49065" />
              <rect x="260" y="8" width="4" height="24" rx="2" fill="#A65F43" opacity="0.9" />
              <rect x="270" y="2" width="4" height="36" rx="2" fill="#A65F43" />
              <rect x="280" y="10" width="4" height="20" rx="2" fill="#68745B" opacity="0.6" />
              <rect x="290" y="14" width="4" height="12" rx="2" fill="#68745B" opacity="0.5" />
            </g>

            {/* Core Status Badge */}
            <g transform="translate(115, 15)">
              <rect width="170" height="22" rx="3" fill="rgba(23, 28, 24, 0.85)" stroke="rgba(104, 116, 91, 0.4)" />
              <circle cx="12" cy="11" r="3.5" fill="#91A17E" />
              <text x="22" y="15" fill="#FAF6F0" fontSize="8" fontFamily="var(--font-ui)" letterSpacing="0.08em">NEURAL CORE ACTIVE • 432Hz</text>
            </g>
          </svg>
        </div>
      )}

      {/* Visual CTA in Bottom Corner */}
      <span className="visual-cta">Click to launch dedicated 3D space →</span>
    </div>
  )
}

