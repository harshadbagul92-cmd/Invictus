import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Award, ShieldCheck, Linkedin, Download, Share2, Sparkles, 
  CheckCircle2, Building2, ArrowLeft, ExternalLink, Copy, Check 
} from 'lucide-react';

export const RewardPage = ({ onNavigateDashboard }) => {
  const { user, activeProblem, progressPercent, showToast } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti burst on render
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  const certificateId = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const linkedInPostText = `🎉 Thrilled to announce that I have successfully solved the "${activeProblem.title}" problem statement posted by ${activeProblem.organization} via the INVICTUS Platform! 🚀\n\nUnder the mentorship of ${activeProblem.assignedMentor.name}, our team developed a functional prototype and passed all industry validation phases. Verified Credential ID: ${certificateId}.\n\n#Invictus #Hackathon #Innovation #StudentTalent #${activeProblem.tags[0] || 'Tech'}`;

  const handleCopyLinkedIn = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setIsCopied(true);
    showToast("LinkedIn post text copied to clipboard!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateDashboard}
          className="flex items-center gap-2 text-sm font-bold text-[#065A82] hover:text-[#21295C]"
        >
          <ArrowLeft size={18} />
          Back to Project Dashboard
        </button>

        <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-600" /> Verified Prototype Completion
        </span>
      </div>

      {/* Main Reward Celebration Card */}
      <div className="bg-gradient-to-br from-[#21295C] via-[#065A82] to-[#1C7293] rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-glow mb-2">
          <Award size={56} className="text-amber-300 animate-bounce" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Congratulations, {user?.name || 'Student Achiever'}! 🎉
        </h1>

        <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          You have successfully completed all roadmap phases for <br />
          <span className="font-bold text-white underline">{activeProblem.title}</span>
        </p>

        {/* Corporate Internship Notification Banner */}
        <div className="bg-emerald-500/20 backdrop-blur-md p-5 rounded-2xl border border-emerald-400/40 text-emerald-100 text-left max-w-xl mx-auto space-y-2">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <span>Eligible for Direct Corporate Internship Review</span>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed pl-7">
            Your prototype repository and mentor sign-off have been forwarded directly to the talent acquisition leads at <span className="font-bold text-white">{activeProblem.organization}</span> for priority review.
          </p>
        </div>

        {/* Quick Share Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsLinkedInModalOpen(true)}
            className="bg-[#0077B5] hover:bg-[#005E93] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Linkedin size={18} />
            Share Credential on LinkedIn
          </button>

          <button
            onClick={() => showToast("Certificate PDF generated & saved!")}
            className="bg-white hover:bg-slate-100 text-[#065A82] px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Download size={18} />
            Download PDF Certificate
          </button>
        </div>
      </div>

      {/* Official Verified Credential Certificate Preview */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-slate-100 space-y-8 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1C7293] to-sky-400 flex items-center justify-center text-white font-black text-xl">
              I
            </div>
            <div>
              <h3 className="font-black text-xl text-[#21295C] tracking-wider">INVICTUS</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Official Achievement Certificate</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p className="font-bold text-slate-700">Credential ID</p>
            <p className="font-mono text-sky-700 font-bold">{certificateId}</p>
          </div>
        </div>

        <div className="text-center space-y-4 py-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This Certifies That</p>
          <h2 className="text-3xl font-black text-[#21295C] font-sans underline decoration-[#1C7293]">
            {user?.name || 'Aarav Sharma'}
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Has successfully engineered and deployed a functional hackathon prototype addressing the real-world problem statement:
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-xl mx-auto">
            <h4 className="font-bold text-base text-[#065A82]">{activeProblem.title}</h4>
            <p className="text-xs text-slate-500 mt-1">Issued in partnership with <span className="font-semibold text-slate-700">{activeProblem.organization}</span></p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
          <div className="text-left space-y-1">
            <p className="font-serif italic text-lg text-slate-700">{activeProblem.assignedMentor.name}</p>
            <p className="font-bold text-slate-800">{activeProblem.assignedMentor.title}</p>
            <p className="text-slate-400">{activeProblem.assignedMentor.organization}</p>
          </div>

          <div className="text-right space-y-1">
            <p className="font-serif italic text-lg text-slate-700">Invictus Evaluation Board</p>
            <p className="font-bold text-slate-800">Director of Academic Partnerships</p>
            <p className="text-slate-400">Invictus Global Council</p>
          </div>
        </div>
      </div>

      {/* LinkedIn Share Modal */}
      {isLinkedInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#0077B5] font-bold text-lg">
                <Linkedin size={22} />
                <span>Share Achiever Badge on LinkedIn</span>
              </div>
              <button
                onClick={() => setIsLinkedInModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Generated LinkedIn Announcement Text
              </label>
              <textarea
                readOnly
                rows={7}
                value={linkedInPostText}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyLinkedIn}
                className="bg-[#0077B5] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 hover:bg-[#005E93] transition-colors"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <span>Open LinkedIn Share Window</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
