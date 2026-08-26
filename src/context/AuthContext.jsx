import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROBLEM_STATEMENTS, INITIAL_ROADMAP_STEPS } from '../data/mockData';
import { api } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Problems database state (synced with SQLite backend)
  const [problems, setProblems] = useState(PROBLEM_STATEMENTS);

  // Saved active user session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('invictus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [joinedProblemId, setJoinedProblemId] = useState(() => {
    return localStorage.getItem('invictus_problem_id') || null;
  });

  const [roadmapSteps, setRoadmapSteps] = useState(() => {
    const saved = localStorage.getItem('invictus_roadmap');
    return saved ? JSON.parse(saved) : INITIAL_ROADMAP_STEPS;
  });

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('invictus_team');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('invictus_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync initial problem statements from backend SQLite DB
  useEffect(() => {
    async function loadBackendProblems() {
      const serverProblems = await api.getProblems();
      if (serverProblems && Array.isArray(serverProblems) && serverProblems.length > 0) {
        setProblems(serverProblems);
      }
    }
    loadBackendProblems();
  }, []);

  // Sync user roadmap progress from backend when user logs in
  useEffect(() => {
    if (user?.uid) {
      async function syncUserBackendData() {
        // Fetch User Enrollment
        const enrollData = await api.getUserEnrollment(user.uid);
        if (enrollData?.enrolled && enrollData.enrollment) {
          setJoinedProblemId(enrollData.enrollment.problem_id);
          setTeamMembers(enrollData.enrollment.team_members || []);
        }

        // Fetch User Progress
        const progressData = await api.getUserRoadmap(user.uid);
        if (progressData?.completedTaskIds) {
          const completedSet = new Set(progressData.completedTaskIds);
          setRoadmapSteps(prevSteps =>
            prevSteps.map(step => ({
              ...step,
              tasks: step.tasks.map(t => ({
                ...t,
                completed: completedSet.has(t.id)
              }))
            }))
          );
        }
      }
      syncUserBackendData();
    }
  }, [user?.uid]);

  // Sync to localStorage as cache fallback
  useEffect(() => {
    if (user) {
      localStorage.setItem('invictus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('invictus_user');
    }
  }, [user]);

  useEffect(() => {
    if (joinedProblemId) {
      localStorage.setItem('invictus_problem_id', joinedProblemId);
    } else {
      localStorage.removeItem('invictus_problem_id');
    }
  }, [joinedProblemId]);

  useEffect(() => {
    localStorage.setItem('invictus_roadmap', JSON.stringify(roadmapSteps));
  }, [roadmapSteps]);

  useEffect(() => {
    localStorage.setItem('invictus_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('invictus_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const logout = () => {
    setUser(null);
    showToast("Logged out successfully");
  };

  // Sign Up / Registration with SQLite DB backend sync & fallback
  const signupAccount = async (fullName, email, phone, college, location, password, role) => {
    const isStudentRole = role === 'student';
    const cleanEmail = email.trim().toLowerCase();
    const payload = {
      fullName,
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      college: college || (isStudentRole ? "Engineering Institute" : "Tech Partner"),
      location: location || "India",
      password: password,
      role: isStudentRole ? 'student' : 'mentor'
    };

    try {
      const result = await api.register(payload);
      if (result?.user) {
        setRegisteredAccounts(prev => [...prev.filter(a => a.email !== cleanEmail), result.user]);
        setUser(result.user);
        showToast(`🎉 Registration successful! Welcome to Invictus, ${result.user.name}.`);
        return result.user;
      }
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        showToast(`❌ ${err.message}`);
        return null;
      }

      // Offline / Static deployment fallback
      const fallbackUser = {
        uid: 'acc-' + Date.now(),
        name: fullName,
        email: cleanEmail,
        phone: payload.phone,
        college: payload.college,
        location: payload.location,
        password: password,
        role: payload.role,
        avatar: isStudentRole 
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
      };

      setRegisteredAccounts(prev => [...prev.filter(a => a.email !== cleanEmail), fallbackUser]);
      setUser(fallbackUser);
      showToast(`🎉 Account created! Welcome, ${fullName}.`);
      return fallbackUser;
    }
  };

  // Sign In / Login with SQLite DB backend sync & fallback
  const loginAccount = async (email, password, role) => {
    const cleanEmail = email.trim().toLowerCase();
    const payload = { email: cleanEmail, password, role };

    try {
      const result = await api.login(payload);
      if (result?.user) {
        setUser(result.user);
        showToast(`🎉 Welcome back, ${result.user.name}! Signed in as ${result.user.role}.`);
        return result.user;
      }
    } catch (err) {
      // Check if user exists in local accounts fallback
      const localAccount = registeredAccounts.find(a => a.email === cleanEmail && a.role === role);
      if (localAccount) {
        if (localAccount.password === password) {
          setUser(localAccount);
          showToast(`🎉 Welcome back, ${localAccount.name}!`);
          return localAccount;
        } else {
          showToast(`❌ Incorrect password! Please check your credentials.`);
          return null;
        }
      }

      showToast(`❌ ${err.message || 'Login failed'}`);
      return null;
    }
  };

  // Calculate overall progress
  const totalTasks = roadmapSteps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasks = roadmapSteps.reduce(
    (acc, step) => acc + step.tasks.filter(t => t.completed).length, 
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Toggle task completion and sync to SQLite DB (Restricted to Mentor access)
  const toggleTaskCompletion = async (taskId, targetUserId = null, forceState = null) => {
    const isMentor = user?.role === 'mentor';
    if (!isMentor && !targetUserId) {
      showToast("🔒 Mentor Access Required: Only assigned mentors can mark phase deliverables as completed.");
      return false;
    }

    const effectiveUserId = targetUserId || user?.uid;
    let nextStateCompleted = false;

    setRoadmapSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        tasks: step.tasks.map(t => {
          if (t.id === taskId) {
            nextStateCompleted = forceState !== null ? forceState : !t.completed;
            return { ...t, completed: nextStateCompleted };
          }
          return t;
        })
      }))
    );

    if (effectiveUserId) {
      await api.toggleTask({
        userId: effectiveUserId,
        problemId: joinedProblemId || 'ps-101',
        taskId,
        completed: nextStateCompleted
      });
    }
    return true;
  };

  // Enroll user in Problem Statement and sync to SQLite DB
  const joinProblemStatement = async (problemId, mode = "Solo", members = []) => {
    setJoinedProblemId(problemId);
    const updatedMembers = members && members.length > 0 ? members : [user ? user.name : "Student"];
    setTeamMembers(updatedMembers);

    if (user?.uid) {
      await api.enroll({
        userId: user.uid,
        problemId,
        mode,
        teamMembers: updatedMembers
      });
    }

    const problem = problems.find(p => p.id === problemId) || PROBLEM_STATEMENTS.find(p => p.id === problemId);
    showToast(`Enrolled in: "${problem?.title || 'Problem Statement'}"`);
  };

  const activeProblem = problems.find(p => p.id === joinedProblemId) || PROBLEM_STATEMENTS.find(p => p.id === joinedProblemId) || null;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      signupAccount,
      loginAccount,
      logout,
      problems,
      roadmapSteps,
      toggleTaskCompletion,
      progressPercent,
      completedTasks,
      totalTasks,
      joinedProblemId,
      activeProblem,
      joinProblemStatement,
      teamMembers,
      registeredAccounts,
      toastMessage,
      showToast
    }}>
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#21295C] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#1C7293]/30 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
