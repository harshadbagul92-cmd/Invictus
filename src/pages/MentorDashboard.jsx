import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { 
  Users, CheckCircle2, Clock, BarChart3, ArrowUpRight, 
  Video, MessageSquare, PhoneCall, Sparkles, ChevronRight, UserCheck 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';

export const MentorDashboard = ({ onSelectStudent }) => {
  const { user } = useAuth();
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      const data = await api.getMentorStudents();
      if (data && Array.isArray(data)) {
        setStudentsList(data);
      }
      setLoading(false);
    }
    loadStudents();
  }, []);

  const chartData = studentsList.map(student => ({
    name: student.name ? student.name.split(' ')[0] : 'Student',
    progress: student.progress || 0,
    submissionStatus: student.submissionStatus || 'Pending'
  }));

  const completedCount = studentsList.filter(s => s.progress === 100 || s.submissionStatus === 'Approved').length;
  const onTrackCount = studentsList.filter(s => s.progress > 0 && s.progress < 100).length;
  const newCount = studentsList.filter(s => s.progress === 0).length;

  const pieData = [
    { name: 'Completed / Approved', value: completedCount || 0, color: '#10B981' },
    { name: 'In Progress', value: onTrackCount || 0, color: '#1C7293' },
    { name: 'New Enrollments', value: newCount || 0, color: '#F59E0B' }
  ];

  const avgProgress = studentsList.length > 0 
    ? Math.round(studentsList.reduce((acc, s) => acc + (s.progress || 0), 0) / studentsList.length) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#21295C] via-[#065A82] to-[#1C7293] rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Mentor"}
            alt="Mentor Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {user?.name || 'Mentor'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SQLite Backend Synced
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-1">
              {user?.college || 'Tech Industry Partner'} • Live Student Cohort Review Center
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
            <Users size={18} className="text-[#1C7293]" />
          </div>
          <p className="text-3xl font-black text-[#21295C]">{studentsList.length} Registered</p>
          <p className="text-[11px] text-slate-500 font-medium">Real-time database records</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cohort Avg Progress</span>
            <BarChart3 size={18} className="text-[#065A82]" />
          </div>
          <p className="text-3xl font-black text-[#21295C]">{avgProgress}%</p>
          <p className="text-[11px] text-slate-500 font-medium">Calculated across deliverables</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Completed</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{completedCount} Verified</p>
          <p className="text-[11px] text-slate-500 font-medium">Eligible for internship fast-track</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Roadmaps</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">{onTrackCount} In Progress</p>
          <p className="text-[11px] text-slate-500 font-medium">Actively working on tasks</p>
        </div>
      </div>

      {/* Visual Analytics Graphs (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#21295C] text-base flex items-center gap-2">
              <BarChart3 size={18} className="text-[#1C7293]" />
              Student Progress Completion (%)
            </h3>
            <span className="text-xs text-slate-400">Live Database Analytics</span>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#21295C', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(28, 114, 147, 0.1)' }}
                  />
                  <Bar dataKey="progress" fill="#1C7293" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10B981' : '#1C7293'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              <UserCheck size={32} className="mb-2 text-slate-300" />
              <span>{loading ? 'Loading database records...' : 'No student progress data recorded yet.'}</span>
            </div>
          )}
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
          <h3 className="font-bold text-[#21295C] text-base flex items-center gap-2">
            <Sparkles size={18} className="text-[#065A82]" />
            Cohort Status Breakdown
          </h3>

          <div className="h-48 w-full flex items-center justify-center">
            {studentsList.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-400">No active cohorts</div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-800 font-bold">{item.value} Student(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assigned Student Roster Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#21295C]">Registered Students Roster</h3>
            <p className="text-xs text-slate-500">Live SQLite Database records of students working on problem statements</p>
          </div>
        </div>

        {studentsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {studentsList.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="p-5 rounded-2xl border border-slate-200/80 hover:border-[#1C7293] hover:shadow-lg transition-all duration-200 bg-slate-50/50 hover:bg-white cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#1C7293]/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#21295C] text-base group-hover:text-[#065A82] transition-colors">
                        {student.name}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        student.submissionStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {student.submissionStatus || 'Enrolled'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1C7293] mt-0.5">{student.enrolledProblemTitle}</p>
                    <p className="text-[11px] text-slate-400">{student.college} • {student.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Progress</span>
                      <span>{student.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          student.progress === 100 ? 'bg-emerald-500' : 'bg-[#1C7293]'
                        }`}
                        style={{ width: `${student.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student.id);
                      }}
                      className="bg-[#065A82] hover:bg-[#1C7293] text-white p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Inspect & Review</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <Users size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-600 font-bold text-sm">No Student Registrations Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              When students register and enroll in problem statements, their profiles and live roadmap progress will appear here automatically from the SQLite database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
