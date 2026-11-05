import { Link } from 'react-router-dom'
import { usePortalTransition } from '../context/PortalTransitionContext'
import soundEngine from '../utils/soundEngine'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { triggerPortalNavigation } = usePortalTransition()

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    triggerPortalNavigation(path)
  }

  const handleHover = () => {
    soundEngine.playHoverTick()
  }

  return (
    <footer className="atelier-footer">
      <div className="container atelier-footer__inner">
        {/* Top Row: Brand & Taglines */}
        <div className="atelier-footer__top">
          <div className="atelier-footer__brand">
            <Link
              to="/"
              className="atelier-footer__logo"
              onMouseEnter={handleHover}
              onClick={(e) => handleLinkClick(e, '/')}
            >
              <span className="atelier-footer__mark">H</span>
              <div>
                <h3 className="atelier-footer__name">Harish S</h3>
                <p className="atelier-footer__role">Artist & Creative Developer</p>
              </div>
            </Link>
            <p className="atelier-footer__quote">
              "Where Imagination Becomes Reality."
            </p>
            <p className="atelier-footer__subquote">
              An Artist's Mind. A Creator's Universe.
            </p>
          </div>

          {/* Quick Links */}
          <div className="atelier-footer__col">
            <h4 className="atelier-footer__heading">Explore Studio</h4>
            <ul className="atelier-footer__links">
              <li><Link to="/" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/')}>Home Gateway</Link></li>
              <li><Link to="/about" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/about')}>Artist Biography</Link></li>
              <li><Link to="/gallery" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/gallery')}>Art Exhibition (7 Works)</Link></li>
              <li><Link to="/projects" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects')}>Interactive 3D Projects</Link></li>
              <li><Link to="/skills" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/skills')}>Artistic & Tech Disciplines</Link></li>
              <li><Link to="/contact" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/contact')}>Studio Inquiries</Link></li>
            </ul>
          </div>

          {/* 3D Projects Direct Links */}
          <div className="atelier-footer__col">
            <h4 className="atelier-footer__heading">3D Showcase</h4>
            <ul className="atelier-footer__links">
              <li><Link to="/projects/ner-access" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects/ner-access')}>NerAccess (Spatial GIS)</Link></li>
              <li><Link to="/projects/linkedx" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects/linkedx')}>LinkedX (Analytics Engine)</Link></li>
              <li><Link to="/projects/intellipdf" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects/intellipdf')}>IntelliPDF (Cognitive Docs)</Link></li>
              <li><Link to="/projects/solvex-ner" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects/solvex-ner')}>SolveX (Graph Reasoning)</Link></li>
              <li><Link to="/projects/atlascore" onMouseEnter={handleHover} onClick={(e) => handleLinkClick(e, '/projects/atlascore')}>AtlasCore (Neural Intelligence)</Link></li>
            </ul>
          </div>

          {/* Direct Authentic Contact Details */}
          <div className="atelier-footer__col">
            <h4 className="atelier-footer__heading">Contact</h4>
            <ul className="atelier-footer__contact-list">
              <li>
                <span className="contact-label">Email</span>
                <a href="mailto:hsenthilkumar68@gmail.com" className="contact-val">
                  hsenthilkumar68@gmail.com
                </a>
              </li>
              <li>
                <span className="contact-label">Phone</span>
                <a href="tel:+919597461434" className="contact-val">
                  +91 95974 61434
                </a>
              </li>
              <li>
                <span className="contact-label">Network</span>
                <a
                  href="https://www.linkedin.com/in/harish-senthilkumar-7b95b035a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-val contact-linkedin"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <span className="contact-label">Studio</span>
                <span className="contact-val">Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Principles */}
        <div className="atelier-footer__bottom">
          <p className="atelier-footer__copy">
            © {currentYear} Harish S. All rights reserved. Crafted with authentic oil craftsmanship & interactive 3D WebGL.
          </p>
          <div className="atelier-footer__badge">
            <span className="status-dot"></span>
            <span>Available for Collaborative Opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
