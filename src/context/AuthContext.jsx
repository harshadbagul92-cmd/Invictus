import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROBLEM_STATEMENTS, INITIAL_ROADMAP_STEPS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  // Database of registered user accounts
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('invictus_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
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

  // Sign Up / Registration
  const signupAccount = (fullName, email, college, location, password, role) => {
    const isStudentRole = role === 'student';
    const newAccount = {
      uid: "acc-" + Date.now(),
      name: fullName,
      email: email.trim().toLowerCase(),
      college: college || (isStudentRole ? "Engineering Institute" : "Tech Partner"),
      location: location || "India",
      password: password,
      role: isStudentRole ? 'student' : 'mentor',
      avatar: isStudentRole 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
    };

    setRegisteredAccounts(prev => [...prev.filter(a => a.email !== newAccount.email), newAccount]);
    showToast(`Registration successful! Please Sign In with your Gmail ID and Password.`);
  };

  // Sign In / Login
  const loginAccount = (email, password, role) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredAccounts.find(
      a => a.email === cleanEmail && a.role === role
    );

    const userObj = existing ? existing : {
      uid: "usr-" + Date.now(),
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      college: role === 'student' ? "Engineering College" : "Tech Mentor",
      location: "India",
      role: role,
      avatar: role === 'student'
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`
    };

    setUser(userObj);
    showToast(`Welcome back, ${userObj.name}! Signed in as ${userObj.role}.`);
  };

  // Calculate overall progress
  const totalTasks = roadmapSteps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasks = roadmapSteps.reduce(
    (acc, step) => acc + step.tasks.filter(t => t.completed).length, 
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTaskCompletion = (taskId) => {
    setRoadmapSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        tasks: step.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      }))
    );
  };

  const joinProblemStatement = (problemId, mode = "Solo", members = []) => {
    setJoinedProblemId(problemId);
    const updatedMembers = members && members.length > 0 ? members : [user ? user.name : "Student"];
    setTeamMembers(updatedMembers);

    const problem = PROBLEM_STATEMENTS.find(p => p.id === problemId);
    showToast(`Enrolled in: "${problem?.title || 'Problem Statement'}"`);
  };

  const activeProblem = PROBLEM_STATEMENTS.find(p => p.id === joinedProblemId) || null;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      signupAccount,
      loginAccount,
      logout,
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
