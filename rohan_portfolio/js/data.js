/**
 * ROHAN_OS Portfolio Data Model
 * Stores structured information for Case Studies, Personal Profile, Gallery, and Experience
 */

window.ROHAN_DATA = {
  system: {
    osName: "ROHAN_OS",
    version: "2.6.0-LTS",
    userId: "ROHAN_KHURANA",
    location: "YAMUNANAGAR, INDIA",
    status: "ACTIVE_READY",
    focusMode: "UI_UX_DESIGN",
    learning: ["FRAMER", "DESIGN_SYSTEMS", "AI_ASSISTED_DESIGN"],
    clockTimezone: "Asia/Kolkata"
  },

  caseStudies: [
    {
      id: "NODE_01",
      project: "MMCI Coaching Institute",
      type: "Modern Educational Platform",
      status: "LIVE",
      website: "https://mmcilearning.in/",
      role: "UI/UX Designer",
      description: "Designed and developed a modern educational platform for coaching students with intuitive navigation, course discovery, and lead generation. Focused on creating a clean user experience that helps students easily explore courses, access information, and connect with the institute.",
      tags: ["Education", "Website Design", "UI Design", "UX Strategy", "Lead Generation"],
      metrics: { leads: "+145%", loadTime: "1.2s", accessibility: "AA" },
      color: "var(--color-orange)",
      features: [
        "Seamless conversion-centered landing pages",
        "Frictionless course search and filtering algorithms",
        "Clean, modern component-based web interface",
        "Responsive grids optimized for student mobile devices"
      ]
    },
    {
      id: "NODE_02",
      project: "Giftify",
      type: "E-commerce Gift Platform",
      status: "ONLINE",
      role: "UI/UX Designer",
      description: "Designed a modern e-commerce gifting platform in Figma with user-friendly shopping experiences, intuitive navigation, attractive product displays, and streamlined purchasing flows.",
      tags: ["E-commerce", "Figma", "UI Design", "Product Design", "User Experience"],
      metrics: { conversion: "4.2%", clickThrough: "+22%", components: "80+" },
      color: "var(--color-green)",
      features: [
        "Highly engaging visual gift recommendation quiz flow",
        "Dynamic layout configurations for custom gift boxes",
        "Comprehensive Figma workspace auto-layout design system",
        "Micro-animations for product cart interaction states"
      ]
    },
    {
      id: "NODE_03",
      project: "Socialy",
      type: "Social Media Scheduler Platform",
      status: "ONLINE",
      website: "https://www.figma.com/design/LEx1HwxixNCFOwgdzhIgGt/Untitled?node-id=0-1&t=cdbb4cfr2YVCH2xw-1",
      role: "UI/UX Designer",
      description: "Designed a SaaS-based social media scheduling platform that helps users plan, organize, schedule, and manage content across multiple social media channels. Created dashboard experiences, content management workflows, and scalable design systems.",
      tags: ["UI/UX Design", "SaaS Product", "Dashboard Design", "Design System", "Content Scheduling", "Product Design"],
      metrics: { users: "12K+", retention: "+38%", rating: "4.8" },
      color: "var(--color-green)",
      features: [
        "Interactive cross-network calendar dashboard UI",
        "Granular drag-and-drop workspace controls",
        "Full unified styleguide and design token library",
        "Empathetic user flow for content queuing"
      ]
    },
    {
      id: "NODE_04",
      project: "Trip Buddy",
      type: "Travel Booking Platform",
      status: "LIVE",
      website: "https://www.figma.com/design/7znYJIYlGjdWppfMHQr8Qw/portfolio?node-id=239-537&t=9wwoNuDJPuXG2BpN-1",
      role: "UI/UX Designer",
      description: "Designed a modern travel booking platform that allows users to search, compare, and book flights and hotels through a seamless experience. Focused on improving booking flows, travel discovery, hotel exploration, and user engagement across desktop and mobile devices.",
      tags: ["Travel Tech", "Flight Booking", "Hotel Reservation", "UI/UX Design", "Responsive Design", "User Journey Mapping", "Booking Experience", "Travel Dashboard", "Figma", "Design System"],
      metrics: { bookingFriction: "-35%", bounceRate: "-15%", mobileUsers: "+50%" },
      color: "var(--color-orange)",
      features: [
        "Clean booking flows and hotel exploration user journeys",
        "Unified mobile and desktop layout configurations",
        "Figma design system integration and UI prototyping",
        "Frictionless flight search and reservation parameters"
      ]
    },
    {
      id: "NODE_05",
      project: "Aero Space",
      type: "Premium Footwear Store",
      status: "ONLINE",
      website: "https://www.figma.com/design/7znYJIYlGjdWppfMHQr8Qw/portfolio?node-id=0-1&t=9wwoNuDJPuXG2BpN-1",
      role: "UI/UX Designer",
      description: "Designed a modern shoes e-commerce website with a focus on product discovery, seamless shopping journeys, responsive layouts, and engaging user experiences.",
      tags: ["Responsive Design", "E-commerce", "User Experience", "Product Design", "Figma"],
      metrics: { engagement: "+45%", cartAbandonment: "-18%", FigmaLayers: "120+" },
      color: "var(--color-green)",
      features: [
        "Clean, minimal aesthetic celebrating structural shoe designs",
        "Dynamic product details with responsive image matrices",
        "Frictionless 3-step checkout user flow pattern",
        "Contextual sizing assistance wireframe modules"
      ]
    }
  ],

  profile: {
    userId: "ROHAN_KHURANA",
    status: "ACTIVE_UI_UX_DESIGNER",
    role: "UI/UX DESIGNER",
    location: "YAMUNANAGAR, INDIA",
    education: {
      degree: "Bachelor of Computer Applications",
      institution: "Tilak Raj Chadha Institute of Management and Technology",
      period: "2022 - 2025"
    },
    experience: [
      {
        role: "UI/UX Designer Intern",
        company: "DCT Technology Pvt. Ltd.",
        period: "2025 - 2026",
        highlights: [
          "Designed user-friendly web and mobile interfaces",
          "Created wireframes and prototypes",
          "Collaborated with developers",
          "Improved user flows and usability"
        ]
      }
    ],
    skills: [
      "UI/UX",
      "Visual Design",
      "Wireframing",
      "Storyboarding",
      "User Flows",
      "Process Flows"
    ],
    tools: [
      "Figma",
      "Canva",
      "Framer"
    ],
    languages: [
      "English",
      "Hindi"
    ],
    philosophies: [
      {
        title: "Human-first experiences.",
        detail: "Every pixel must serve a human purpose. Understanding core psychological patterns and friction points leads to intuitive user journeys."
      },
      {
        title: "Design systems before screens.",
        detail: "Standardized tokens, typography scales, and modular components form the solid bedrock of any product, ensuring consistency and seamless scale."
      },
      {
        title: "Simplicity over complexity.",
        detail: "Simplicity is the ultimate sophistication. Stripping away unnecessary visual noise ensures users accomplish their tasks with absolute focus."
      },
      {
        title: "Function before decoration.",
        detail: "Visual style should be a natural byproduct of structure, utility, and interface ergonomics, never an arbitrary veneer."
      },
      {
        title: "Every pixel should have a purpose.",
        detail: "Meticulous detail mapping ensures visual assets serve the experience, avoiding styling bloat and unnecessary cognitive load."
      }
    ]
  },

  gitTimeline: [
    {
      commit: "commit 20252026-dct",
      author: "Rohan <rohan@rohan-os>",
      date: "2025 - 2026",
      repo: "@DCT_TECHNOLOGY",
      status: "UI/UX DESIGN INTERN",
      bullets: [
        "Designed user-friendly web and mobile interfaces for B2B dashboards",
        "Built responsive interactive wireframes, custom prototypes, and component design tokens",
        "Bridged code & visual style by collaborating closely with frontend engineering squads",
        "Refined legacy user flows, resulting in simplified visual navigation paths"
      ]
    },
    {
      commit: "commit 20222025-trc",
      author: "Rohan <rohan@rohan-os>",
      date: "2022 - 2025",
      repo: "@TRC_INSTITUTE",
      status: "BCA GRADUATE",
      bullets: [
        "Completed Bachelor of Computer Applications with honors from Tilak Raj Chadha Institute",
        "Mastered database management, object-oriented concepts, and visual coding foundations",
        "Researched early human-computer interaction models, UX principles, and responsive layout styling",
        "Spearheaded design and user journeys for academic web projects"
      ]
    },
    {
      commit: "commit 20212022-visuals",
      author: "Rohan <rohan@rohan-os>",
      date: "2021 - 2022",
      repo: "@THE_BEGINNING",
      status: "SELF_TAUGHT_CREATIVE",
      bullets: [
        "Mastered Figma auto-layout, wireframe methodologies, and vector structures",
        "Explored typography grids, color harmony vectors, and responsive design guidelines",
        "Engineered various conceptual interfaces, setting the foundation for visual systems"
      ]
    }
  ],

  capabilities: [
    "systems_thinking",
    "user_research",
    "wireframing",
    "prototyping",
    "usability_testing",
    "design_systems",
    "responsive_design",
    "interaction_design"
  ],

  gallery: [
    {
      title: "Socialy Calendar Grid",
      category: "UI Screens",
      tool: "Figma",
      dimensions: "1440x900px",
      description: "An administrative scheduling grid panel designed to optimize weekly post management.",
      svgType: "dashboard"
    },
    {
      title: "E-Commerce Footwear Canvas",
      category: "Landing Pages",
      tool: "Figma & Framer",
      dimensions: "1920x1080px",
      description: "A dark theme product display page built on a dynamic editorial alignment grid.",
      svgType: "landing"
    },
    {
      title: "Coaching Course Hub Mobile",
      category: "Mobile App Designs",
      tool: "Figma",
      dimensions: "390x844px",
      description: "Frictionless learning cards with progressive filters and single-tap checkout UI.",
      svgType: "mobile"
    },
    {
      title: "Gift recommendation Flow",
      category: "Wireframes",
      tool: "Figma",
      dimensions: "1280x800px",
      description: "UX wireframe storyboard illustrating the step-by-step personalized box wizard.",
      svgType: "wireframe"
    },
    {
      title: "Core Tokens & Component Kit",
      category: "Design Systems",
      tool: "Figma",
      dimensions: "2048x1536px",
      description: "Modular buttons, input fields, state lists, and typography styles mapping.",
      svgType: "system"
    },
    {
      title: "Analytics Hub Analytics",
      category: "Dashboard Designs",
      tool: "Figma",
      dimensions: "1440x900px",
      description: "B2B scheduler dashboard incorporating real-time engagement and growth line charts.",
      svgType: "analytics"
    }
  ],

  resume: {
    downloadLink: "https://drive.google.com/file/d/1S5ji37WkhsA9id2enpiNJCLsY-YfCq2R/view?usp=drivesdk",
    summary: "Dedicated UI/UX Designer with a strong educational background in Computer Applications. Meticulous about creating cohesive design systems, human-centered user flows, and high-fidelity prototypes that drive user success. Passionate about bringing clarity to complex visual environments.",
    contactDetails: {
      email: "rohankhurana141@gmail.com",
      phone: "+91 XXXXX XXXXX",
      github: "github.com/rohan-designer",
      linkedin: "https://www.linkedin.com/in/rohan-khurana-425912266"
    }
  }
};
