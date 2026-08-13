import React, { useState } from 'react';
import { PROBLEM_STATEMENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Building2, Calendar, Award, Users, User, ShieldCheck, 
  CheckCircle2, Sparkles, Plus, X, MessageSquare 
} from 'lucide-react';

export const ProblemDetail = ({ problemId, onBack, onNavigateDashboard }) => {
  const { joinProblemStatement, joinedProblemId, user } = useAuth();
  const problem = PROBLEM_STATEMENTS.find(p => p.id === problemId) || PROBLEM_STATEMENTS[0];

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinMode, setJoinMode] = useState('Team'); // 'Team' or 'Solo'
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [teamList, setTeamList] = useState([
    user ? `${user.name} (Lead)` : 'Aarav Sharma (Lead)',
    'Priya Desai',
    'Rohan Mehta'
  ]);

  const isEnrolledInThis = joinedProblemId === problem.id;

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;
    setTeamList([...teamList, newMemberEmail.trim()]);
    setNewMemberEmail('');
  };

  const handleRemoveMember = (index) => {
    setTeamList(teamList.filter((_, i) => i !== index));
  };

  const handleConfirmEnrollment = () => {
    joinProblemStatement(problem.id, joinMode, joinMode === 'Solo' ? [user?.name || 'Solo Student'] : teamList);
    setIsJoinModalOpen(false);
    onNavigateDashboard();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-[#065A82] hover:text-[#21295C] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Problem Statements
        </button>

        {isEnrolledInThis && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs border border-emerald-500/20">
            <CheckCircle2 size={14} /> Currently Enrolled Challenge
          </span>
        )}
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              problem.orgType === 'Government'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {problem.orgType}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Category: {problem.category}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Calendar size={14} />
            Deadline: {problem.deadline}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C7293] mb-2">
            <Building2 size={16} />
            <span>{problem.organization}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#21295C] leading-tight">
            {problem.title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => { setJoinMode('Team'); setIsJoinModalOpen(true); }}
            className="bg-[#065A82] hover:bg-[#1C7293] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#065A82]/20 hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Users size={18} />
            Join as Team
          </button>

          <button
            onClick={() => { setJoinMode('Solo'); setIsJoinModalOpen(true); }}
            className="bg-white hover:bg-slate-50 text-[#065A82] border-2 border-[#065A82] px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <User size={18} />
            Join Solo
          </button>

          {isEnrolledInThis && (
            <button
              onClick={onNavigateDashboard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ml-auto"
            >
              <span>Go to My Project Dashboard</span>
              <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Problem Description & Assigned Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Full Description & Deliverables */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-[#21295C] flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#1C7293]" />
              Problem Background & Objective
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {problem.fullDescription}
            </p>

            <h4 className="text-sm font-bold text-[#21295C] pt-4 border-t border-slate-100">
              Key Technology Stack Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-sky-50 text-[#065A82] border border-sky-200 text-xs px-3 py-1 rounded-lg font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-[#21295C] flex items-center gap-2">
              <Sparkles size={20} className="text-[#1C7293]" />
              Expected Prototype Deliverables
            </h3>
            <ul className="space-y-3">
              {problem.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Mentor & Stipend Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stipend Card */}
          <div className="bg-gradient-to-br from-[#21295C] to-[#065A82] text-white rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award size={16} />
              Award & Support
            </div>
            <p className="text-2xl font-extrabold text-white">{problem.stipend}</p>
            <p className="text-xs text-sky-200 leading-relaxed">
              Top prototypes receive fast-track review from {problem.organization} HR and direct entry into corporate internship interviews.
            </p>
          </div>

          {/* Assigned Human Mentor Card */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Industry Mentor
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={problem.assignedMentor.avatar}
                alt={problem.assignedMentor.name}
                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-sky-100"
              />
              <div>
                <h4 className="font-bold text-base text-[#21295C]">{problem.assignedMentor.name}</h4>
                <p className="text-xs font-semibold text-[#1C7293]">{problem.assignedMentor.title}</p>
                <p className="text-[11px] text-slate-400">{problem.assignedMentor.organization}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                <MessageSquare size={16} className="text-[#065A82]" />
                <span>Provides weekly 1-on-1 code reviews & guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Team Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold text-[#21295C]">
                Confirm Enrollment ({joinMode} Mode)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You are joining <span className="font-semibold text-[#065A82]">"{problem.title}"</span>
              </p>
            </div>

            {joinMode === 'Team' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Team Members Roster ({teamList.length})
                </label>
                
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {teamList.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#1C7293]" />
                        <span>{member}</span>
                      </div>
                      {idx > 0 && (
                        <button onClick={() => handleRemoveMember(idx)} className="text-red-500 hover:text-red-700">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter teammate email/name..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="bg-[#1C7293] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-sky-50 p-4 rounded-xl text-xs text-slate-700 border border-sky-200">
                You are enrolling solo. You can recruit teammates or connect with other solo applicants in your dashboard later!
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEnrollment}
                className="bg-[#065A82] hover:bg-[#1C7293] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                Confirm & Launch Project Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
