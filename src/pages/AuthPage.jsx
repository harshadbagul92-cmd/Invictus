import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, UserCheck, ArrowRight, Lock, Mail, Building, MapPin, CheckCircle2 } from 'lucide-react';

export const AuthPage = ({ setCurrentTab }) => {
  const { signupAccount, loginAccount, showToast } = useAuth();
  const [mode, setMode] = useState('login'); // Default to Login view
  const [role, setRole] = useState('student'); // 'student' or 'mentor'

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !college.trim() || !location.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast("⚠️ Please fill in all 5 required fields (Full Name, College, Email, Location, Password & Confirmation).");
      return;
    }

    if (password !== confirmPassword) {
      showToast("❌ Password confirmation does not match! Please check both password fields.");
      return;
    }

    if (password.length < 4) {
      showToast("⚠️ Password must be at least 4 characters long.");
      return;
    }

    const resUser = await signupAccount(fullName, email, college, location, password, role);
    if (resUser) {
      setConfirmPassword('');
      setPassword('');
      setMode('login'); // Pre-fills registered Email and switches to Sign In mode
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("⚠️ Please enter both your Email ID and Password.");
      return;
    }

    const resUser = await loginAccount(email, password, role);
    if (resUser) {
      if (role === 'student') {
        setCurrentTab('problems');
      } else {
        setCurrentTab('mentor-dashboard');
      }
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

        {/* MODE 1: SIGN UP FORM */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            {/* 1. Full Name */}
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* 2. College Name */}
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* 3. Email ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email ID / Gmail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* 4. Location */}
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* 5. Password (1st time) */}
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293] font-medium"
                />
              </div>
            </div>

            {/* 6. Confirm Password (2nd time) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Confirm Password</span>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {password === confirmPassword ? '✓ Match' : '✗ Password Mismatch'}
                  </span>
                )}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 font-medium ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-rose-300 focus:ring-rose-400' 
                      : 'border-slate-200 focus:ring-[#1C7293]'
                  }`}
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

        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'login' 
              ? "Don't have an account yet?" 
              : "Already registered your account?"}
          </p>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#065A82] rounded-xl font-bold text-xs border border-slate-200/80 transition-all flex items-center justify-center gap-1.5"
          >
            {mode === 'login' ? (
              <>
                <span>New Student / Mentor? Register / Sign Up Here</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <span>Already Registered? Sign In Here</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
