import ProjectDetailLayout from './ProjectDetailLayout'
import LinkedXCanvas from '../../components/3d/LinkedXCanvas'

export default function LinkedX() {
  return (
    <ProjectDetailLayout
      id="linkedx"
      title="LinkedX"
      subtitle="Intelligent Social Content Analysis & Professional Presence Engine"
      category="Social Analytics & NLP"
      year="2025"
      role="Interactive Data Visualization & UI Engineering"
      canvasComponent={LinkedXCanvas}
      overview="LinkedX is an analytical intelligence platform designed to decode professional social communication patterns, engagement velocity, and topic resonance. Built to empower creators and domain leaders with deep contextual insights, it maps the hidden dynamics behind high-impact professional writing."
      challenge="Creators frequently struggle to understand why specific posts resonate while others stall. Traditional metric dashboards offer rear-view vanity metrics (likes, impressions) without explaining content sentiment, vocabulary density, or audience interaction topology."
      solution="Through collaborative teamwork, we developed an interactive NLP and analytics suite that parses narrative syntax, benchmarks audience sentiment clusters in spatial 3D, and provides predictive timing and structural suggestions."
      features={[
        {
          title: "Semantic Content Decomposition",
          desc: "Automated analysis of hook phrasing, readability indices, and narrative tension arcs."
        },
        {
          title: "Audience Sentiment Clustering",
          desc: "Multi-dimensional visual mapping of comment reactions, conversational tone, and debate nodes."
        },
        {
          title: "Predictive Engagement Velocity",
          desc: "Algorithmic forecasting of post virality based on historical temporal resonance."
        },
        {
          title: "Spatial Data Cards Interface",
          desc: "Fluid 3D visualization cards displaying real-time metrics with zero cognitive clutter."
        }
      ]}
      techStack={[
        "React",
        "Three.js",
        "NLP Pipelines",
        "Data Analytics",
        "WebGL",
        "Tailwind / Custom CSS"
      ]}
      prevProject={{
        title: "NerAccess",
        path: "/projects/ner-access"
      }}
      nextProject={{
        title: "IntelliPDF",
        path: "/projects/intellipdf"
      }}
    />
  )
}

