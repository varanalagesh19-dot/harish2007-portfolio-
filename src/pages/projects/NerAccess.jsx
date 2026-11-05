import ProjectDetailLayout from './ProjectDetailLayout'
import NerAccessCanvas from '../../components/3d/NerAccessCanvas'

export default function NerAccess() {
  return (
    <ProjectDetailLayout
      id="ner-access"
      title="NerAccess"
      subtitle="Intelligent Spatial Wayfinding & Campus Navigation Platform"
      category="Spatial Navigation & GIS"
      year="2025"
      role="3D Interface & Experience Architecture"
      canvasComponent={NerAccessCanvas}
      overview="NerAccess is an intelligent campus routing and location discovery engine engineered to resolve complex spatial navigation within collegiate and enterprise architectures. By combining geospatial mapping coordinates with real-time route optimization, it delivers turn-by-turn guidance across multifaceted multi-building campuses."
      challenge="Navigating vast, multi-floor institutional campuses often leads to disorientation, missed lectures, and spatial friction. Traditional 2D static maps fail to convey verticality, accessible walkways, or real-time barrier detours."
      solution="Our collaborative engineering team built a vectorized spatial routing network that renders topographic elevation layers, calculates optimal accessibility pathways, and visualizes route curves in an intuitive 3D spatial interface."
      features={[
        {
          title: "Multi-Floor Topographic Mapping",
          desc: "Hierarchical waypoint clustering across floors, stairs, and accessible ramps."
        },
        {
          title: "Real-time Dynamic Spline Tracking",
          desc: "Animated route guidance calculating shortest geodesic pathing with obstacle detour logic."
        },
        {
          title: "Interactive Landmark Identification",
          desc: "High-precision location beacons with contextual metadata, room schedules, and points of interest."
        },
        {
          title: "Accessibility-First Pathway Planning",
          desc: "Automated alternate route generator designed specifically for step-free access."
        }
      ]}
      techStack={[
        "React",
        "Three.js",
        "Geospatial Algorithms",
        "Vector GIS",
        "Framer Motion",
        "CSS Grid"
      ]}
      prevProject={{
        title: "AtlasCore",
        path: "/projects/atlascore"
      }}
      nextProject={{
        title: "LinkedX",
        path: "/projects/linkedx"
      }}
    />
  )
}

