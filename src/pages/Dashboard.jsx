import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Code2, Target, TrendingUp, Zap, Award,
  CheckCircle, Clock, ArrowRight, Star, Activity, Plus, Sparkles, Brain
} from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Every application is a step closer to your dream job. Keep going!",
  "Success is the sum of small efforts repeated day in and day out.",
  "The harder you work, the luckier you get. You're doing great!",
  "Your dream job is looking for you. Make sure they can find you.",
  "Consistency is the key. One more application, one more chance.",
  "Believe you can and you're halfway there. Keep pushing!",
  "Every rejection is a redirection to something better.",
  "You are exactly one application away from changing your life.",
  "The only way to do great work is to love what you do. Find it!",
  "Your persistence will pay off. Don't give up now!",
];

// Premium Arc Progress indicator for Dashboard
function ArcRingDashboard({ percentage, color, size = 110, strokeWidth = 9 }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (percentage / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

function KPICard({ icon: Icon, label, value, subtitle, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-2 relative overflow-hidden group"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-[0.05] filter blur-xl transition-all group-hover:scale-150"
        style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}25`,
          }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className="text-[10px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981]">
            +{trend} this wk
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-[#e4e1e9]">{value}</p>
        <p className="text-xs font-semibold text-[#958da1] uppercase tracking-wider">{label}</p>
        {subtitle && <p className="text-[10px] text-[#4a4455] font-medium mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { applications, networking, dsa, missionTemplates, getTodayMissions, calculateStreak, settings, achievements } = useApp();

  const todayMissions = getTodayMissions();
  const streak = calculateStreak();

  const quote = useMemo(() => {
    const idx = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[idx];
  }, []);

  const completedMissions = useMemo(() => {
    return missionTemplates.filter(t => {
      const v = todayMissions[t.id];
      if (t.type === 'checkbox') return v === true;
      return Number(v) >= t.target;
    }).length;
  }, [missionTemplates, todayMissions]);
  
  const missionPct = missionTemplates.length > 0 ? Math.round((completedMissions / missionTemplates.length) * 100) : 0;

  const startDate = new Date(settings.missionStartDate || new Date());
  const today = new Date();
  const dayOfMission = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1);
  const daysRemaining = Math.max(0, (settings.missionDuration || 60) - dayOfMission + 1);
  const missionProgress = Math.min(100, Math.round((dayOfMission / (settings.missionDuration || 60)) * 100));

  const totalApps = applications.length;
  const appProgress = Math.min(100, Math.round((totalApps / (settings.targetApplications || 200)) * 100));
  const thisWeek = applications.filter(a => {
    const d = new Date(a.createdAt);
    const diff = (today - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  
  const interviewCount = applications.filter(a => a.status === 'Interview' || a.status === 'Shortlisted').length;
  const offerCount = applications.filter(a => a.status === 'Offer').length;
  const conversionRate = totalApps > 0 ? ((interviewCount / totalApps) * 100).toFixed(1) : 0;

  const todayNetworking = networking.filter(n => n.connectionDate === today.toISOString().split('T')[0]).length;
  const recentApps = applications.slice(0, 5);

  const statusColors = {
    Applied:     'rgba(59,130,246,0.15)|#3b82f6',
    Assessment:  'rgba(245,158,11,0.15)|#f59e0b',
    Shortlisted: 'rgba(139,92,246,0.15)|#8b5cf6',
    Interview:   'rgba(16,185,129,0.15)|#10b981',
    Rejected:    'rgba(239,68,68,0.15)|#ef4444',
    Offer:       'rgba(34,197,94,0.15)|#22c55e',
  };

  const getStatusStyle = (status) => {
    const fallback = 'rgba(255,255,255,0.08)|#ccc3d8';
    const match = statusColors[status] || fallback;
    const [bg, text] = match.split('|');
    return { background: bg, color: text, border: `1px solid ${text}30` };
  };

  const earnedAchievements = achievements.filter(a => a.earned);

  // Backend AI Status check
  const [aiStatus, setAiStatus] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then(r => r.json())
      .then(d => setAiStatus(d))
      .catch(() => setAiStatus({ status: 'offline' }));
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, #131318 0%, #1c0e35 50%, #0e172a 100%)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed]/10 rounded-full -translate-y-1/2 translate-x-1/2 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#06b6d4]/10 rounded-full translate-y-1/2 filter blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start z-10">
          {/* Left info */}
          <div className="flex-1 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-xs font-bold mb-4 border border-white/10"
              style={{ color: '#d2bbff' }}>
              <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
              COMMAND MATRIX ACTIVE · DAY {dayOfMission}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#e4e1e9] tracking-tight mb-2">
              Welcome back, {settings.name || 'Developer'} 👋
            </h2>
            <p className="text-xs font-semibold text-[#958da1] uppercase tracking-wider">
              TARGET POSITION: <span className="text-[#e4e1e9] font-bold">{settings.role || 'Software Engineer'}</span>
            </p>
            <p className="text-[#ccc3d8] text-sm mt-3 italic">"{quote}"</p>

            {/* Progress line */}
            <div className="space-y-2 mt-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#958da1]">60-Day Sprint Progress</span>
                <span className="text-[#e4e1e9]">Day {dayOfMission} / {settings.missionDuration || 60}</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${missionProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)',
                    boxShadow: '0 0 12px rgba(124,58,237,0.4)',
                  }}
                />
              </div>
              <p className="text-xs text-[#958da1]">
                <span className="text-[#f59e0b] font-bold">{daysRemaining} days remaining</span> to secure your offer
              </p>
            </div>
          </div>

          {/* Right progress ring components */}
          <div className="flex gap-6 flex-shrink-0">
            {/* Apps Circle */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex items-center justify-center">
                <ArcRingDashboard percentage={appProgress} color="#7c3aed" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#e4e1e9]">{appProgress}%</span>
                  <span className="text-[10px] text-[#4a4455] uppercase tracking-wider font-semibold">Apps</span>
                </div>
              </div>
              <p className="text-[10px] text-[#958da1] text-center uppercase tracking-wider font-bold">
                {totalApps} / {settings.targetApplications || 200}
              </p>
            </div>

            {/* Daily Task Circle */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex items-center justify-center">
                <ArcRingDashboard percentage={missionPct} color="#f59e0b" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#e4e1e9]">{missionPct}%</span>
                  <span className="text-[10px] text-[#4a4455] uppercase tracking-wider font-semibold">Today</span>
                </div>
              </div>
              <p className="text-[10px] text-[#958da1] text-center uppercase tracking-wider font-bold">
                {completedMissions} / {missionTemplates.length} Tasks
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Widgets ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard icon={Briefcase} label="Applications" value={totalApps} subtitle={`${appProgress}% of sprint goal`} color="#7c3aed" trend={thisWeek} />
        <KPICard icon={Activity} label="Weekly Velocity" value={thisWeek} subtitle="new roles applied" color="#06b6d4" />
        <KPICard icon={Target} label="Interviews" value={interviewCount} subtitle={`${conversionRate}% pipeline yield`} color="#fbbf24" />
        <KPICard icon={Award} label="Offers" value={offerCount} subtitle={offerCount > 0 ? '🎉 Match Secured!' : 'Pipeline Active'} color="#10b981" />
        <KPICard icon={Code2} label="DSA Solved" value={dsa.length} subtitle="practice problems" color="#d946ef" />
      </div>

      {/* ── AI Copilot CTA Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(168,85,247,0.06) 50%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: '#a855f7', filter: 'blur(40px)' }} />

        <div className="relative flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-100 text-sm">AI Career Copilot is Ready</p>
            <p className="text-xs text-slate-400 mt-0.5">Parse JDs, tailor resumes, run mock interviews, and search your data with hybrid AI.</p>
          </div>
        </div>

        <div className="relative flex items-center gap-3 flex-shrink-0">
          {/* Backend status pill */}
          {aiStatus && (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5"
              style={{
                background: aiStatus.status === 'healthy' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: aiStatus.status === 'healthy' ? '#10b981' : '#ef4444',
                border: `1px solid ${aiStatus.status === 'healthy' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: aiStatus.status === 'healthy' ? '#10b981' : '#ef4444' }} />
              {aiStatus.status === 'healthy' ? `Backend Online · ${aiStatus.mode}` : 'Backend Offline'}
            </span>
          )}
          <Link
            to="/copilot"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: '0 0 16px rgba(124,58,237,0.35)',
            }}
          >
            <Brain className="w-4 h-4" /> Open Copilot
          </Link>
        </div>
      </motion.div>

      {/* ── Dashboard Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Objectives Widget */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#e4e1e9] text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-[#f59e0b]" />
              Today's Targets
            </h3>
            <Link to="/mission" className="text-xs text-[#7c3aed] hover:text-[#d2bbff] flex items-center gap-0.5">
              Launch <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#958da1]">
              <span>{completedMissions} objectives done</span>
              <span className="font-bold" style={{ color: '#f59e0b' }}>{missionPct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', boxShadow: '0 0 6px rgba(245,158,11,0.3)' }}
                initial={{ width: 0 }}
                animate={{ width: `${missionPct}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {missionTemplates.slice(0, 5).map(t => {
              const val = todayMissions[t.id];
              const done = t.type === 'checkbox' ? val === true : Number(val) >= t.target;
              return (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl border"
                  style={{
                    background: done ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
                    borderColor: done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                  }}>
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 ${done ? 'text-[#10b981]' : 'text-[#4a4455]'}`} />
                  <span className={`text-xs flex-1 ${done ? 'line-through text-[#4a4455]' : 'text-[#ccc3d8]'}`}>
                    {t.icon} {t.title}
                  </span>
                  {t.type === 'number' && (
                    <span className="text-xs font-mono text-[#958da1]">
                      {Number(val) || 0}/{t.target}
                    </span>
                  )}
                </div>
              );
            })}
            {missionTemplates.length === 0 && (
              <div className="text-center py-6 text-[#4a4455] text-xs">
                No active objectives. Create one!
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#e4e1e9] text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#06b6d4]" />
              Pipeline Overview
            </h3>
            <Link to="/applications" className="text-xs text-[#7c3aed] hover:text-[#d2bbff] flex items-center gap-0.5">
              Open <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {[
            { label: 'Applied',     count: applications.filter(a => a.status === 'Applied').length, color: '#3b82f6' },
            { label: 'Assessment',  count: applications.filter(a => a.status === 'Assessment').length, color: '#f59e0b' },
            { label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length, color: '#8b5cf6' },
            { label: 'Interview',   count: applications.filter(a => a.status === 'Interview').length, color: '#10b981' },
            { label: 'Rejected',    count: applications.filter(a => a.status === 'Rejected').length, color: '#ef4444' },
            { label: 'Offer',       count: applications.filter(a => a.status === 'Offer').length, color: '#22c55e' },
          ].map(({ label, count, color }) => {
            const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#958da1]">{label}</span>
                  <span className="font-bold" style={{ color }}>{count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Badges & Streak panel */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-bold text-[#e4e1e9] text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#f59e0b]" />
            Streak & Milestones
          </h3>

          <div className="border rounded-xl p-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(239,68,68,0.08) 100%)',
              borderColor: 'rgba(245,158,11,0.2)',
            }}>
            <div className="text-3xl">🔥</div>
            <div>
              <p className="text-xl font-bold text-[#e4e1e9] tracking-tight">{streak} Days Active</p>
              <p className="text-[10px] text-[#958da1] font-semibold uppercase tracking-wider">Current Daily Streak</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xl font-extrabold text-[#06b6d4]">{networking.length}</p>
              <p className="text-[10px] font-semibold text-[#958da1] uppercase mt-0.5">Contacts</p>
            </div>
            <div className="rounded-xl p-3 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xl font-extrabold text-[#d946ef]">{dsa.length}</p>
              <p className="text-[10px] font-semibold text-[#958da1] uppercase mt-0.5">DSA Problems</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-[#958da1] uppercase tracking-wider mb-2">
              Badges Earned ({earnedAchievements.length}/{achievements.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {earnedAchievements.slice(0, 7).map(a => (
                <span key={a.id} title={a.title} className="text-xl cursor-default hover:scale-115 transition-transform" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                  {a.icon}
                </span>
              ))}
              {earnedAchievements.length === 0 && (
                <p className="text-xs text-[#4a4455] italic">Milestones will show up here</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications list */}
      {recentApps.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#e4e1e9] text-sm">Recent Applications</h3>
            <Link to="/applications" className="text-xs text-[#7c3aed] hover:text-[#d2bbff] flex items-center gap-0.5">
              Launch Pipeline {applications.length} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Platform</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app.id}>
                    <td className="font-semibold text-[#e4e1e9]">{app.company}</td>
                    <td>{app.role}</td>
                    <td className="text-[#958da1]">{app.platform}</td>
                    <td className="text-[#4a4455] text-xs">{new Date(app.applicationDate || app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge" style={getStatusStyle(app.status)}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
