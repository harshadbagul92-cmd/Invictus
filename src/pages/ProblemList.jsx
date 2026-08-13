import React, { useState } from 'react';
import { PROBLEM_STATEMENTS } from '../data/mockData';
import { Search, Filter, Building2, Sparkles, Clock, Users, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const ProblemList = ({ onSelectProblem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(PROBLEM_STATEMENTS.map(p => p.category))];

  const filteredProblems = PROBLEM_STATEMENTS.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          problem.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          problem.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'All' || problem.orgType === selectedType;
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#21295C] via-[#065A82] to-[#1C7293] rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-200 border border-white/15">
            <Sparkles size={14} className="text-amber-300" />
            Verified Industry & Government Innovation Challenges
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Solve High-Impact <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-100 to-white">
              Real-World Problem Statements
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Collaborate in teams, build deployable software prototypes with guidance from assigned AI assistants and veteran corporate mentors, and claim internship reviews.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-sky-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={18} />
              <span>5 Active Challenges</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-sky-300" size={18} />
              <span>1-on-1 Mentor Allocation</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-300" size={18} />
              <span>Direct Internship Fast-Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, organization, or technology tag (e.g. Edge AI, IoT, Python)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7293] transition-all"
            />
          </div>

          {/* Org Type Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
            >
              <option value="All">All Entities (Govt & Corporate)</option>
              <option value="Government">Government Ministries</option>
              <option value="Corporate">Corporate / Private Tech</option>
              <option value="Non-Profit / NGO">Non-Profit & NGOs</option>
            </select>
          </div>

          {/* Domain Category Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1C7293]"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat === 'All' ? 'All Domains' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => onSelectProblem(problem.id)}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-2xl border border-slate-100 hover:border-[#1C7293]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="space-y-4">
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  problem.orgType === 'Government'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : problem.orgType === 'Corporate'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {problem.orgType}
                </span>

                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock size={13} />
                  {problem.deadline}
                </span>
              </div>

              {/* Title & Organization */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C7293] mb-1">
                  <Building2 size={14} />
                  <span>{problem.organization}</span>
                </div>
                <h3 className="text-lg font-bold text-[#21295C] group-hover:text-[#065A82] transition-colors leading-snug line-clamp-2">
                  {problem.title}
                </h3>
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {problem.shortDescription}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {problem.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                  >
                    <Tag size={10} className="text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Stipend / Incentive</p>
                <p className="text-xs font-bold text-emerald-600">{problem.stipend}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProblem(problem.id);
                }}
                className="bg-[#065A82] hover:bg-[#1C7293] text-white p-2.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-md"
              >
                <span>View Details</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium text-sm">No problem statements match your search criteria.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedCategory('All'); }}
            className="mt-3 text-xs font-bold text-[#1C7293] underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
