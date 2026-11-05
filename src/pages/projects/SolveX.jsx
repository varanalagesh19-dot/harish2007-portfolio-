import ProjectDetailLayout from './ProjectDetailLayout'
import SolveXCanvas from '../../components/3d/SolveXCanvas'

export default function SolveX() {
  return (
    <ProjectDetailLayout
      id="solvex-ner"
      title="SolveX"
      subtitle="Advanced Analytical Problem Solver & Multi-Step Reasoning Graph"
      category="Algorithmic Reasoning & Graph Theory"
      year="2024"
      role="Graph Visualization & Interface Architecture"
      canvasComponent={SolveXCanvas}
      overview="SolveX is an algorithmic reasoning engine designed to break down intricate engineering, mathematical, and logical challenges into transparent, verifiable dependency graphs. Instead of delivering black-box answers, SolveX exposes the entire chain of thought."
      challenge="Complex computational problems are prone to cascade errors when solved in opaque, monolithic steps. Students and researchers need to see the intermediate lemmas, branch conditions, and constraint propagations to truly verify validity."
      solution="Working collaboratively, our development team engineered a 3D directed acyclic graph (DAG) visualizer where each lemma is an interactive mathematical node, connected by animated energy vectors that illuminate the verification proof path."
      features={[
        {
          title: "Step-by-Step Proof Graph Traversal",
          desc: "Interactive visual exploration of logical derivations with backward and forward chaining."
        },
        {
          title: "Constraint Propagation Engine",
          desc: "Real-time boundary validation that highlights conflicting premises or unresolved edge cases."
        },
        {
          title: "Polyhedral Mathematical Node Geometry",
          desc: "Distinct 3D geometric identifiers for axioms, intermediate lemmas, and terminal proofs."
        },
        {
          title: "Algorithmic Energy Pulse Animation",
          desc: "Dynamic visual feedback tracing the exact flow of logical verification across nodes."
        }
      ]}
      techStack={[
        "React",
        "Three.js",
        "Graph Algorithms",
        "Symbolic Computation",
        "WebGL Shaders",
        "CSS Modular Design"
      ]}
      prevProject={{
        title: "IntelliPDF",
        path: "/projects/intellipdf"
      }}
      nextProject={{
        title: "AtlasCore",
        path: "/projects/atlascore"
      }}
    />
  )
}

