import React from 'react';
import { 
  Shield, ArrowRight, Sparkles, CheckCircle2, Award, Users, 
  Bot, Building, Code2, Zap, Target, BookOpen, ChevronRight, Lock, User 
} from 'lucide-react';
import { PROBLEM_STATEMENTS } from '../data/mockData';

export const HomePage = ({ onNavigateProblems, onNavigateAuth, onSelectProblem }) => {
  const featuredProblems = PROBLEM_STATEMENTS.slice(0, 3);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#21295C] via-[#065A82] to-[#1C7293] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Decorative Grid Patterns & Glowing Orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-sky-200 shadow-lg">
            <Sparkles size={14} className="text-amber-300" />
            <span>Invictus 2026 Platform Live • Government & Corporate Mentorship</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Solve Real-World Industry Problems. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-200 via-white to-amber-200 bg-clip-text text-transparent">
              Guided by AI & Top Mentors.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-sky-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Collaborate in teams, build deployable software prototypes for government ministries and tech leaders, and unlock verified internship referrals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onNavigateProblems}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-400 to-[#1C7293] hover:from-sky-300 hover:to-[#065A82] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-sky-900/40 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Explore Problem Statements</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateAuth}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <User size={18} />
              <span>Student / Mentor Sign In</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">50+</span>
              <span className="text-xs text-sky-100 block font-semibold">Active Industry Challenges</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl font-black text-sky-300">₹75L+</span>
              <span className="text-xs text-sky-100 block font-semibold">Total Grants & Stipends</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">100%</span>
              <span className="text-xs text-sky-100 block font-semibold">Mentor Verification</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl sm:text-3xl font-black text-purple-300">200+</span>
              <span className="text-xs text-sky-100 block font-semibold">Hiring Partner Companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1C7293] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            4-Step Innovation Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#21295C]">
            How Invictus Transforms Student Project Ideas
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            From picking a challenge to receiving an accredited certificate and mentor sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-xl transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1C7293] flex items-center justify-center font-black text-lg group-hover:bg-[#1C7293] group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="font-extrabold text-base text-[#21295C]">Choose Challenge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse verified problems posted by government bodies and tech enterprises.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-xl transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="font-extrabold text-base text-[#21295C]">Build with AI Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use integrated Invictus AI Mentor for schema design, code debugging & benchmarking.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-xl transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="font-extrabold text-base text-[#21295C]">Mentor Sign-Off</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned industry mentor verifies roadmap phase deliverables with live radio sign-offs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-xl transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              04
            </div>
            <h3 className="font-extrabold text-base text-[#21295C]">Claim Rewards & Hiring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock verified digital credentials, stipend grants, and fast-track HR referrals.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Problem Statements Section */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#065A82]">
                Active Challenges
              </span>
              <h2 className="text-3xl font-extrabold text-[#21295C] mt-1">
                Featured Industry Problem Statements
              </h2>
            </div>
            <button
              onClick={onNavigateProblems}
              className="text-xs font-bold text-[#1C7293] hover:text-[#065A82] flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <span>View All 50+ Challenges</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem.id)}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-sky-100 text-[#065A82] px-2.5 py-0.5 rounded-full">
                      {problem.orgType}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {problem.stipend.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#21295C] group-hover:text-[#1C7293] transition-colors line-clamp-2">
                    {problem.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {problem.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">{problem.organization}</span>
                  <span className="font-bold text-[#1C7293] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#21295C] via-[#065A82] to-[#1C7293] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to Build & Get Mentored?</h2>
            <p className="text-sm text-sky-100/90 leading-relaxed">
              Register as a student to work on live challenges or join as an industry mentor to guide rising engineers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto">
            <button
              onClick={onNavigateAuth}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-900 px-8 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
