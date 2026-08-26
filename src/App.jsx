import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ProblemList } from './pages/ProblemList';
import { ProblemDetail } from './pages/ProblemDetail';
import { StudentDashboard } from './pages/StudentDashboard';
import { RewardPage } from './pages/RewardPage';
import { MentorDashboard } from './pages/MentorDashboard';
import { MentorStudentDetail } from './pages/MentorStudentDetail';

const AppContent = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(() => user ? (user.role === 'mentor' ? 'mentor-dashboard' : 'problems') : 'home');
  const [selectedProblemId, setSelectedProblemId] = useState('ps-101');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // If user logs out or logs in, adjust active tab
  useEffect(() => {
    if (!user && currentTab !== 'home' && currentTab !== 'auth' && currentTab !== 'problems' && currentTab !== 'problem-detail') {
      setCurrentTab('home');
    }
  }, [user]);

  const handleSelectProblem = (id) => {
    setSelectedProblemId(id);
    setCurrentTab('problem-detail');
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setCurrentTab('mentor-student-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#1C7293] selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomePage
            onNavigateProblems={() => setCurrentTab('problems')}
            onNavigateAuth={() => setCurrentTab('auth')}
            onSelectProblem={handleSelectProblem}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'problems' && (
          <ProblemList onSelectProblem={handleSelectProblem} />
        )}

        {currentTab === 'problem-detail' && (
          <ProblemDetail
            problemId={selectedProblemId}
            onBack={() => setCurrentTab('problems')}
            onNavigateDashboard={() => setCurrentTab('student-dashboard')}
          />
        )}

        {currentTab === 'student-dashboard' && (
          <StudentDashboard
            onNavigateRewards={() => setCurrentTab('rewards')}
            onNavigateProblems={() => setCurrentTab('problems')}
          />
        )}

        {currentTab === 'rewards' && (
          <RewardPage
            onNavigateDashboard={() => setCurrentTab('student-dashboard')}
          />
        )}

        {currentTab === 'mentor-dashboard' && (
          <MentorDashboard
            onSelectStudent={handleSelectStudent}
          />
        )}

        {currentTab === 'mentor-student-detail' && (
          <MentorStudentDetail
            studentId={selectedStudentId}
            onBack={() => setCurrentTab('mentor-dashboard')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
