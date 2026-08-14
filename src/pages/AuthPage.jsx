import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, UserCheck, ArrowRight, Lock, Mail, Building, MapPin, CheckCircle2 } from 'lucide-react';

export const AuthPage = ({ setCurrentTab }) => {
  const { signupAccount, loginAccount } = useAuth();
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [role, setRole] = useState('student'); // 'student' or 'mentor'

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    signupAccount(fullName, email, college, location, password, role);
    // Switch to login mode automatically after signup!
    setMode('login');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both your Gmail ID and Password.");
      return;
    }

    loginAccount(email, password, role);

    if (role === 'student') {
      setCurrentTab('problems');
    } else {
      setCurrentTab('mentor-dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1C7293] to-sky-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-[#1C7293]/30">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-black text-[#21295C] tracking-tight">INVICTUS</h2>
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'signup' ? 'Create New Account' : 'Sign In to Your Account'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-[#065A82] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={15} />
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('mentor')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'mentor'
                ? 'bg-[#21295C] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck size={15} />
            Mentor
          </button>
        </div>

        {/* Form View Toggle */}
        <div className="flex justify-center border-b border-slate-100 pb-3">
          <div className="flex gap-4 text-xs font-bold">
            <button
              onClick={() => setMode('signup')}
              className={`pb-1 transition-colors ${
                mode === 'signup'
                  ? 'text-[#1C7293] border-b-2 border-[#1C7293]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              1. Sign Up (First Time)
            </button>
            <button
              onClick={() => setMode('login')}
              className={`pb-1 transition-colors ${
                mode === 'login'
                  ? 'text-[#1C7293] border-b-2 border-[#1C7293]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              2. Sign In (Login)
            </button>
          </div>
        </div>

        {/* MODE 1: SIGN UP FORM */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* Gmail ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gmail ID / Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* College Name / Organization */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {role === 'student' ? 'College / University Name' : 'Company / Organization Name'}
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. IIT Bombay' : 'e.g. Microsoft Research'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location (City / State)
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1C7293] hover:bg-[#065A82] text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#1C7293]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>Complete Sign Up ({role === 'student' ? 'Student' : 'Mentor'})</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          /* MODE 2: SIGN IN (LOGIN) FORM — ASKS ONLY GMAIL ID & PASSWORD */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {role === 'student' ? 'Student Gmail ID' : 'Mentor Gmail ID'}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#065A82] hover:bg-[#1C7293] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#065A82]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>Sign In as {role === 'student' ? 'Student' : 'Mentor'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-xs font-bold text-[#1C7293] hover:underline"
          >
            {mode === 'signup'
              ? 'Already registered? Click to Sign In with Gmail & Password'
              : "Don't have an account yet? Click to Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
