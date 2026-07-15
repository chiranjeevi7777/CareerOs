import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Check, BookOpen, Zap, Trophy, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard } from '../../shared/ui';

const CATEGORIES = ['Programming', 'Databases', 'Web Development', 'Core Subjects'];
const STATUSES = ['Not Started', 'Learning', 'Practicing', 'Interview Ready', 'Mastered'];

const STATUS_CONFIG = {
  'Not Started':    { color: '#4a4455', bg: 'rgba(74,68,85,0.15)',  label: '○ Not Started' },
  'Learning':       { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', label: '◑ Learning' },
  'Practicing':     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',label: '◕ Practicing' },
  'Interview Ready':{ color: '#7c3aed', bg: 'rgba(124,58,237,0.15)',label: '★ Interview Ready' },
  'Mastered':       { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: '✦ Mastered' },
};

const SKILL_COLORS = [
  '#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899',
  '#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#a855f7', '#14b8a6',
];

const CATEGORY_ICONS = {
  'Programming':     '{ }',
  'Databases':       '⬡',
  'Web Development': '◈',
  'Core Subjects':   '◎',
};

// SVG Radial Arc Progress Ring
function ArcRing({ progress, color, size = 160, strokeW = 10 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
      />
    </svg>
  );
}

// Hexagonal Skill Card
function HexSkillCard({ skill, onEdit, onUpdate, index }) {
  const [hovered, setHovered] = useState(false);
  const statusCfg = STATUS_CONFIG[skill.status] || STATUS_CONFIG['Not Started'];
  const letter = skill.name[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center gap-4 p-6 rounded-2xl cursor-pointer group"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${skill.color}18 0%, rgba(255,255,255,0.04) 100%)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? skill.color + '40' : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(12px)',
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${skill.color}25`
          : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.35s ease',
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(skill); }}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-0 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', color: '#ccc3d8' }}
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex-shrink-0">
        <ArcRing progress={skill.progress} color={skill.color} size={140} strokeW={9} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl text-white font-bold text-xl"
            style={{
              background: `linear-gradient(135deg, ${skill.color}40 0%, ${skill.color}20 100%)`,
              border: `1px solid ${skill.color}50`,
            }}
          >
            {letter}
          </div>
          <span
            className="text-2xl font-bold mt-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: skill.color,
              textShadow: `0 0 12px ${skill.color}80`,
            }}
          >
            {skill.progress}%
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-[#e4e1e9] text-base leading-tight">{skill.name}</p>
        <p className="text-xs text-[#4a4455] mt-0.5 uppercase tracking-widest">{skill.category}</p>
      </div>

      <div
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.color}30` }}
      >
        {statusCfg.label}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            <input
              type="range" min="0" max="100" value={skill.progress}
              onChange={e => onUpdate(skill.id, { progress: Number(e.target.value) })}
              className="w-full cursor-pointer h-1.5 rounded-full"
              style={{ accentColor: skill.color }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Row-style Skill Card for list view
function SkillListRow({ skill, onEdit, onUpdate, index }) {
  const statusCfg = STATUS_CONFIG[skill.status] || STATUS_CONFIG['Not Started'];
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-5 px-5 py-4 rounded-xl group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = skill.color + '40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${skill.color}50, ${skill.color}25)`, border: `1px solid ${skill.color}40` }}>
        {skill.name[0]}
      </div>
      <div className="w-32 flex-shrink-0">
        <p className="font-semibold text-[#e4e1e9] text-sm">{skill.name}</p>
        <p className="text-xs text-[#4a4455]">{skill.category}</p>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}90)`, boxShadow: `0 0 8px ${skill.color}60` }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.04 }}
            />
          </div>
          <span className="text-sm font-bold w-10 text-right" style={{ color: skill.color, fontFamily: 'monospace' }}>{skill.progress}%</span>
        </div>
        <input type="range" min="0" max="100" value={skill.progress}
          onChange={e => onUpdate(skill.id, { progress: Number(e.target.value) })}
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer h-1 mt-1"
          style={{ accentColor: skill.color }} />
      </div>
      <div className="flex-shrink-0">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.color }}>
          {skill.status}
        </span>
      </div>
      <button onClick={() => onEdit(skill)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg border-0 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)', color: '#ccc3d8' }}>
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// Skill Modal (Uses Shared UI Modal)
function SkillFormModal({ open, skill, onSave, onClose }) {
  const [form, setForm] = useState(
    skill || { name: '', category: 'Programming', progress: 0, status: 'Not Started', color: '#7c3aed' }
  );
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={skill ? 'Edit Skill' : 'Add New Skill'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Skill Name</label>
          <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Python, React, SQL..." required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category</label>
            <select className="select-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="select-field" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Progress — {form.progress}%</label>
          <input type="range" min="0" max="100" value={form.progress}
            onChange={e => set('progress', Number(e.target.value))}
            className="w-full cursor-pointer mt-1" style={{ accentColor: form.color }} />
        </div>
        <div>
          <label className="form-label">Accent Color</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {SKILL_COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className="w-8 h-8 rounded-lg transition-all hover:scale-110 border-0 cursor-pointer"
                style={{
                  backgroundColor: c,
                  border: form.color === c ? '2px solid white' : '2px solid transparent',
                  boxShadow: form.color === c ? `0 0 12px ${c}80` : 'none',
                  transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                }} />
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1">
            <Check className="w-4 h-4" /> {skill ? 'Update Skill' : 'Add Skill'}
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SkillsPage() {
  const { skills, updateSkill, addSkill } = useApp();
  const [editSkill, setEditSkill] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = ['All', ...CATEGORIES];
  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);

  const stats = {
    total: skills.length,
    avgProgress: skills.length ? Math.round(skills.reduce((s, sk) => s + sk.progress, 0) / skills.length) : 0,
    interviewReady: skills.filter(s => s.status === 'Interview Ready').length,
    mastered: skills.filter(s => s.status === 'Mastered').length,
  };

  const handleSave = (form) => {
    if (editSkill) {
      updateSkill(editSkill.id, form);
      toast.success('Skill updated!');
    } else {
      addSkill(form);
      toast.success('Skill added!');
    }
    setEditSkill(null);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#e4e1e9] tracking-tight">Skill Matrix</h2>
          <p className="text-sm text-[#958da1] mt-0.5">Track your technical expertise across all domains</p>
        </div>
        <Button onClick={() => setShowAdd(true)} variant="primary">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Skills" value={stats.total} color="#7c3aed" />
        <KpiCard label="Avg Progress" value={`${stats.avgProgress}%`} color="#06b6d4" />
        <KpiCard label="Interview Ready" value={stats.interviewReady} color="#f59e0b" />
        <KpiCard label="Mastered" value={stats.mastered} color="#10b981" />
      </div>

      {/* Category Tabs + View Toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-0 cursor-pointer"
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
              } : {
                color: '#958da1',
                background: 'transparent',
              }}>
              {cat === 'All' ? 'All' : `${CATEGORY_ICONS[cat]} ${cat}`}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[['grid', '⊞'], ['list', '≡']].map(([mode, icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all border-0 cursor-pointer"
              style={viewMode === mode
                ? { background: 'rgba(124,58,237,0.3)', color: '#d2bbff' }
                : { color: '#958da1' }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((skill, i) => (
            <HexSkillCard key={skill.id} skill={skill} index={i}
              onEdit={sk => setEditSkill(sk)}
              onUpdate={updateSkill} />
          ))}

          {/* Add Placeholder */}
          <motion.button onClick={() => setShowAdd(true)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl min-h-[260px] transition-all cursor-pointer bg-transparent"
            style={{
              border: '1.5px dashed rgba(124,58,237,0.3)',
              color: '#958da1',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed80'; e.currentTarget.style.color = '#d2bbff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#958da1'; }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Add Skill</p>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((skill, i) => (
            <SkillListRow key={skill.id} skill={skill} index={i}
              onEdit={sk => setEditSkill(sk)}
              onUpdate={updateSkill} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#4a4455]">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No skills in this category</p>
            </div>
          )}
        </div>
      )}

      {/* Category Overview Strip */}
      {activeCategory === 'All' && (
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#958da1] mb-4">Progress by Category</p>
          {CATEGORIES.map(cat => {
            const catSkills = skills.filter(s => s.category === cat);
            const avg = catSkills.length ? Math.round(catSkills.reduce((s, sk) => s + sk.progress, 0) / catSkills.length) : 0;
            const colors = { 'Programming': '#7c3aed', 'Databases': '#06b6d4', 'Web Development': '#f59e0b', 'Core Subjects': '#10b981' };
            const c = colors[cat];
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#ccc3d8] font-medium">{CATEGORY_ICONS[cat]} {cat}</span>
                  <span className="font-bold font-mono" style={{ color: c }}>{avg}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}60` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${avg}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {(editSkill || showAdd) && (
        <SkillFormModal
          open={!!(editSkill || showAdd)}
          skill={editSkill}
          onSave={handleSave}
          onClose={() => { setEditSkill(null); setShowAdd(false); }}
        />
      )}
    </div>
  );
}
