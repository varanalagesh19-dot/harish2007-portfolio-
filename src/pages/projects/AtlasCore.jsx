import ProjectDetailLayout from './ProjectDetailLayout'
import AtlasCoreCanvas from '../../components/3d/AtlasCoreCanvas'

export default function AtlasCore() {
  return (
    <ProjectDetailLayout
      id="atlascore"
      title="AtlasCore"
      subtitle="Next-Generation Conversational Intelligence & Contextual Assistant"
      category="Conversational AI & Systems"
      year="2024"
      role="3D Spatial UI & Real-Time Interaction"
      canvasComponent={AtlasCoreCanvas}
      overview="AtlasCore represents an exploratory foray into spatial conversational interfaces. Bridging generative language models with ambient 3D visual environments, AtlasCore provides an organic, responsive interface that feels like communicating with an intelligent digital companion."
      challenge="Most conversational AI user interfaces remain stuck in flat, sterile chat bubbles resembling text messages from 2008. They fail to convey internal context states, audio frequency presence, or memory association rings."
      solution="Our collaborative development team designed an immersive conversational sphere that pulses with harmonic audio frequencies, revolves orbital memory rings, and reacts dynamically to user speech cadences and conversational topics."
      features={[
        {
          title: "Multi-Tiered Spatial Neural Core",
          desc: "A living 3D spherical core that expands, pulses, and alters color temperature based on cognitive load."
        },
        {
          title: "Orbital Memory Constellations",
          desc: "Interactive planetary rings representing short-term context, working memory, and persistent user preferences."
        },
        {
          title: "Harmonic Voice Frequency Ribbons",
          desc: "Real-time sinusoidal ribbon shaders reflecting vocal intonation, amplitude, and conversational pauses."
        },
        {
          title: "Contextual Ambient Illuminations",
          desc: "Fluid transitions between calm sage green listening states and warm terracotta reasoning states."
        }
      ]}
      techStack={[
        "React",
        "Three.js",
        "Audio Frequency Shaders",
        "LLM Interface Hooks",
        "Framer Motion",
        "Web Audio API"
      ]}
      prevProject={{
        title: "SolveX",
        path: "/projects/solvex-ner"
      }}
      nextProject={{
        title: "NerAccess",
        path: "/projects/ner-access"
      }}
    />
  )
}

