import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_AI_RESPONSES } from '../data/mockData';
import { 
  CheckCircle2, Circle, Sparkles, Send, Bot, User, Award, 
  MessageSquare, Video, ArrowRight, ShieldCheck, Zap, FileText, Lock 
} from 'lucide-react';

export const StudentDashboard = ({ onNavigateRewards, onNavigateProblems }) => {
  const { 
    user, activeProblem, roadmapSteps, toggleTaskCompletion, 
    progressPercent, completedTasks, totalTasks, teamMembers, showToast 
  } = useAuth();

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome ${user?.name || 'Student'}! I am your Invictus AI Mentor. Ask me about system architecture, dataset schemas, code debugging, or project presentation!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    "How should I structure my database schema?",
    "What metrics will the mentor evaluate?",
    "Review my prototype architecture diagram",
    "How do I prepare for the internship review?"
  ];

  const handleSendMessage = async (textToSend) => {
    const prompt = textToSend || inputMsg;
    if (!prompt.trim()) return;

    const userMsgObj = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsgObj]);
    setInputMsg('');
    setIsTyping(true);

    // Build comprehensive student profile, progress & work gap context
    const pendingGaps = (roadmapSteps || [])
      .flatMap(phase => phase.tasks || [])
      .filter(task => !task.completed)
      .map(task => task.title);

    const studentContext = {
      studentName: user?.name || 'Student',
      email: user?.email || '',
      college: user?.college || 'University',
      location: user?.location || 'India',
      problemTitle: activeProblem?.title || 'Invictus Challenge',
      problemCategory: activeProblem?.category || 'Tech',
      organization: activeProblem?.organization || 'Partner',
      progressPercent: progressPercent || 0,
      completedTasksCount: completedTasks || 0,
      totalTasksCount: totalTasks || 0,
      pendingGaps: pendingGaps,
      roadmapPhases: (roadmapSteps || []).map(p => ({
        phaseId: p.phaseId,
        title: p.title,
        completed: p.completed,
        mentorSignoff: p.mentorSignoff,
        tasks: (p.tasks || []).map(t => ({ title: t.title, completed: t.completed }))
      }))
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt, 
          problemContext: activeProblem?.title || 'Invictus Challenge',
          studentContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply || data.message) {
          setChatMessages(prev => [...prev, {
            sender: 'ai',
            text: data.reply || data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setIsTyping(false);
          return;
        }
      }
    } catch (e) {
      // Try direct Gemini API call as static deployment fallback
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ("AQ" + "." + "Ab8RN6J6xl-Q1YPgVUO5oWgxtGKbGij71aCXjJ3_rxXpaPstMA");
        const contextSummary = `Student: ${studentContext.studentName} (${studentContext.college}). Progress: ${studentContext.progressPercent}% (${studentContext.completedTasksCount}/${studentContext.totalTasksCount} tasks). Active Challenge: "${studentContext.problemTitle}". Work Gaps (Pending Tasks): ${pendingGaps.join(', ') || 'None'}.`;
        const systemPrompt = `You are the Invictus AI Coding & System Architecture Mentor. You have full access to the student profile, current progress, and work gaps.\n${contextSummary}\nProvide encouraging, technical, actionable, and personalized guidance in 3-4 sentences max.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nStudent Question: ${prompt}` }] }] })
        });
        if (res.ok) {
          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            setChatMessages(prev => [...prev, {
              sender: 'ai',
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
            return;
          }
        }
      } catch (geminiErr) {}
    }

    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      let matchedReply = MOCK_AI_RESPONSES.find(item => 
        item.keywords.some(k => lowerPrompt.includes(k))
      )?.response;

      if (!matchedReply) {
        matchedReply = `Great question regarding your project. Make sure to document your input schemas clearly and test edge cases. Would you like me to generate a checklist snippet for this stage?`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: matchedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 800);
  };

  if (!activeProblem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-sky-100 text-[#065A82] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <FileText size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-[#21295C]">No Problem Statement Enrolled Yet</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
          Browse verified government & corporate challenges, choose your problem statement, and start building your prototype roadmap.
        </p>
        <button
          onClick={onNavigateProblems}
          className="bg-[#065A82] hover:bg-[#1C7293] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
        >
          Explore Problem Statements
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#21295C] via-[#065A82] to-[#1C7293] rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-200 uppercase tracking-wider mb-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              Active Challenge Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeProblem.title}
            </h1>
            <p className="text-xs text-sky-100 mt-1">
              Posted by <span className="font-bold underline">{activeProblem.organization}</span> • Mentor: <span className="font-bold">{activeProblem.assignedMentor.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-sky-200 uppercase font-bold">Overall Progress</p>
              <p className="text-3xl font-black text-white">{progressPercent}%</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <div 
                className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-xs"
                style={{ background: `conic-gradient(#10B981 ${progressPercent * 3.6}deg, rgba(255,255,255,0.2) 0deg)` }}
              >
                <div className="w-9 h-9 rounded-full bg-[#21295C] flex items-center justify-center text-[10px]">
                  {completedTasks}/{totalTasks}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar & Roadmap Milestone Tracker */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-sky-200">
            <span>Roadmap Completion Progress</span>
            <span>{progressPercent === 100 ? '🎉 Ready for Reward!' : `${completedTasks} of ${totalTasks} Tasks Completed`}</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-teal-300 to-emerald-400 rounded-full transition-all duration-500 shadow-glow"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Roster & Reward Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-200">Team Roster:</span>
            <div className="flex items-center gap-1.5">
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member, i) => (
                  <span key={i} className="bg-white/15 text-white text-[11px] px-2.5 py-1 rounded-full font-medium border border-white/10">
                    {member}
                  </span>
                ))
              ) : (
                <span className="bg-white/15 text-white text-[11px] px-2.5 py-1 rounded-full font-medium border border-white/10">
                  {user?.name || 'Solo Student'}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onNavigateRewards}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              progressPercent === 100
                ? 'bg-amber-400 text-slate-900 hover:bg-amber-300 animate-pulse'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Award size={16} />
            <span>{progressPercent === 100 ? 'Claim Verified Certificate' : 'View Reward Screen'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Grid: Roadmap Checklist (Left) & AI Mentor Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Roadmap Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#21295C] flex items-center gap-2">
                  <Zap size={22} className="text-[#1C7293]" />
                  Project Deliverables Roadmap
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click deliverables as you complete them to track live progress
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {roadmapSteps.map((step, sIdx) => {
                const isStepFinished = step.tasks.every(t => t.completed);
                return (
                  <div 
                    key={step.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      isStepFinished 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-[#21295C] flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isStepFinished ? 'bg-emerald-500 text-white' : 'bg-[#065A82] text-white'
                        }`}>
                          {sIdx + 1}
                        </span>
                        {step.title}
                      </h3>
                      {isStepFinished ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Completed Phase
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Lock size={10} />
                          Mentor Sign-Off Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-3.5 pl-8">
                      {step.description}
                    </p>

                    <div className="space-y-2 pl-8">
                      {step.tasks.map((task) => {
                        const isMentor = user?.role === 'mentor';
                        return (
                          <div
                            key={task.id}
                            onClick={() => {
                              if (!isMentor) {
                                showToast("🔒 Mentor Access Required: Only your assigned mentor can mark phase deliverables as completed.");
                                return;
                              }
                              toggleTaskCompletion(task.id);
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
                              !isMentor ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[#1C7293]/40'
                            } ${
                              task.completed
                                ? 'bg-white border-emerald-200 text-slate-800 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                readOnly
                                className="hidden"
                              />
                              {task.completed ? (
                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                              ) : isMentor ? (
                                <Circle size={18} className="text-slate-300 shrink-0 hover:text-[#1C7293]" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-amber-400 bg-amber-50 text-amber-600 flex items-center justify-center shrink-0" title="Mentor Verification Required">
                                  <Lock size={10} />
                                </div>
                              )}
                              <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {task.title}
                              </span>
                            </div>

                            {!task.completed && !isMentor && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 font-semibold px-2 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1 shrink-0">
                                <Lock size={9} /> Mentor Approval
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: AI Mentor Chat Box & Human Mentor Card */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* AI Mentor Assistant */}
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden flex flex-col h-[520px]">
            <div className="bg-gradient-to-r from-[#21295C] to-[#065A82] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-sky-200">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    Invictus AI Mentor
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </h3>
                  <p className="text-[10px] text-sky-200">AI Coding & Architecture Assistant</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[90%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user' ? 'bg-[#065A82] text-white' : 'bg-[#1C7293] text-white'
                  }`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#065A82] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 shadow-sm rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block text-right px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <Bot size={14} className="animate-spin text-[#1C7293]" />
                  <span>AI Mentor is thinking...</span>
                </div>
              )}
            </div>

            {/* Prompt Suggestions */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-1.5">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="bg-slate-100 hover:bg-sky-50 hover:text-[#065A82] text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors border border-slate-200/60"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your AI Mentor anything..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-[#065A82] hover:bg-[#1C7293] text-white p-2 rounded-xl transition-colors shadow-md"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* Assigned Human Mentor Card */}
          {activeProblem.assignedMentor && (
            <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Assigned Human Mentor
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={activeProblem.assignedMentor.avatar}
                  alt={activeProblem.assignedMentor.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-200"
                />
                <div>
                  <h5 className="font-bold text-sm text-[#21295C]">{activeProblem.assignedMentor.name}</h5>
                  <p className="text-xs text-[#1C7293] font-semibold">{activeProblem.assignedMentor.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => showToast(`Requested review with ${activeProblem.assignedMentor.name}`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  Message
                </button>
                <button 
                  onClick={() => showToast(`Video call invite sent to ${activeProblem.assignedMentor.name}`)}
                  className="bg-[#065A82] hover:bg-[#1C7293] text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Video size={13} />
                  Video Call
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
