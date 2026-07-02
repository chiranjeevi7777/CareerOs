import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Code2, Check, Brain, Sparkles, RefreshCw, ExternalLink, Lightbulb, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard, EmptyState } from '../../shared/ui';
import { apiClient } from '../../shared/api/apiClient';

const PLATFORMS = ['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks', 'Codeforces', 'InterviewBit', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TOPICS = [
  'Arrays', 'Strings', 'Hashing', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Heap', 'DP',
  'Greedy', 'Binary Search', 'Recursion', 'Math', 'Backtracking', 'Two Pointers', 'Sliding Window'
];

const DIFF_COLORS = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const emptyForm = {
  name: '',
  platform: 'LeetCode',
  difficulty: 'Medium',
  topic: 'Arrays',
  solvedDate: new Date().toISOString().split('T')[0],
  notes: '',
  url: '',
};

export default function DSAPage() {
  const { dsa, addDSA, deleteDSA } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [dsaPlan, setDsaPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const fetchDSAPlan = async () => {
    setLoadingPlan(true);
    try {
      const data = await apiClient.post('/api/dsa-recommendations', {
        solved_problems: dsa,
        target_role: 'Software Engineer',
      });
      setDsaPlan(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load DSA plan');
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    fetchDSAPlan();
  }, [dsa.length]);

  const stats = useMemo(() => ({
    total: dsa.length,
    easy: dsa.filter(d => d.difficulty === 'Easy').length,
    medium: dsa.filter(d => d.difficulty === 'Medium').length,
    hard: dsa.filter(d => d.difficulty === 'Hard').length,
  }), [dsa]);

  const dsaStreak = useMemo(() => {
    let streak = 0;
    const date = new Date();
    for (let i = 0; i < 365; i++) {
      const key = date.toISOString().split('T')[0];
      if (dsa.some(d => d.solvedDate === key)) {
        streak++;
      } else if (i > 0) break;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [dsa]);

  const filtered = useMemo(() =>
    dsa.filter(d => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.topic.toLowerCase().includes(q);
      const matchDiff = filterDiff === 'All' || d.difficulty === filterDiff;
      const matchTopic = filterTopic === 'All' || d.topic === filterTopic;
      return matchSearch && matchDiff && matchTopic;
    }),
    [dsa, search, filterDiff, filterTopic]
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Problem name required');
      return;
    }
    addDSA(form);
    toast.success('Problem logged!');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Total Solved" value={stats.total} color="#8b5cf6" />
        <KpiCard label="Easy" value={stats.easy} color="#10b981" />
        <KpiCard label="Medium" value={stats.medium} color="#f59e0b" />
        <KpiCard label="Hard" value={stats.hard} color="#ef4444" />
        <KpiCard label="Day Streak" value={`🔥 ${dsaStreak}`} color="#f97316" />
      </div>

      {/* AI Algorithmic Tutor Planner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{
          border: '1px solid rgba(139, 92, 246, 0.25)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: '#8b5cf6', filter: 'blur(30px)' }} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-1.5 text-base">
                AI Algorithmic Coach & Study Planner <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Targeting technical interviews & topic distribution optimization</p>
            </div>
          </div>
          <Button
            onClick={fetchDSAPlan}
            disabled={loadingPlan}
            variant="secondary"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingPlan ? 'animate-spin' : ''}`} />
            {loadingPlan ? 'Analyzing...' : 'Re-Evaluate'}
          </Button>
        </div>

        {loadingPlan && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Analyzing logged problem domains and building target-role recommendations...</p>
          </div>
        )}

        {!loadingPlan && !dsaPlan && (
          <div className="text-center py-6 text-slate-500 text-sm">
            No dynamic coding plan loaded. Click "Re-Evaluate" to analyze.
          </div>
        )}

        {!loadingPlan && dsaPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-green-400 tracking-wider uppercase bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md">Topic Strengths</span>
              <ul className="space-y-1.5 mt-2.5">
                {dsaPlan.strengths && dsaPlan.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Growth Areas (Gaps)</span>
                <ul className="space-y-1.5 mt-2.5">
                  {dsaPlan.weaknesses && dsaPlan.weaknesses.map((weak, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-x border-white/10 md:px-5 py-4 md:py-0">
              <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">Weekly Focus Strategy</span>
              <ol className="space-y-2 mt-2">
                {dsaPlan.weekly_plan && dsaPlan.weekly_plan.map((step, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-purple-300">{i+1}</span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">Recommended Problems</span>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 mt-2.5">
                {dsaPlan.suggested_problems && dsaPlan.suggested_problems.map((prob, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-100 truncate">{prob.name}</p>
                      <span className="text-[9px] text-slate-400 font-medium">{prob.topic} · {prob.difficulty}</span>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {prob.url && (
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center gap-0.5 no-underline"
                        >
                          Solve <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          addDSA({
                            name: prob.name,
                            platform: prob.platform || 'LeetCode',
                            difficulty: prob.difficulty || 'Medium',
                            topic: prob.topic || 'Arrays',
                            solvedDate: new Date().toISOString().split('T')[0],
                            notes: 'Solved via AI recommendation',
                            url: prob.url || '',
                          });
                          toast.success(`Logged: ${prob.name}`);
                        }}
                        className="text-[10px] font-bold bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded transition-colors border-0 cursor-pointer"
                      >
                        Log
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Distribution */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Topic Progress</h3>
          <div className="space-y-2.5">
            {TOPICS.slice(0, 11).map(topic => {
              const count = dsa.filter(d => d.topic === topic).length;
              const max = Math.max(...TOPICS.map(t => dsa.filter(d => d.topic === t).length), 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={topic} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{topic}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input-field pl-10" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="select-field text-sm" value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
              <option value="All">All Difficulty</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="select-field text-sm" value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
              <option value="All">All Topics</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Button onClick={openAddModal} variant="primary" className="whitespace-nowrap">
              <Plus className="w-4 h-4" /> Log Problem
            </Button>
          </div>

          {/* Problem Cards */}
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((prob, i) => (
                <motion.div
                  key={prob.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  className="glass-card p-4 flex items-center gap-4 group hover:shadow-lg transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{prob.name}</span>
                      <span className={`badge ${DIFF_COLORS[prob.difficulty] || 'bg-slate-100 text-slate-600'}`}>{prob.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap text-slate-500 dark:text-slate-400">
                      <span className="text-xs">{prob.platform}</span>
                      <span>·</span>
                      <span className="text-xs text-primary-500 font-medium">{prob.topic}</span>
                      <span>·</span>
                      <span className="text-xs">{prob.solvedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {prob.url && <a href={prob.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400 text-xs no-underline">View</a>}
                    <button onClick={() => { if (confirm('Delete?')) { deleteDSA(prob.id); toast.success('Deleted'); }}}
                      className="text-slate-400 hover:text-danger-500 transition-colors bg-transparent border-0 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-8">
                <EmptyState
                  icon={<Code2 className="w-12 h-12 text-slate-400" />}
                  title="No problems logged yet"
                  description="Start solving and tracking your DSA progress!"
                  action={
                    <Button onClick={openAddModal} variant="primary" className="text-sm">
                      <Plus className="w-4 h-4" /> Log Problem
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Log Problem"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="form-label">Problem Name *</label>
            <input
              className="input-field"
              value={form.name}
              onChange={e => setFormField('name', e.target.value)}
              placeholder="Two Sum, Merge Sort..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Platform</label>
              <select className="select-field" value={form.platform} onChange={e => setFormField('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Difficulty</label>
              <select className="select-field" value={form.difficulty} onChange={e => setFormField('difficulty', e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Topic</label>
              <select className="select-field" value={form.topic} onChange={e => setFormField('topic', e.target.value)}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Solved Date</label>
              <input
                type="date"
                className="input-field"
                value={form.solvedDate}
                onChange={e => setFormField('solvedDate', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Problem URL</label>
            <input
              className="input-field"
              value={form.url}
              onChange={e => setFormField('url', e.target.value)}
              placeholder="https://leetcode.com/..."
            />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={e => setFormField('notes', e.target.value)}
              placeholder="Write a brief note or key intuition here..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              <Check className="w-4 h-4" /> Log Problem
            </Button>
            <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
