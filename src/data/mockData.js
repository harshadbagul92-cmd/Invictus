// Verified Real-World Problem Statements posted by Companies & Government Bodies
export const PROBLEM_STATEMENTS = [
  {
    id: "ps-101",
    title: "Smart Water Grid Leakage Detection & Automated Flow Management",
    organization: "Ministry of Jal Shakti (Govt of India)",
    orgType: "Government",
    category: "IoT & Smart Cities",
    difficulty: "Advanced",
    stipend: "₹75,000 Grant + Internship Opportunity",
    shortDescription: "Develop an edge AI-powered sensor monitoring system to detect subterranean pipe micro-leaks in real-time, reducing municipal water wastage by over 35%.",
    fullDescription: "Municipal water distribution networks across tier-2 and tier-3 cities suffer from up to 40% non-revenue water (NRW) loss due to undetected leaks and unauthorized tapping. Traditional physical inspection is slow and costly. Students will build a predictive anomaly detection pipeline combining acoustics sensor data, flow rates, and pressure signals to pinpoint leak locations down to 5 meters.",
    tags: ["IoT", "Edge AI", "Anomaly Detection", "Sustainability", "Smart Grid"],
    deliverables: [
      "Real-time sensor data ingest API mock",
      "Machine learning anomaly detection model (>92% precision)",
      "Interactive map dashboard for municipal engineers",
      "Hardware architecture blueprint (ESP32/Raspberry Pi)"
    ],
    assignedMentor: {
      name: "Rajesh V. Patel",
      title: "Chief Technology Officer",
      organization: "Smart City Infrastructure Board",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    },
    teamRequirement: "2 - 4 Members",
    deadline: "30 Days Remaining"
  },
  {
    id: "ps-102",
    title: "AI-Powered Micro-Loan Credit Scoring for First-Time Rural Borrowers",
    organization: "PayTech Financial Solutions",
    orgType: "Corporate",
    category: "Fintech & AI",
    difficulty: "Intermediate",
    stipend: "₹60,000 Prize + Fast-track Interview",
    shortDescription: "Construct an alternative credit scoring model leveraging UPI transaction velocity, utility bill metrics, and localized demographic data without traditional bureau credit history.",
    fullDescription: "Over 60 million micro-entrepreneurs in semi-urban regions lack formal credit history, locking them out of institutional loans. PayTech seeks a privacy-preserving ML scoring algorithm that calculates a reliable risk score using alternative digital footprints while avoiding algorithmic bias.",
    tags: ["Fintech", "Machine Learning", "Credit Risk", "Python", "Ethical AI"],
    deliverables: [
      "Feature engineering notebook on synthetic financial datasets",
      "XGBoost / LightGBM risk classifier pipeline",
      "Model Explainability UI (SHAP value visualization)",
      "RESTful scoring API integration document"
    ],
    assignedMentor: {
      name: "Ananya Sen",
      title: "Fintech Lead Architect",
      organization: "PayTech Global",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
    },
    teamRequirement: "1 - 3 Members",
    deadline: "18 Days Remaining"
  },
  {
    id: "ps-103",
    title: "Adaptive Traffic Signal Control System via Edge Computer Vision",
    organization: "Smart Cities Urban Development Mission",
    orgType: "Government",
    category: "Computer Vision & Mobility",
    difficulty: "Advanced",
    stipend: "₹1,00,000 Incubation Support",
    shortDescription: "Replace fixed-timer traffic signals with dynamic camera-based vehicle queue detection to dynamically optimize green-light durations and emergency vehicle clearance.",
    fullDescription: "Urban congestion during peak rush hours leads to massive fuel wastage and emergency response delays. This project challenges teams to build a lightweight computer vision algorithm that processes live CCTV video streams, counts vehicles by category (buses, ambulances, cars, bikes), and communicates dynamic signal timing rules to an intersection controller.",
    tags: ["Computer Vision", "YOLOv8", "Edge Computing", "OpenCV", "Traffic Tech"],
    deliverables: [
      "Vehicle classification & density counter pipeline",
      "Green time optimization state machine logic",
      "Emergency ambulance priority override system",
      "Web-based intersection monitoring control center"
    ],
    assignedMentor: {
      name: "Dr. Meera Nambiar",
      title: "Principal Research Scientist",
      organization: "Microsoft Research Labs",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
    },
    teamRequirement: "2 - 4 Members",
    deadline: "25 Days Remaining"
  },
  {
    id: "ps-104",
    title: "Farm-to-Table Agricultural Produce Verification & Traceability",
    organization: "AgriCorp National Board",
    orgType: "Government",
    category: "Blockchain & AgriTech",
    difficulty: "Intermediate",
    stipend: "₹50,000 Seed Capital",
    shortDescription: "Create a lightweight, QR-code based origin tracing system allowing consumers to verify organic certification, harvest date, and fair-trade farmer payouts.",
    fullDescription: "Consumers increasingly demand transparency regarding organic claims and fair compensation for smallholder farmers. Teams will build a low-cost decentralized ledger system where farmers, cold-storage logistics providers, and retailers log timestamped batch updates accessible via consumer QR scanning.",
    tags: ["AgriTech", "Web3 / Ledger", "QR System", "React", "Mobile First"],
    deliverables: [
      "Farmer registration & batch logging mobile web app",
      "Immutable transaction ledger schema",
      "Consumer QR code scanner page with batch history timeline",
      "Cold-chain temperature threshold warning alert system"
    ],
    assignedMentor: {
      name: "Rajesh V. Patel",
      title: "Chief Technology Officer",
      organization: "Smart City Infrastructure Board",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    },
    teamRequirement: "Solo or Pair",
    deadline: "12 Days Remaining"
  },
  {
    id: "ps-105",
    title: "Offline AI Personal Learning Assistant for Rural Classroom Tablets",
    organization: "EduEmpower Foundation",
    orgType: "Non-Profit / NGO",
    category: "EdTech & Offline AI",
    difficulty: "Intermediate",
    stipend: "₹40,000 Grant + Tablet Distribution",
    shortDescription: "Build a quantized, on-device SLM (Small Language Model) educational tutor that answers curriculum questions in vernacular languages without active internet connectivity.",
    fullDescription: "Millions of rural schools lack continuous internet connectivity. EduEmpower needs an offline WebAssembly / ONNX-based lightweight AI model deployed directly inside Android tablets that can answer STEM questions and generate practice quizzes in Hindi and English.",
    tags: ["EdTech", "On-Device AI", "PWA", "Offline First", "Vernacular"],
    deliverables: [
      "Quantized LLM runtime integration (WebLLM / ONNX Web)",
      "Vernacular speech-to-text input interface",
      "Curriculum alignment question-answering database",
      "Offline sync strategy for progress reports"
    ],
    assignedMentor: {
      name: "Dr. Meera Nambiar",
      title: "Principal Research Scientist",
      organization: "Microsoft Research Labs",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
    },
    teamRequirement: "1 - 3 Members",
    deadline: "40 Days Remaining"
  }
];

