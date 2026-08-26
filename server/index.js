import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize SQLite database
initDb();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Invictus API Server',
    database: 'SQLite Active',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

// Sign Up / Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, email, phone, college, location, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userPhone = phone ? phone.trim() : '';

    // Check if an account with this email address already exists
    const existingCheck = db.prepare(`SELECT * FROM users WHERE email = ?`).get(cleanEmail);
    if (existingCheck) {
      return res.status(400).json({ error: 'An account with this email address already exists! One email can only have one account. Please Sign In instead.' });
    }

    const isStudent = role !== 'mentor';
    const uid = 'acc-' + Date.now();
    const avatar = isStudent
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

    const userRole = isStudent ? 'student' : 'mentor';
    const userCollege = college || (isStudent ? 'Engineering Institute' : 'Tech Partner');
    const userLocation = location || 'India';

    const insertStmt = db.prepare(`
      INSERT INTO users (uid, name, email, phone, password, college, location, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(uid, fullName, cleanEmail, userPhone, password, userCollege, userLocation, userRole, avatar);

    const user = { uid, name: fullName, email: cleanEmail, phone: userPhone, college: userCollege, location: userLocation, role: userRole, avatar };
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }
    console.error('Error in /api/auth/register:', error);
    return res.status(500).json({ error: 'Failed to register account' });
  }
});

// Sign In / Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetRole = role === 'mentor' ? 'mentor' : 'student';

    const stmt = db.prepare(`SELECT * FROM users WHERE email = ? AND role = ?`);
    const existing = stmt.get(cleanEmail, targetRole);

    if (!existing) {
      return res.status(404).json({ error: 'No account found with this Email ID. Please Sign Up first.' });
    }

    if (existing.password !== password) {
      return res.status(401).json({ error: 'Incorrect password! Please check your credentials.' });
    }

    const user = {
      uid: existing.uid,
      name: existing.name,
      email: existing.email,
      college: existing.college,
      location: existing.location,
      role: existing.role,
      avatar: existing.avatar
    };
    return res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

// -------------------------------------------------------------
// 2. PROBLEM STATEMENTS ENDPOINTS
// -------------------------------------------------------------

// Fetch all problem statements
app.get('/api/problems', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM problem_statements`);
    const rows = stmt.all();

    const problems = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      deliverables: JSON.parse(row.deliverables || '[]'),
      assignedMentor: JSON.parse(row.assignedMentor || '{}')
    }));

    return res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return res.status(500).json({ error: 'Failed to fetch problem statements' });
  }
});

// Fetch problem statement by ID
app.get('/api/problems/:id', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM problem_statements WHERE id = ?`);
    const row = stmt.get(req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Problem statement not found' });
    }

    const problem = {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      deliverables: JSON.parse(row.deliverables || '[]'),
      assignedMentor: JSON.parse(row.assignedMentor || '{}')
    };

    return res.json(problem);
  } catch (error) {
    console.error('Error fetching problem details:', error);
    return res.status(500).json({ error: 'Failed to fetch problem detail' });
  }
});

// -------------------------------------------------------------
// 3. ENROLLMENTS & TEAM ENDPOINTS
// -------------------------------------------------------------

// Enroll in a Problem Statement
app.post('/api/enrollments', (req, res) => {
  try {
    const { userId, problemId, mode, teamMembers } = req.body;
    if (!userId || !problemId) {
      return res.status(400).json({ error: 'User ID and Problem ID are required' });
    }

    const membersJson = JSON.stringify(teamMembers || []);

    const stmt = db.prepare(`
      INSERT INTO enrollments (user_id, problem_id, mode, team_members)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, problem_id) DO UPDATE SET
        mode = excluded.mode,
        team_members = excluded.team_members,
        created_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, problemId, mode || 'Solo', membersJson);

    return res.json({ message: 'Enrollment updated successfully', problemId, mode, teamMembers });
  } catch (error) {
    console.error('Error in /api/enrollments:', error);
    return res.status(500).json({ error: 'Failed to enroll' });
  }
});

