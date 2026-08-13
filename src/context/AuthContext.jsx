import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROBLEM_STATEMENTS, INITIAL_ROADMAP_STEPS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load persisted user or default null
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

  const [registeredStudents, setRegisteredStudents] = useState(() => {
    const saved = localStorage.getItem('invictus_registered_students');
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
    localStorage.setItem('invictus_registered_students', JSON.stringify(registeredStudents));
  }, [registeredStudents]);

  // Calculate overall progress
  const totalTasks = roadmapSteps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasks = roadmapSteps.reduce(
    (acc, step) => acc + step.tasks.filter(t => t.completed).length, 
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const logout = () => {
    setUser(null);
    setJoinedProblemId(null);
    setTeamMembers([]);
    showToast("Logged out successfully");
  };

  const loginCustom = (email, password, role, fullName = "", college = "") => {
    const isStudentRole = role === 'student';
    const computedName = fullName.trim() || email.split('@')[0].replace('.', ' ').toUpperCase();
    
    const newUserObj = {
      uid: "usr-" + Date.now(),
      name: computedName,
      email,
      role: isStudentRole ? 'student' : 'mentor',
      avatar: isStudentRole 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(computedName)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(computedName)}`,
      college: college || (isStudentRole ? "Engineering Institute" : "Tech Industry Partner"),
      enrolledProblemId: joinedProblemId,
      teamMembers: teamMembers
    };

    setUser(newUserObj);

    if (isStudentRole) {
      setRegisteredStudents(prev => {
        const exists = prev.some(s => s.email === email);
        if (!exists) {
          return [...prev, {
            id: newUserObj.uid,
            name: newUserObj.name,
            email: newUserObj.email,
            avatar: newUserObj.avatar,
            college: newUserObj.college,
            problemId: joinedProblemId || "ps-101",
            problemTitle: PROBLEM_STATEMENTS.find(p => p.id === joinedProblemId)?.title || "Smart Water Grid Leakage Detection",
            progressPercent: progressPercent,
            status: progressPercent === 100 ? "Completed & Verified" : progressPercent > 0 ? "On Track" : "Enrolled",
            teamName: `${newUserObj.name}'s Team`,
            teamMembers: [newUserObj.name],
            tasksCompleted: completedTasks,
            totalTasks: totalTasks,
            recentNote: "Registered & ready to start Phase 1."
          }];
        }
        return prev;
      });
    }

    showToast(`Signed in as ${newUserObj.name} (${newUserObj.role})`);
  };

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

    // Update student's registered student record
    if (user && user.role === 'student') {
      setRegisteredStudents(prev => 
        prev.map(s => s.email === user.email ? {
          ...s,
          problemId: problemId,
          problemTitle: problem?.title || "Problem Statement",
          teamMembers: updatedMembers
        } : s)
      );
    }

    showToast(`Enrolled in: "${problem?.title || 'Problem Statement'}"`);
  };

  const activeProblem = PROBLEM_STATEMENTS.find(p => p.id === joinedProblemId) || null;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loginCustom,
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
      registeredStudents,
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
