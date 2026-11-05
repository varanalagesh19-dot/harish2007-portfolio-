import { useState, useEffect } from 'react'
import soundEngine from '../utils/soundEngine'
import './GuestbookWall.css'

const INITIAL_GUESTBOOK = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "Museum Curator",
    location: "Vienna, Austria",
    date: "November 2026",
    message: "The Dr. B.R. Ambedkar portrait study has breathtaking chiaroscuro depth. Rare to see an artist seamlessly translate traditional oil discipline into spatial WebGL code.",
    likes: 12
  },
  {
    id: 2,
    name: "Karthik Subramanian",
    role: "Creative Developer",
    location: "Bengaluru, India",
    date: "November 2026",
    message: "The Interactive Constellation background and the NerAccess topographic 3D space are phenomenal. Proud to see this caliber of spatial engineering from Tamil Nadu!",
    likes: 19
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Digital Art Director",
    location: "London, UK",
    date: "October 2026",
    message: "The Dragon Ball sequential manga inks capture genuine kinetic tension. Incredible balance between physical Bristol draftsmanship and 3D WebGL architectures.",
    likes: 15
  }
]

export default function GuestbookWall() {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('harish_atelier_guestbook')
      return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK
    } catch {
      return INITIAL_GUESTBOOK
    }
  })

  const [form, setForm] = useState({ name: '', location: '', message: '' })
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('harish_atelier_guestbook', JSON.stringify(entries))
    } catch (e) {
      console.warn('LocalStorage unavailable', e)
    }
  }, [entries])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    soundEngine.playPageTurn()

    const newEntry = {
      id: Date.now(),
      name: form.name.trim(),
      role: "Studio Visitor",
      location: form.location.trim() || "Earth",
      date: "Just Now",
      message: form.message.trim(),
      likes: 1
    }

    setEntries([newEntry, ...entries])
    setForm({ name: '', location: '', message: '' })
    setJustSubmitted(true)
    setTimeout(() => setJustSubmitted(false), 3000)
  }

  const handleLike = (id) => {
    soundEngine.playHoverTick()
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry
      )
    )
  }

  return (
    <div className="guestbook-section">
      <div className="guestbook-header">
        <div>
          <span className="guestbook-eyebrow">Interactive Feature 03 • Visitor Community</span>
          <h2 className="guestbook-title">Atelier Visitor Wall</h2>
          <p className="guestbook-sub">
            Leave your impressions in Harish's digital guestbook. Notes are recorded directly to the studio register.
          </p>
        </div>
        <div className="guestbook-stats-pill">
          <span>{entries.length} Inscribed Notes</span>
        </div>
      </div>

      <div className="guestbook-grid">
        {/* Note Submission Card */}
        <div className="guestbook-form-card">
          <h3 className="guestbook-form-heading">Inscribe Your Note</h3>
          <p className="guestbook-form-sub">
            Share feedback on the artworks, 3D simulations, or studio aesthetics.
          </p>

          {justSubmitted && (
            <div className="guestbook-success-badge">
              <span>✦ Note inscribed on the studio wall!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="guestbook-form">
            <div className="gb-field">
              <label htmlFor="gb-name" className="gb-label">Your Name</label>
              <input
                id="gb-name"
                type="text"
                required
                placeholder="e.g. Maya Chen"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="gb-input"
              />
            </div>

            <div className="gb-field">
              <label htmlFor="gb-location" className="gb-label">City / Country (Optional)</label>
              <input
                id="gb-location"
                type="text"
                placeholder="e.g. Tokyo, Japan"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="gb-input"
              />
            </div>

            <div className="gb-field">
              <label htmlFor="gb-msg" className="gb-label">Your Note or Impression</label>
              <textarea
                id="gb-msg"
                required
                rows="3"
                placeholder="Share your thoughts on the artworks or 3D spaces..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="gb-input gb-textarea"
              />
            </div>

            <button
              type="submit"
              className="btn-sage gb-submit-btn"
              onMouseEnter={() => soundEngine.playHoverTick()}
            >
              <span>Inscribe into Studio Ledger</span>
              <span>✍</span>
            </button>
          </form>
        </div>

        {/* Live Entries Scroll Wall */}
        <div className="guestbook-entries-wall">
          <div className="entries-stream">
            {entries.map((item) => (
              <article key={item.id} className="entry-card">
                <div className="entry-header">
                  <div className="entry-avatar">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="entry-user-meta">
                    <span className="entry-author">{item.name}</span>
                    <span className="entry-loc">{item.location} • {item.date}</span>
                  </div>
                  <button
                    type="button"
                    className="entry-like-btn"
                    onClick={() => handleLike(item.id)}
                    title="Applaud note"
                  >
                    <span>♥</span>
                    <span className="like-count">{item.likes}</span>
                  </button>
                </div>
                <p className="entry-message">{item.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

