import { useState } from 'react'
import { motion } from 'framer-motion'
import soundEngine from '../utils/soundEngine'
import GuestbookWall from '../components/GuestbookWall'
import './Contact.css'

// Smooth Non-Shaking Contact Reveal
const drawerContainerVariants = {
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '3D Web Experience',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    soundEngine.playPageTurn()
    setSubmitted(true)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hsenthilkumar68@gmail.com')
    soundEngine.playHoverTick()
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <motion.div
      className="contact-page"
      variants={drawerContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <section className="container contact-hero">
        <span className="atelier-eyebrow">Studio Communications • Harish S</span>
        <h1 className="atelier-title">
          Initiate a <em>Dialogue</em>
        </h1>
        <p className="contact-hero__lead">
          Whether you wish to commission an original oil portrait, collaborate on an experimental 3D WebGL experience, or discuss creative development opportunities, the studio doors are open.
        </p>
      </section>

      {/* Contact Form & Direct Channels Grid */}
      <section className="container contact-main-section">
        <div className="contact-grid">
          {/* Left Column: Direct Authentic Details */}
          <div className="contact-info-col">
            <div className="contact-card">
              <span className="atelier-eyebrow">Direct Channels</span>
              <h2 className="contact-info-title">Atelier Inquiries</h2>
              <p className="contact-info-desc">
                Reach out directly via email, telephone, or connect through professional networks.
              </p>

              <div className="channels-list">
                {/* Email */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">✉</div>
                  <div className="channel-details">
                    <span className="channel-label">Email Dispatch</span>
                    <a href="mailto:hsenthilkumar68@gmail.com" className="channel-val">
                      hsenthilkumar68@gmail.com
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="copy-btn"
                    title="Copy email to clipboard"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                  >
                    {copiedEmail ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>

                {/* Phone */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">✆</div>
                  <div className="channel-details">
                    <span className="channel-label">Direct Telephone</span>
                    <a href="tel:+919597461434" className="channel-val">
                      +91 95974 61434
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">◈</div>
                  <div className="channel-details">
                    <span className="channel-label">Professional Presence</span>
                    <a
                      href="https://www.linkedin.com/in/harish-senthilkumar-7b95b035a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channel-val channel-linkedin"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">◎</div>
                  <div className="channel-details">
                    <span className="channel-label">Studio Origin</span>
                    <span className="channel-val">Tamil Nadu, India</span>
                  </div>
                </div>
              </div>

              {/* Studio Creed Box */}
              <div className="contact-creed-box">
                <p className="contact-tagline">
                  "Where Imagination Becomes Reality."
                </p>
                <p className="contact-subtagline">
                  An Artist's Mind. A Creator's Universe.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-col">
            <div className="form-card">
              <span className="atelier-eyebrow">Transmission Form</span>
              <h2 className="form-title">Send a Studio Message</h2>

              {submitted ? (
                <div className="form-success-banner">
                  <span className="success-icon">✦</span>
                  <div>
                    <h3 className="success-heading">Message Dispatched</h3>
                    <p className="success-p">
                      Thank you, {formData.name || 'friend'}. Your message has been received by Harish's atelier. Expect a thoughtful reply within 24–48 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playHoverTick()
                        setSubmitted(false)
                        setFormData({ name: '', email: '', subject: '3D Web Experience', message: '' })
                      }}
                      className="btn-ghost"
                      style={{ marginTop: '12px' }}
                    >
                      Send Another Note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="atelier-form">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@example.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Inquiry Nature</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      <option value="3D Web Experience">3D Web Experience / WebGL</option>
                      <option value="Fine Art Oil Commission">Fine Art Oil Painting Commission</option>
                      <option value="Creative Collaboration">Creative Peer Collaboration</option>
                      <option value="Frontend Engineering">Frontend & UI Architecture</option>
                      <option value="General Conversation">General Conversation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Your Message or Project Vision</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell Harish about your vision, timeline, or conceptual ideas..."
                      className="form-input form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-sage form-submit-btn"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                  >
                    <span>Dispatch Message</span>
                    <span>→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature 03: Atelier Visitor Guestbook Wall */}
      <section className="container contact-guestbook-section" style={{ marginTop: '50px', marginBottom: '40px' }}>
        <GuestbookWall />
      </section>
    </motion.div>
  )
}
