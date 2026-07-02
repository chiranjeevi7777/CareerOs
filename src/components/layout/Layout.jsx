import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Bell, Zap, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const pageMeta = {
  '/':             { title: 'Dashboard',        sub: 'Your career command center' },
  '/mission':      { title: 'Daily Mission',     sub: 'Stay on track every day' },
  '/applications': { title: 'Job Applications',  sub: 'Track every opportunity' },
  '/interviews':   { title: 'Interview Tracker', sub: 'Manage your pipeline' },
  '/networking':   { title: 'Networking',        sub: 'Build your professional network' },
  '/dsa':          { title: 'DSA Tracker',       sub: 'Sharpen your problem-solving' },
  '/skills':       { title: 'Skill Matrix',      sub: 'Track your technical expertise' },
  '/resumes':      { title: 'Resume Manager',    sub: 'Optimize for every role' },
  '/timetable':    { title: 'Timetable',         sub: 'Plan your learning schedule' },
  '/analytics':    { title: 'Analytics',         sub: 'Data-driven job search insights' },
  '/achievements': { title: 'Achievements',      sub: 'Milestones you\'ve earned' },
  '/settings':     { title: 'Settings',          sub: 'Configure your workspace' },
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { settings, calculateStreak } = useApp();
  const meta = pageMeta[location.pathname] || { title: 'Job Hunt OS', sub: '' };
  const streak = calculateStreak();
  const sidebarWidth = collapsed ? 68 : 232;

  return (
    <div className="min-h-screen flex" style={{ background: '#0e0e13' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* ── Top Bar ── */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(14,14,19,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Page title */}
          <div>
            <h1 className="font-bold text-[#e4e1e9] text-lg tracking-tight leading-tight">{meta.title}</h1>
            <p className="text-xs text-[#4a4455] mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                }}>
                <Zap className="w-3 h-3" />
                {streak}d streak
              </div>
            )}

            {/* Bell */}
            <button className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#4a4455' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#d2bbff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#4a4455'; }}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 0 16px rgba(124,58,237,0.35)',
              }}>
              {(settings?.name || 'J')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
