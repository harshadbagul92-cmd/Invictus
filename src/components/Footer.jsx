import React from 'react';
import { Shield, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#21295C] text-slate-300 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1C7293] to-sky-400 flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <span className="text-xl font-extrabold text-white font-sans tracking-tight">INVICTUS</span>
            </div>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              Empowering students to solve real-world industry and government challenges through guided AI mentoring and direct corporate evaluation.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-sky-400 transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-sky-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-sky-400 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sky-300 transition-colors">Problem Statements</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">AI Mentor Engine</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">Student Roadmap</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">Verified Credentials</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stakeholders</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sky-300 transition-colors">Ministry / Govt Partners</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">Corporate Sponsors</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">Industry Mentors</a></li>
              <li><a href="#" className="hover:text-sky-300 transition-colors">University Liaisons</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Invictus Platform. Built for Hackathon Excellence.</p>
          <div className="flex items-center gap-1">
            <span>Powered by AI Mentor Guidance & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