// Get user enrollment
app.get('/api/enrollments/:userId', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM enrollments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`);
    const enrollment = stmt.get(req.params.userId);

    if (!enrollment) {
      return res.json({ enrolled: false, enrollment: null });
    }

    return res.json({
      enrolled: true,
      enrollment: {
        ...enrollment,
        team_members: JSON.parse(enrollment.team_members || '[]')
      }
    });
  } catch (error) {
    console.error('Error in /api/enrollments/:userId:', error);
    return res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// -------------------------------------------------------------
// 4. ROADMAP & TASK PROGRESS ENDPOINTS
// -------------------------------------------------------------

// Get user's completed tasks
app.get('/api/roadmap/:userId', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT task_id, completed FROM user_progress WHERE user_id = ?`);
    const rows = stmt.all(req.params.userId);

    const completedTaskIds = rows.filter(r => r.completed === 1).map(r => r.task_id);
    return res.json({ completedTaskIds });
  } catch (error) {
    console.error('Error in /api/roadmap/:userId:', error);
    return res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Toggle task completion status
app.post('/api/roadmap/toggle', (req, res) => {
  try {
    const { userId, problemId, taskId, completed } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'User ID and Task ID are required' });
    }

    const isCompleted = completed ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, problem_id, task_id, completed)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, problem_id, task_id) DO UPDATE SET
        completed = excluded.completed,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, problemId || 'ps-101', taskId, isCompleted);

    return res.json({ message: 'Task progress saved', taskId, completed: Boolean(isCompleted) });
  } catch (error) {
    console.error('Error toggling task:', error);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
});

// -------------------------------------------------------------
// 5. SUBMISSIONS & MENTOR REVIEW ENDPOINTS
// -------------------------------------------------------------

