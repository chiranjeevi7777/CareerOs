import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Target, Zap, Check, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../shared/ui';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DailyMissionPage() {
  const {
    missionTemplates,
    getTodayMissions,
    updateMissionProgress,
    calculateStreak,
    missions,
    addMissionTemplate,
    deleteMissionTemplate
  } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', icon: '⭐', type: 'checkbox', target: 1 });

  const todayMissions = getTodayMissions();
  const streak = calculateStreak();

  const completedCount = missionTemplates.filter(t => {
    const v = todayMissions[t.id];
    return t.type === 'checkbox' ? v === true : Number(v) >= t.target;
  }).length;

  const completionPct = missionTemplates.length > 0 ? Math.round((completedCount / missionTemplates.length) * 100) : 0;

  // Last 7 days completion history
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayM = missions[key] || {};
    const done = missionTemplates.filter(t => {
      const v = dayM[t.id];
      return t.type === 'checkbox' ? v === true : Number(v) >= t.target;
    }).length;
    const pct = missionTemplates.length > 0 ? Math.round((done / missionTemplates.length) * 100) : 0;
    return { date: d, key, pct, done, label: DAYS_OF_WEEK[d.getDay()] };
  });

  const handleToggle = (template) => {
    const cur = todayMissions[template.id];
    if (template.type === 'checkbox') {
      updateMissionProgress(template.id, !cur);
    }
  };

  const handleNumberUpdate = (template, value) => {
    updateMissionProgress(template.id, Math.max(0, Math.min(template.target * 2, Number(value))));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addMissionTemplate(newTask);
    setNewTask({ title: '', icon: '⭐', type: 'checkbox', target: 1 });
    setShowAdd(false);
    toast.success('New daily task added!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-[0.06] bg-[#7c3aed] filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-[0.06] bg-[#06b6d4] filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          {/* Streak Indicator */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.15))',
                border: '1px solid rgba(245,158,11,0.25)',
                boxShadow: '0 0 20px rgba(245,158,11,0.15)',
              }}>
              <Zap className="w-10 h-10 text-[#f59e0b] filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <div className="absolute -bottom-1 -right-1 bg-[#f59e0b] text-[#0e0e13] font-bold text-xs px-2 py-0.5 rounded-full">
                {streak}D
              </div>
            </div>
            <p className="text-[10px] text-[#958da1] font-bold uppercase tracking-widest mt-1">Active Streak</p>
          </div>

          {/* Progress */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-end flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#e4e1e9] tracking-tight">Daily Command Progress</h2>
                <p className="text-xs text-slate-500 mt-0.5">Complete tasks to extend your streak</p>
              </div>
              <span className="text-3xl font-extrabold font-mono text-[#7c3aed]">
                {completionPct}%
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)',
                  boxShadow: '0 0 8px rgba(124,58,237,0.4)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-slate-500">
              <span className="text-slate-900 dark:text-[#e4e1e9] font-bold">{completedCount}</span> of{' '}
              <span className="text-slate-900 dark:text-[#e4e1e9] font-bold">{missionTemplates.length}</span> objectives accomplished today
            </p>
          </div>

          {/* 7 Day History Column bars */}
          <div className="flex gap-2 flex-shrink-0">
            {last7Days.map(({ label, pct }, i) => {
              const isToday = i === 6;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-7 h-16 rounded-full overflow-hidden flex items-end"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="w-full rounded-full"
                      style={{
                        background: pct === 100
                          ? 'linear-gradient(180deg, #10b981, #059669)'
                          : pct > 50
                            ? 'linear-gradient(180deg, #7c3aed, #6d28d9)'
                            : pct > 0
                              ? 'linear-gradient(180deg, #f59e0b, #d97706)'
                              : 'transparent',
                        boxShadow: pct > 0 ? '0 0 8px rgba(124,58,237,0.2)' : 'none',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isToday ? 'text-[#7c3aed]' : 'text-slate-400'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Mission Tasks */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <h3 className="font-bold text-slate-900 dark:text-[#e4e1e9] text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-[#f59e0b]" />
            Active Objectives
          </h3>
          <Button onClick={() => setShowAdd(!showAdd)} variant="primary" className="text-sm">
            <Plus className="w-4 h-4" /> New Objective
          </Button>
        </div>

        {/* Add Task Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-5 rounded-2xl border space-y-4 overflow-hidden"
              style={{
                background: 'rgba(124,58,237,0.06)',
                borderColor: 'rgba(124,58,237,0.2)',
              }}
            >
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="form-label">Emoji</label>
                  <input
                    type="text"
                    placeholder="⭐"
                    value={newTask.icon}
                    onChange={e => setNewTask(p => ({ ...p, icon: e.target.value }))}
                    className="input-field text-center text-lg animate-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="form-label">Objective Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Solve 3 LeetCode problems..."
                    value={newTask.title}
                    onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Task Type</label>
                  <select
                    value={newTask.type}
                    onChange={e => setNewTask(p => ({ ...p, type: e.target.value }))}
                    className="select-field"
                  >
                    <option value="checkbox">Checkbox Task</option>
                    <option value="number">Numeric Counter</option>
                  </select>
                </div>
                {newTask.type === 'number' && (
                  <div>
                    <label className="form-label">Target Number</label>
                    <input
                      type="number"
                      placeholder="Target"
                      value={newTask.target}
                      onChange={e => setNewTask(p => ({ ...p, target: Number(e.target.value) }))}
                      className="input-field"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-1.5">
                <Button onClick={handleAddTask} variant="primary" className="text-sm">
                  <Check className="w-4 h-4" /> Save Objective
                </Button>
                <Button onClick={() => setShowAdd(false)} variant="secondary" className="text-sm">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence>
            {missionTemplates.map((template, idx) => {
              const val = todayMissions[template.id];
              const done = template.type === 'checkbox' ? val === true : Number(val) >= template.target;
              const progress = template.type === 'number' ? Math.min(100, (Number(val) / template.target) * 100) : done ? 100 : 0;

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group"
                  style={{
                    background: done ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
                    borderColor: done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Circle Checkbox Trigger */}
                  <button
                    onClick={() => handleToggle(template)}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: done ? '#10b981' : 'transparent',
                      borderColor: done ? '#10b981' : 'rgba(255,255,255,0.15)',
                    }}
                    disabled={template.type === 'number'}
                  >
                    {done && <Check className="w-4 h-4 text-slate-900" />}
                  </button>

                  {/* Icon & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl flex-shrink-0">{template.icon}</span>
                      <span className={`font-semibold text-sm ${
                        done ? 'line-through text-slate-400 dark:text-[#4a4455]' : 'text-slate-800 dark:text-[#e4e1e9]'
                      }`}>
                        {template.title}
                      </span>
                    </div>

                    {template.type === 'number' && (
                      <div className="mt-2.5 max-w-md">
                        <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: done
                                ? 'linear-gradient(90deg, #10b981, #059669)'
                                : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                            }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Number Input Action */}
                  {template.type === 'number' && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleNumberUpdate(template, (Number(val) || 0) - 1)}
                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 font-bold text-base flex items-center justify-center transition-all border-0 cursor-pointer"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={Number(val) || 0}
                        onChange={e => handleNumberUpdate(template, e.target.value)}
                        className="w-12 text-center font-mono font-bold text-xs input-field py-1"
                        min="0"
                      />
                      <button
                        onClick={() => handleNumberUpdate(template, (Number(val) || 0) + 1)}
                        className="w-7 h-7 rounded-lg text-white font-bold text-base flex items-center justify-center transition-all border-0 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                      >
                        +
                      </button>
                      <span className="text-xs text-slate-400 dark:text-[#4a4455] ml-1">/ {template.target}</span>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      deleteMissionTemplate(template.id);
                      toast.success('Task removed');
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#ef4444] transition-all p-1.5 rounded-lg flex-shrink-0 bg-transparent border-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {missionTemplates.length === 0 && (
            <div className="text-center py-16 text-slate-500 dark:text-[#4a4455]">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-sm">No mission objectives set</p>
              <p className="text-xs mt-1">Add objective tasks above to track your daily progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {completionPct === 100 && missionTemplates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="rounded-2xl p-6 text-center border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(124,58,237,0.06) 100%)',
              borderColor: 'rgba(16,185,129,0.25)',
              boxShadow: '0 8px 32px rgba(16,185,129,0.08)',
            }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <Award className="w-12 h-12 text-[#10b981] mb-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-[#e4e1e9]">Daily Objective Completed!</h3>
              <p className="text-xs text-slate-500 dark:text-[#958da1] mt-1">Streak maintained. Carry this momentum into tomorrow!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
