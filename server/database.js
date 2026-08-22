import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'invictus.db');
const db = new DatabaseSync(dbPath);

// Initialize Tables
export function initDb() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      college TEXT,
      location TEXT,
      role TEXT CHECK(role IN ('student', 'mentor')) NOT NULL DEFAULT 'student',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Problem Statements Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS problem_statements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      orgType TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      stipend TEXT,
      shortDescription TEXT,
      fullDescription TEXT,
      tags TEXT, -- JSON array
      deliverables TEXT, -- JSON array
      assignedMentor TEXT, -- JSON object
      teamRequirement TEXT,
      deadline TEXT
    );
  `);

  // Enrollments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      mode TEXT DEFAULT 'Solo',
      team_members TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, problem_id)
    );
  `);

  // Task Progress Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, problem_id, task_id)
    );
  `);

  // Submissions & Mentor Review Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      github_url TEXT,
      demo_url TEXT,
      pitch_notes TEXT,
      score INTEGER DEFAULT 0,
      feedback TEXT,
      status TEXT DEFAULT 'Under Review',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, problem_id)
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // Check if problem statements exist
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM problem_statements`);
  const result = countStmt.get();
  
  if (result.count === 0) {
    console.log('Seeding initial problem statements into SQLite database...');
    
    const insertProblem = db.prepare(`
      INSERT INTO problem_statements (
        id, title, organization, orgType, category, difficulty, stipend,
        shortDescription, fullDescription, tags, deliverables, assignedMentor,
        teamRequirement, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultProblems = [
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
        tags: JSON.stringify(["IoT", "Edge AI", "Anomaly Detection", "Sustainability", "Smart Grid"]),
        deliverables: JSON.stringify([
          "Real-time sensor data ingest API mock",
          "Machine learning anomaly detection model (>92% precision)",
          "Interactive map dashboard for municipal engineers",
          "Hardware architecture blueprint (ESP32/Raspberry Pi)"
        ]),
        assignedMentor: JSON.stringify({
          name: "Rajesh V. Patel",
          title: "Chief Technology Officer",
          organization: "Smart City Infrastructure Board",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
        }),
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
        tags: JSON.stringify(["Fintech", "Machine Learning", "Credit Risk", "Python", "Ethical AI"]),
        deliverables: JSON.stringify([
          "Feature engineering notebook on synthetic financial datasets",
          "XGBoost / LightGBM risk classifier pipeline",
          "Model Explainability UI (SHAP value visualization)",
          "RESTful scoring API integration document"
        ]),
        assignedMentor: JSON.stringify({
          name: "Ananya Sen",
          title: "Fintech Lead Architect",
          organization: "PayTech Global",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
        }),
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
        tags: JSON.stringify(["Computer Vision", "YOLOv8", "Edge Computing", "OpenCV", "Traffic Tech"]),
        deliverables: JSON.stringify([
          "Vehicle classification & density counter pipeline",
          "Green time optimization state machine logic",
          "Emergency ambulance priority override system",
          "Web-based intersection monitoring control center"
        ]),
        assignedMentor: JSON.stringify({
          name: "Dr. Meera Nambiar",
          title: "Principal Research Scientist",
          organization: "Microsoft Research Labs",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
        }),
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
        tags: JSON.stringify(["AgriTech", "Web3 / Ledger", "QR System", "React", "Mobile First"]),
        deliverables: JSON.stringify([
          "Farmer registration & batch logging mobile web app",
          "Immutable transaction ledger schema",
          "Consumer QR code scanner page with batch history timeline",
          "Cold-chain temperature threshold warning alert system"
        ]),
        assignedMentor: JSON.stringify({
          name: "Rajesh V. Patel",
          title: "Chief Technology Officer",
          organization: "Smart City Infrastructure Board",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
        }),
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
        tags: JSON.stringify(["EdTech", "On-Device AI", "PWA", "Offline First", "Vernacular"]),
        deliverables: JSON.stringify([
          "Quantized LLM runtime integration (WebLLM / ONNX Web)",
          "Vernacular speech-to-text input interface",
          "Curriculum alignment question-answering database",
          "Offline sync strategy for progress reports"
        ]),
        assignedMentor: JSON.stringify({
          name: "Dr. Meera Nambiar",
          title: "Principal Research Scientist",
          organization: "Microsoft Research Labs",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
        }),
        teamRequirement: "1 - 3 Members",
        deadline: "40 Days Remaining"
      }
    ];

    for (const p of defaultProblems) {
      insertProblem.run(
        p.id, p.title, p.organization, p.orgType, p.category, p.difficulty,
        p.stipend, p.shortDescription, p.fullDescription, p.tags, p.deliverables,
        p.assignedMentor, p.teamRequirement, p.deadline
      );
    }
  }

  // Seed default users if empty
  const userCountStmt = db.prepare(`SELECT COUNT(*) as count FROM users`);
  if (userCountStmt.get().count === 0) {
    console.log('Seeding default demo users into SQLite database...');
    const insertUser = db.prepare(`
      INSERT INTO users (uid, name, email, password, college, location, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      "acc-student-demo",
      "Aarav Sharma",
      "student@invictus.io",
      "password123",
      "IIT Bombay",
      "Mumbai, India",
      "student",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav%20Sharma"
    );

    insertUser.run(
      "acc-mentor-demo",
      "Rajesh V. Patel",
      "mentor@invictus.io",
      "mentor123",
      "Smart City Infrastructure Board",
      "Delhi, India",
      "mentor",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    );
  }
}

export default db;