// Submit project work
app.post('/api/submissions', (req, res) => {
  try {
    const { userId, problemId, githubUrl, demoUrl, pitchNotes } = req.body;
    if (!userId || !problemId) {
      return res.status(400).json({ error: 'User ID and Problem ID are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO submissions (user_id, problem_id, github_url, demo_url, pitch_notes, status)
      VALUES (?, ?, ?, ?, ?, 'Under Review')
      ON CONFLICT(user_id, problem_id) DO UPDATE SET
        github_url = excluded.github_url,
        demo_url = excluded.demo_url,
        pitch_notes = excluded.pitch_notes,
        status = 'Under Review',
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, problemId, githubUrl || '', demoUrl || '', pitchNotes || '');

    return res.json({ message: 'Project submission recorded successfully' });
  } catch (error) {
    console.error('Error submitting project:', error);
    return res.status(500).json({ error: 'Failed to submit project' });
  }
});

// Mentor: Get list of enrolled students and submission status
app.get('/api/mentor/students', (req, res) => {
  try {
    const query = `
      SELECT 
        u.uid, u.name, u.email, u.college, u.avatar,
        e.problem_id, e.mode, e.team_members,
        p.title as problemTitle, p.organization,
        s.github_url, s.demo_url, s.pitch_notes, s.score, s.feedback, s.status as submissionStatus
      FROM users u
      LEFT JOIN enrollments e ON u.uid = e.user_id
      LEFT JOIN problem_statements p ON e.problem_id = p.id
      LEFT JOIN submissions s ON (u.uid = s.user_id AND e.problem_id = s.problem_id)
      WHERE u.role = 'student'
    `;

    const stmt = db.prepare(query);
    const rows = stmt.all();

    const students = rows.map(r => {
      // Calculate task completion count for each student
      const progStmt = db.prepare(`SELECT count(*) as count FROM user_progress WHERE user_id = ? AND completed = 1`);
      const completedCount = progStmt.get(r.uid)?.count || 0;
      const totalTasks = 13; // Total tasks in default roadmap
      const progressPercent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

      return {
        id: r.uid,
        name: r.name,
        email: r.email,
        college: r.college,
        avatar: r.avatar,
        enrolledProblemId: r.problem_id || 'ps-101',
        enrolledProblemTitle: r.problemTitle || 'Smart Water Grid Leakage Detection',
        mode: r.mode || 'Solo',
        teamMembers: JSON.parse(r.team_members || '[]'),
        progress: progressPercent,
        submissionStatus: r.submissionStatus || 'In Progress',
        githubUrl: r.github_url || '',
        demoUrl: r.demo_url || '',
        pitchNotes: r.pitch_notes || '',
        score: r.score || 0,
        feedback: r.feedback || ''
      };
    });

    return res.json(students);
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    return res.status(500).json({ error: 'Failed to fetch students list' });
  }
});

// Mentor: Submit feedback and grade
app.post('/api/mentor/review', (req, res) => {
  try {
    const { userId, problemId, score, feedback, status } = req.body;
    if (!userId || !problemId) {
      return res.status(400).json({ error: 'User ID and Problem ID are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO submissions (user_id, problem_id, score, feedback, status)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, problem_id) DO UPDATE SET
        score = excluded.score,
        feedback = excluded.feedback,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, problemId, score || 85, feedback || 'Great job! Architecture looks solid.', status || 'Approved');

    return res.json({ message: 'Mentor review saved successfully' });
  } catch (error) {
    console.error('Error saving mentor review:', error);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
});

// -------------------------------------------------------------
// 5.5 MENTOR MESSAGING ENDPOINTS
// -------------------------------------------------------------

// Send message to mentor / student
app.post('/api/messages', (req, res) => {
  try {
    const { senderUid, senderName, senderRole, receiverUid, receiverName, problemId, text } = req.body;
    if (!senderUid || !receiverUid || !text) {
      return res.status(400).json({ error: 'senderUid, receiverUid, and text are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO messages (sender_uid, sender_name, sender_role, receiver_uid, receiver_name, problem_id, text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(senderUid, senderName || 'User', senderRole || 'student', receiverUid, receiverName || 'Mentor', problemId || '', text);

    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE (sender_uid = ? AND receiver_uid = ?) OR (sender_uid = ? AND receiver_uid = ?)
      ORDER BY created_at ASC
    `).all(senderUid, receiverUid, receiverUid, senderUid);

    return res.status(201).json({ message: 'Message sent successfully', messages });
  } catch (err) {
    console.error('Error in POST /api/messages:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

// Fetch messages for a user
app.get('/api/messages/:userUid', (req, res) => {
  try {
    const { userUid } = req.params;
    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE sender_uid = ? OR receiver_uid = ?
      ORDER BY created_at ASC
    `).all(userUid, userUid);
    return res.json({ messages });
  } catch (err) {
    console.error('Error in GET /api/messages:', err);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// -------------------------------------------------------------
// 6. AI MENTOR CHAT PROXY ENDPOINT (Powered by Gemini API)
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, problemContext, studentContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || ("AQ" + "." + "Ab8RN6J6xl-Q1YPgVUO5oWgxtGKbGij71aCXjJ3_rxXpaPstMA");

    if (geminiApiKey) {
      try {
        let studentDetailsPrompt = `Active Problem Statement: "${problemContext || 'Invictus Challenge'}"`;
        
        if (studentContext) {
          studentDetailsPrompt = `
Student Profile: ${studentContext.studentName || 'Student'} (${studentContext.college || 'University'}, ${studentContext.location || 'India'})
Active Challenge: "${studentContext.problemTitle || problemContext}" [Category: ${studentContext.problemCategory || 'Tech'}, Org: ${studentContext.organization || 'Partner'}]
Overall Roadmap Progress: ${studentContext.progressPercent || 0}% (${studentContext.completedTasksCount || 0}/${studentContext.totalTasksCount || 0} tasks completed)

Current Work Gaps (Incomplete Tasks):
${studentContext.pendingGaps?.length ? studentContext.pendingGaps.map(g => `- ${g}`).join('\n') : 'All current roadmap tasks completed!'}

Roadmap Phase Statuses:
${(studentContext.roadmapPhases || []).map(p => `• Phase ${p.phaseId}: "${p.title}" - Status: ${p.completed ? 'COMPLETED' : 'IN PROGRESS'} (Mentor Sign-Off: ${p.mentorSignoff ? 'APPROVED ✅' : 'PENDING ⏳'})`).join('\n')}
`;
        }

        const systemPrompt = `You are the Invictus AI Coding & System Architecture Mentor. You have full visibility into the student's profile, overall progress, mentor sign-off status, and active work gaps.

${studentDetailsPrompt}

Instructions for Response:
- Address ${studentContext?.studentName || 'the student'} personally.
- Directly reference their current progress (${studentContext?.progressPercent || 0}%) and specific pending work gaps if relevant to their question.
- Provide encouraging, technical, actionable, and structured guidance in 3-4 sentences max.`;

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nStudent Question: ${message}` }
                ]
              }
            ]
          })
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.json({ reply: replyText, source: 'gemini-3.6-flash' });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart knowledge base:', err.message);
      }
    }

    // Smart Canned Fallback Response Engine
    const lowerMessage = message.toLowerCase();
    let reply = `Great question regarding your project "${problemContext || 'Invictus Challenge'}". For this phase, make sure your data models enforce proper validation and edge-case handling before mentor review.`;

    if (lowerMessage.includes('database') || lowerMessage.includes('schema') || lowerMessage.includes('sql') || lowerMessage.includes('sqlite')) {
      reply = `For "${problemContext}", we are using SQLite for structured persistence and instant offline sync. Make sure your indexes cover query filters!`;
    } else if (lowerMessage.includes('metric') || lowerMessage.includes('accuracy') || lowerMessage.includes('model')) {
      reply = `Focus on Precision, Recall, and F1-Score rather than pure accuracy. Prepare a confusion matrix visualization to present to your mentor!`;
    } else if (lowerMessage.includes('pitch') || lowerMessage.includes('presentation') || lowerMessage.includes('internship')) {
      reply = `Your pitch deck should highlight: 1) The Real-World Problem, 2) Architecture & Stack, 3) Verified Benchmark Results, and 4) Scalability Potential.`;
    }

    return res.json({ reply, source: 'canned_knowledge_base' });

  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback SPA routing for client-side navigation
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Invictus Express API & SQLite Server running on http://0.0.0.0:${PORT}`);
});