// Pristine roadmap steps starting at 0% completion for fresh user progress tracking
export const INITIAL_ROADMAP_STEPS = [
  {
    id: "step-1",
    title: "Phase 1: Domain Research & System Architecture",
    description: "Analyze problem statements, inspect dataset schemas, and finalize system architecture.",
    tasks: [
      { id: "t-101", title: "Review problem requirements & stakeholder guidelines", completed: false },
      { id: "t-102", title: "Define data flow architecture & component diagram", completed: false },
      { id: "t-103", title: "Submit Phase 1 Abstract to assigned mentor", completed: false }
    ]
  },
  {
    id: "step-2",
    title: "Phase 2: Prototype & Pipeline Engineering",
    description: "Build core computational engine, backend APIs, and data processing scripts.",
    tasks: [
      { id: "t-201", title: "Set up project repository with CI/CD pipeline", completed: false },
      { id: "t-202", title: "Implement core algorithm / ML model pipeline", completed: false },
      { id: "t-203", title: "Test with synthetic benchmark data & tune hyperparameters", completed: false }
    ]
  },
  {
    id: "step-3",
    title: "Phase 3: Dashboard & AI Integration",
    description: "Connect machine learning models to the user-facing web dashboard.",
    tasks: [
      { id: "t-301", title: "Build responsive web interface for municipal/corporate admins", completed: false },
      { id: "t-302", title: "Integrate AI Mentor assistant & notification triggers", completed: false }
    ]
  },
  {
    id: "step-4",
    title: "Phase 4: Mentor Review & Live Testing",
    description: "Conduct 1-on-1 review session with human industry mentor and address feedback.",
    tasks: [
      { id: "t-401", title: "Schedule 30-min live review with assigned mentor", completed: false },
      { id: "t-402", title: "Conduct stress testing under low bandwidth conditions", completed: false }
    ]
  },
  {
    id: "step-5",
    title: "Phase 5: Final Submission & Industry Pitch",
    description: "Prepare video walkthrough, documentation, and submit final repository.",
    tasks: [
      { id: "t-501", title: "Record pitch video demoing functional prototype", completed: false },
      { id: "t-502", title: "Publish open source repository & final presentation deck", completed: false }
    ]
  }
];

export const MOCK_AI_RESPONSES = [
  {
    keywords: ["database", "schema", "store", "mongodb", "postgres", "sql"],
    response: "For your Invictus problem statement, I recommend using a hybrid storage pattern: PostgreSQL for structured user transactions/logs, and InfluxDB or Redis for high-frequency IoT sensor telemetry. Would you like me to generate an optimized ER diagram code snippet?"
  },
  {
    keywords: ["accuracy", "model", "train", "dataset", "machine learning", "yolo", "xgboost"],
    response: "To boost model precision without overfitting, consider: 1) Synthetic data augmentation, 2) K-fold cross validation, and 3) Quantizing weights if deploying to edge hardware. Make sure to log precision-recall curves for your mentor review!"
  },
  {
    keywords: ["mentor", "review", "call", "schedule", "feedback"],
    response: "You can click the 'Request Mentor Review' button in your dashboard header or open the Mentor tab to start a live video/chat session."
  },
  {
    keywords: ["linkedin", "badge", "certificate", "internship", "reward"],
    response: "Once you complete all 5 roadmap phases (100% progress), Invictus automatically generates an encrypted digital certificate, badge, and fast-tracks your profile to HR leads at participating companies!"
  }
];
