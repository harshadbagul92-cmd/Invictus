import React, { useState } from 'react';
import { INITIAL_ROADMAP_STEPS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Video, Phone, MessageSquare, CheckCircle2, Circle, 
  Sparkles, ShieldCheck, User, X, Mic, MicOff, VideoOff, Send, Clock 
} from 'lucide-react';

export const MentorStudentDetail = ({ studentId, onBack }) => {
  const { registeredStudents, showToast } = useAuth();
  
  const student = registeredStudents?.find(s => s.id === studentId) || {
    id: studentId || "std-001",
    name: "Enrolled Student",
    problemTitle: "Smart Water Grid Leakage Detection",
    college: "Engineering Institute",
    teamName: "Innovation Team",
    progressPercent: 0,
    status: "Enrolled",
    recentNote: "Registered & ready to start Phase 1.",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Student`
  };

  const [activeCallModal, setActiveCallModal] = useState(null); // 'video' | 'voice' | 'chat' | null
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTimer, setCallTimer] = useState("01:24");
  const [feedbackNote, setFeedbackNote] = useState('');

  // Live Chat inside Modal State
  const [messages, setMessages] = useState([
    { sender: 'student', text: `Hi! We completed phase 1 for ${student.problemTitle}. Can you review our architecture diagram?`, time: '10:14 AM' },
    { sender: 'mentor', text: 'Sure thing! The diagram looks clean. Ensure you handle edge sensor nulls in phase 2.', time: '10:16 AM' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSendLiveMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'mentor', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMsg('');
  };

  const handleSaveFeedback = () => {
    if (!feedbackNote.trim()) return;
    showToast(`Feedback note logged for ${student.name}`);
    setFeedbackNote('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-[#065A82] hover:text-[#21295C]"
        >
          <ArrowLeft size={18} />
          Back to Mentor Roster
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Student ID: <span className="font-mono text-slate-700">{student.id}</span>
        </span>
      </div>

      {/* Student Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#1C7293]/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#21295C]">{student.name}</h1>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                {student.status || 'Enrolled'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C7293] mt-0.5">{student.problemTitle}</p>
            <p className="text-xs text-slate-400">{student.college} • {student.teamName}</p>
          </div>
        </div>

        {/* Action Call Triggers */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveCallModal('video')}
            className="flex-1 md:flex-none bg-[#065A82] hover:bg-[#1C7293] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Video size={16} />
            <span>Video Call</span>
          </button>

          <button
            onClick={() => setActiveCallModal('voice')}
            className="flex-1 md:flex-none bg-[#21295C] hover:bg-[#065A82] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Phone size={16} />
            <span>Voice Call</span>
          </button>

          <button
            onClick={() => setActiveCallModal('chat')}
            className="flex-1 md:flex-none bg-white hover:bg-slate-50 text-[#065A82] border border-[#065A82]/30 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Live Chat</span>
          </button>
        </div>
      </div>

      {/* Grid: Student Roadmap Progress & Feedback Note */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Roadmap Deliverable Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#21295C]">Roadmap Progress Breakdown</h3>
                <p className="text-xs text-slate-500">Mentee task completion history</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#1C7293]">{student.progressPercent || 0}%</span>
                <span className="text-xs text-slate-400 block font-semibold">Completed</span>
              </div>
            </div>

            <div className="space-y-4">
              {INITIAL_ROADMAP_STEPS.map((step, idx) => (
                <div key={step.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#21295C] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#065A82] text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {step.title}
                    </h4>
                  </div>
                  <div className="space-y-1.5 pl-7">
                    {step.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between text-xs text-slate-700">
                        <span className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Circle size={14} className="text-slate-300 shrink-0" />
                          )}
                          <span className={task.completed ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                            {task.title}
                          </span>
                        </span>
                        <span className={`text-[10px] font-bold ${task.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {task.completed ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Mentor Review Note & Quick Approval */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-[#21295C] flex items-center gap-2">
              <Sparkles size={16} className="text-[#1C7293]" />
              Mentor Feedback & Review Log
            </h3>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold text-[#065A82] mb-1">Recent Student Note:</p>
              <p className="italic">{student.recentNote || 'Awaiting mentor review.'}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Add Guidance Note for Mentee
              </label>
              <textarea
                rows={4}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Type instructions or code review notes for student..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
              />
            </div>

            <button
              onClick={handleSaveFeedback}
              className="w-full bg-[#065A82] hover:bg-[#1C7293] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Post Feedback to Student Dashboard
            </button>
          </div>

          {/* Sign-off Trigger */}
          <div className="bg-gradient-to-br from-[#21295C] to-[#065A82] text-white rounded-3xl p-6 shadow-xl space-y-3">
            <h4 className="font-extrabold text-sm flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              Corporate Sign-off Status
            </h4>
            <p className="text-xs text-sky-100 leading-relaxed">
              Once you approve the final prototype, the student receives their verified Invictus certificate and internship fast-track badge.
            </p>
            <button
              onClick={() => showToast(`Signed off on ${student.name}'s final submission!`)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
            >
              Approve Prototype & Issue Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Call / Chat Modal */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#065A82] text-white flex items-center justify-center font-bold">
                  {activeCallModal === 'video' ? <Video size={20} /> : activeCallModal === 'voice' ? <Phone size={20} /> : <MessageSquare size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#21295C] capitalize">
                    {activeCallModal} Call — {student.name}
                  </h3>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Connected • {callTimer}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCallModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video / Voice Screen Representation */}
            {activeCallModal === 'video' && (
              <div className="bg-slate-900 rounded-2xl h-64 relative overflow-hidden flex items-center justify-center">
                {!isVideoOff ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="text-center text-slate-400 space-y-2">
                    <VideoOff size={40} className="mx-auto" />
                    <p className="text-xs">Camera Turned Off</p>
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  HD Live Stream
                </div>
              </div>
            )}

            {activeCallModal === 'voice' && (
              <div className="bg-gradient-to-br from-[#21295C] to-[#065A82] rounded-2xl p-12 text-center text-white space-y-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-white/30"
                />
                <div>
                  <h4 className="font-bold text-lg">{student.name}</h4>
                  <p className="text-xs text-sky-200">Encrypted Voice Channel</p>
                </div>
              </div>
            )}

            {/* Chat View inside Modal */}
            <div className="space-y-3">
              <div className="h-40 overflow-y-auto custom-scrollbar p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'mentor' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2.5 rounded-xl max-w-[80%] ${
                      m.sender === 'mentor' ? 'bg-[#065A82] text-white' : 'bg-white text-slate-800 border border-slate-200'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 px-1 mt-0.5">{m.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLiveMessage()}
                  placeholder="Type message to mentee..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
                />
                <button
                  onClick={handleSendLiveMessage}
                  className="bg-[#065A82] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Call Control Buttons Bar */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {activeCallModal === 'video' && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOff ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              )}

              <button
                onClick={() => {
                  showToast("Call ended");
                  setActiveCallModal(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
