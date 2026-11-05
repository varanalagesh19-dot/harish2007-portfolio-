import ProjectDetailLayout from './ProjectDetailLayout'
import IntelliPDFCanvas from '../../components/3d/IntelliPDFCanvas'

export default function IntelliPDF() {
  return (
    <ProjectDetailLayout
      id="intellipdf"
      title="IntelliPDF"
      subtitle="Cognitive Document Intelligence & Multi-Format Research Engine"
      category="Document AI & Information Retrieval"
      year="2025"
      role="Interactive Interface & Document Visualization"
      canvasComponent={IntelliPDFCanvas}
      overview="IntelliPDF is a next-generation document analysis and cognitive synthesis platform. It transforms dense academic whitepapers, technical specifications, and legal archives into searchable, interconnected knowledge graphs with real-time multi-document semantic queries."
      challenge="Long-form PDF documents are notorious dead zones for rapid comprehension. Users waste hours scanning pages for key equations, citation cross-references, and conceptual definitions trapped within rigid page layouts."
      solution="Our collaborative engineering group conceived an illuminated 3D document engine that scans, extracts, and parses multi-layer PDF hierarchies, creating interactive visual page layers with live semantic token extraction and contextual cross-linking."
      features={[
        {
          title: "Multi-Layered Optical Synthesis",
          desc: "Deep document structure extraction isolating tables, figures, formulas, and prose."
        },
        {
          title: "Dynamic Cross-Reference Radar",
          desc: "Instant bidirectional linking between citations, footnotes, and corresponding bibliography sources."
        },
        {
          title: "Interactive 3D Sheet Inspection",
          desc: "Spatial document navigation allowing users to flip, peel back, and cross-compare related chapters."
        },
        {
          title: "Cognitive Executive Summaries",
          desc: "Automated high-fidelity syntheses generated per section with bulleted takeaways."
        }
      ]}
      techStack={[
        "React",
        "Three.js",
        "Document Parsing AI",
        "Vector Search",
        "Framer Motion",
        "Web Workers"
      ]}
      prevProject={{
        title: "LinkedX",
        path: "/projects/linkedx"
      }}
      nextProject={{
        title: "SolveX",
        path: "/projects/solvex-ner"
      }}
    />
  )
}

