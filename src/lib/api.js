// Frontend API Service Client connecting to Express + SQLite backend

const API_BASE = '/api';

export const api = {
  // Health Check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      console.warn('API Health Check failed:', err);
      return null;
    }
  },

  // Auth: Register Account
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (err) {
      console.error('API register error:', err);
      throw err;
    }
  },

  // Auth: Login Account
  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err) {
      console.error('API login error:', err);
      throw err;
    }
  },

  // Problems: Fetch List
  async getProblems() {
    try {
      const res = await fetch(`${API_BASE}/problems`);
      if (!res.ok) throw new Error('Failed to fetch problem statements');
      return await res.json();
    } catch (err) {
      console.warn('API getProblems failed, falling back:', err);
      return null;
    }
  },

  // Problems: Fetch Detail
  async getProblemById(id) {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}`);
      if (!res.ok) throw new Error('Failed to fetch problem detail');
      return await res.json();
    } catch (err) {
      console.warn('API getProblemById failed:', err);
      return null;
    }
  },

  // Enrollment: Save Enrollment
  async enroll(enrollmentData) {
    try {
      const res = await fetch(`${API_BASE}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });
      return await res.json();
    } catch (err) {
      console.error('API enroll error:', err);
      return null;
    }
  },

  // Enrollment: Get Enrollment for User
  async getUserEnrollment(userId) {
    try {
      const res = await fetch(`${API_BASE}/enrollments/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('API getUserEnrollment error:', err);
      return null;
    }
  },

  // Roadmap: Fetch Completed Tasks
  async getUserRoadmap(userId) {
    try {
      const res = await fetch(`${API_BASE}/roadmap/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('API getUserRoadmap error:', err);
      return null;
    }
  },

  // Roadmap: Toggle Task Progress
  async toggleTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/roadmap/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      return await res.json();
    } catch (err) {
      console.error('API toggleTask error:', err);
      return null;
    }
  },

  // Submission: Save Student Submission
  async submitProject(submissionData) {
    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      return await res.json();
    } catch (err) {
      console.error('API submitProject error:', err);
      return null;
    }
  },

  // Mentor: Fetch Registered Students
  async getMentorStudents() {
    try {
      const res = await fetch(`${API_BASE}/mentor/students`);
      if (!res.ok) throw new Error('Failed to fetch students');
      return await res.json();
    } catch (err) {
      console.warn('API getMentorStudents error:', err);
      return null;
    }
  },

  // Mentor: Review Student Project
  async submitMentorReview(reviewData) {
    try {
      const res = await fetch(`${API_BASE}/mentor/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      return await res.json();
    } catch (err) {
      console.error('API submitMentorReview error:', err);
      return null;
    }
  },

  // AI Chat Proxy
  async sendAiMessage(message, problemContext) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, problemContext })
      });
      return await res.json();
    } catch (err) {
      console.error('API sendAiMessage error:', err);
      return null;
    }
  },

  // Messages: Send Message to Mentor / Student
  async sendMessage(msgData) {
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      return data;
    } catch (err) {
      console.warn('API sendMessage failed:', err);
      return null;
    }
  },

  // Messages: Fetch User Messages
  async getMessages(userUid) {
    try {
      const res = await fetch(`${API_BASE}/messages/${userUid}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return await res.json();
    } catch (err) {
      console.warn('API getMessages failed:', err);
      return null;
    }
  }
};
