import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Award, LayoutDashboard, FileText, LogOut, Users, UserCheck, Home } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, logout, progressPercent } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#21295C] border-b border-white/10 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1C7293] to-sky-400 flex items-center justify-center shadow-lg shadow-[#1C7293]/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  INVICTUS
                </span>
                <span className="text-[10px] bg-[#1C7293] text-sky-100 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  AI + Mentor
                </span>
              </div>
              <p className="text-[11px] text-sky-200/70 hidden sm:block">Bridging Talent with Real-World Challenges</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-[#1C7293] text-white shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home size={16} />
              Home
            </button>

            <button
              onClick={() => setCurrentTab('problems')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'problems' || currentTab === 'problem-detail'
                  ? 'bg-[#1C7293] text-white shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText size={16} />
              Problem Statements
            </button>

            {user && user.role === 'student' && (
              <>
                <button
                  onClick={() => setCurrentTab('student-dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'student-dashboard'
                      ? 'bg-[#1C7293] text-white shadow-md'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  My Dashboard
                  <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded-full font-bold">
                    {progressPercent}%
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('rewards')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'rewards'
                      ? 'bg-[#1C7293] text-white shadow-md'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Award size={16} />
                  Rewards & Certificate
                </button>
              </>
            )}

            {user && user.role === 'mentor' && (
              <button
                onClick={() => setCurrentTab('mentor-dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'mentor-dashboard' || currentTab === 'mentor-student-detail'
                    ? 'bg-[#1C7293] text-white shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users size={16} />
                Mentor Dashboard
              </button>
            )}
          </nav>

          {/* User Profile / Login Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 pl-2 pr-3 py-1.5 rounded-full border border-white/10">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#1C7293]"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-sky-200 capitalize leading-tight">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('auth');
                  }}
                  title="Logout"
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="bg-[#1C7293] hover:bg-[#065A82] text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center gap-2"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
