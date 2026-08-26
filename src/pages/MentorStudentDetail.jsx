import React, { useState, useEffect } from 'react';
import { INITIAL_ROADMAP_STEPS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { 
  ArrowLeft, Video, Phone, MessageSquare, CheckCircle2, Circle, 
  Sparkles, ShieldCheck, User, X, Mic, MicOff, VideoOff, Send, Clock, ExternalLink 
} from 'lucide-react';

export const MentorStudentDetail = ({ studentId, onBack }) => {
  const { showToast } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeCallModal, setActiveCallModal] = useState(null); // 'video' | 'voice' | 'chat' | null
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTimer] = useState("01:24");
  
  const [feedbackNote, setFeedbackNote] = useState('');
  const [gradeScore, setGradeScore] = useState(85);
  const [roadmapSteps, setRoadmapSteps] = useState(INITIAL_ROADMAP_STEPS);

  // Load student detail & roadmap progress from backend SQLite DB
  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      const targetUid = studentId || "std-001";
      
      const [students, progressData] = await Promise.all([
        api.getMentorStudents(),
        api.getUserRoadmap(targetUid)
      ]);

      if (students && Array.isArray(students)) {
        const found = students.find(s => s.id === studentId || s.id === `usr-${studentId}`);
        if (found) {
          setStudent(found);
          if (found.feedback) setFeedbackNote(found.feedback);
          if (found.score) setGradeScore(found.score);
        }
      }

      if (progressData?.completedTaskIds) {
        const completedSet = new Set(progressData.completedTaskIds);
        setRoadmapSteps(prevSteps =>
          prevSteps.map(step => ({
            ...step,
            tasks: step.tasks.map(t => ({
              ...t,
              completed: completedSet.has(t.id)
            }))
          }))
        );
      }

      setLoading(false);
    }
    loadStudentData();
  }, [studentId]);

  // Live Chat inside Modal State
  const [messages, setMessages] = useState([
    { sender: 'student', text: `Hi! We are working on our prototype. Can you review our database architecture?`, time: '10:14 AM' },
    { sender: 'mentor', text: 'Sure thing! The SQLite setup looks clean and fast.', time: '10:16 AM' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSendLiveMessage = async () => {
    if (!newMsg.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const mentorMsgObj = {
      sender_uid: 'men-001',
      sender_name: 'Mentor',
      sender_role: 'mentor',
      receiver_uid: studentId || 'std-001',
      receiver_name: student?.name || 'Student',
      text: newMsg.trim(),
      created_at: timeStr
    };

    setMessages(prev => [
      ...prev,
      { sender: 'mentor', text: newMsg.trim(), time: timeStr }
    ]);
    setNewMsg('');

    try {
      await api.sendMessage(mentorMsgObj);
    } catch (e) {}

    showToast(`Message sent to ${student?.name || 'Student'}!`);
  };

  const handleMentorToggleTask = async (taskId, currentCompleted) => {
    const nextCompleted = !currentCompleted;
    setRoadmapSteps(prev =>
      prev.map(step => ({
        ...step,
        tasks: step.tasks.map(t => t.id === taskId ? { ...t, completed: nextCompleted } : t)
      }))
    );

    const targetUid = student?.id || studentId;
    await api.toggleTask({
      userId: targetUid,
      problemId: student?.enrolledProblemId || 'ps-101',
      taskId,
      completed: nextCompleted
    });

    showToast(nextCompleted ? `✅ Task marked as completed by Mentor!` : `Marked task as pending`);
  };

  const handleMentorTogglePhase = async (step) => {
    const isPhaseFullyDone = step.tasks.every(t => t.completed);
    const nextState = !isPhaseFullyDone;

    setRoadmapSteps(prev =>
      prev.map(s => s.id === step.id ? {
        ...s,
        tasks: s.tasks.map(t => ({ ...t, completed: nextState }))
      } : s)
    );

    const targetUid = student?.id || studentId;
    for (const task of step.tasks) {
      await api.toggleTask({
        userId: targetUid,
        problemId: student?.enrolledProblemId || 'ps-101',
        taskId: task.id,
        completed: nextState
      });
    }

    showToast(nextState ? `🎉 Phase "${step.title}" verified by Mentor!` : `Phase marked as pending`);
  };

  const handleSaveReview = async (newStatus = 'Reviewed') => {
    if (!student) return;
    const res = await api.submitMentorReview({
      userId: student.id,
      problemId: student.enrolledProblemId || 'ps-101',
      score: Number(gradeScore),
      feedback: feedbackNote || 'Great progress on deliverables!',
      status: newStatus
    });

    if (res?.message) {
      showToast(`Review saved in database for ${student.name}`);
      setStudent(prev => prev ? { ...prev, submissionStatus: newStatus, score: Number(gradeScore), feedback: feedbackNote } : null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
        Loading student profile from SQLite database...
      </div>
    );
  }

  const currentStudent = student || {
    id: studentId || "std-001",
    name: "Enrolled Student",
    enrolledProblemTitle: "Smart Water Grid Leakage Detection",
    college: "Engineering Institute",
    teamName: "Innovation Team",
    progress: 0,
    submissionStatus: "Enrolled",
    githubUrl: "",
    demoUrl: "",
    pitchNotes: "Awaiting submission",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Student`
  };

  const totalTasksCount = roadmapSteps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasksCount = roadmapSteps.reduce((acc, step) => acc + step.tasks.filter(t => t.completed).length, 0);
  const liveProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : (currentStudent.progress || 0);

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
          Student ID: <span className="font-mono text-slate-700">{currentStudent.id}</span>
        </span>
      </div>

      {/* Student Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#1C7293]/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#21295C]">{currentStudent.name}</h1>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                {currentStudent.submissionStatus || 'Enrolled'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C7293] mt-0.5">{currentStudent.enrolledProblemTitle}</p>
            <p className="text-xs text-slate-400">{currentStudent.college} • {currentStudent.email}</p>
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
                <h3 className="text-lg font-bold text-[#21295C] flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#1C7293]" />
                  Roadmap Progress & Mentor Sign-Off
                </h3>
                <p className="text-xs text-slate-500">Click deliverables to check/tick completed tasks for this mentee</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#1C7293]">{liveProgressPercent}%</span>
                <span className="text-xs text-slate-400 block font-semibold">{completedTasksCount} of {totalTasksCount} Verified</span>
              </div>
            </div>

            <div className="space-y-4">
              {roadmapSteps.map((step, idx) => {
                const isStepFinished = step.tasks.every(t => t.completed);
                return (
                  <div key={step.id} className={`p-4 rounded-2xl border transition-all ${
                    isStepFinished ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xs text-[#21295C] flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isStepFinished ? 'bg-emerald-500 text-white' : 'bg-[#065A82] text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        {step.title}
                      </h4>
                      
                      <button
                        onClick={() => handleMentorTogglePhase(step)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                          isStepFinished 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' 
                            : 'bg-white text-[#065A82] border-[#065A82]/30 hover:bg-slate-100'
                        }`}
                      >
                        {isStepFinished ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            Phase Verified
                          </>
                        ) : (
                          <>
                            <Circle size={13} className="text-[#065A82]" />
                            Mark Phase Completed
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 pl-7">
                      {step.tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleMentorToggleTask(task.id, task.completed)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                            task.completed
                              ? 'bg-white border-emerald-200 text-slate-800 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-[#1C7293]/40 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              readOnly
                              className="hidden"
                            />
                            {task.completed ? (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Circle size={16} className="text-slate-300 shrink-0 hover:text-[#1C7293]" />
                            )}
                            <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {task.title}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.completed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {task.completed ? 'Approved' : 'Click to Verify'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Mentor Review Note & Quick Approval */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-[#21295C] flex items-center gap-2">
              <Sparkles size={16} className="text-[#1C7293]" />
              Mentor Feedback & Score Log
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Score / Evaluation Rating (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeScore}
                onChange={(e) => setGradeScore(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Guidance Note for Mentee
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
              onClick={() => handleSaveReview('Reviewed')}
              className="w-full bg-[#065A82] hover:bg-[#1C7293] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Post Feedback to SQLite Database
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
              onClick={() => handleSaveReview('Approved')}
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
                    {activeCallModal} Call — {currentStudent.name}
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
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
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
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-white/30"
                />
                <div>
                  <h4 className="font-bold text-lg">{currentStudent.name}</h4>
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
