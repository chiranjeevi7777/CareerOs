import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Target, Briefcase, Calendar, Users, Code2, BookOpen,
  FileText, Clock, BarChart3, Settings, ChevronLeft, ChevronRight,
  Zap, Moon, Sun, Trophy, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/',              icon: LayoutDashboard, label: 'Dashboard',     color: '#7c3aed' },
  { path: '/copilot',       icon: Sparkles,        label: 'AI Copilot',    color: '#a855f7' },
  { path: '/mission',       icon: Target,          label: 'Daily Mission',  color: '#f59e0b' },
  { path: '/applications',  icon: Briefcase,       label: 'Applications',   color: '#3b82f6' },
  { path: '/interviews',    icon: Calendar,        label: 'Interviews',     color: '#10b981' },
  { path: '/networking',    icon: Users,           label: 'Networking',     color: '#ec4899' },
  { path: '/dsa',           icon: Code2,           label: 'DSA Tracker',    color: '#8b5cf6' },
  { path: '/skills',        icon: BookOpen,        label: 'Skills',         color: '#06b6d4' },
  { path: '/resumes',       icon: FileText,        label: 'Resumes',        color: '#f97316' },
  { path: '/timetable',     icon: Clock,           label: 'Timetable',      color: '#22c55e' },
  { path: '/analytics',     icon: BarChart3,       label: 'Analytics',      color: '#d946ef' },
  { path: '/achievements',  icon: Trophy,          label: 'Achievements',   color: '#fbbf24' },
  { path: '/settings',      icon: Settings,        label: 'Settings',       color: '#6b7280' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { theme, toggleTheme, achievements } = useApp();
  const location = useLocation();
  const earnedCount = achievements?.filter(a => a.earned).length ?? 0;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 232 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden"
      style={{
        background: '#0e0e13',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-5 min-h-[68px]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}>
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="font-bold text-[#e4e1e9] text-sm leading-tight tracking-tight">Job Hunt OS</p>
              <p className="text-[10px] text-[#4a4455] leading-tight tracking-widest uppercase mt-0.5">Career OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 relative group"
              style={{
                color: isActive ? '#e4e1e9' : '#4a4455',
                background: isActive ? `${color}18` : 'transparent',
                border: isActive ? `1px solid ${color}25` : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#ccc3d8';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#4a4455';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: color }}
                />
              )}

              <Icon
                className="w-[18px] h-[18px] flex-shrink-0 transition-all duration-200"
                style={{ color: isActive ? color : 'inherit' }}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {label}
                    {path === '/achievements' && earnedCount > 0 && (
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                        {earnedCount}
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity"
                  style={{
                    background: '#1f1f25',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e4e1e9',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}>
                  {label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="px-2 pb-4 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
          style={{ color: '#4a4455' }}
          title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
          onMouseEnter={e => { e.currentTarget.style.color = '#ccc3d8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a4455'; e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark'
            ? <Sun className="w-[18px] h-[18px] flex-shrink-0 group-hover:text-amber-400 transition-colors" />
            : <Moon className="w-[18px] h-[18px] flex-shrink-0 group-hover:text-blue-400 transition-colors" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }} className="text-sm whitespace-nowrap">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{ color: '#4a4455' }}
          title={collapsed ? 'Expand' : 'Collapse'}
          onMouseEnter={e => { e.currentTarget.style.color = '#ccc3d8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a4455'; e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed
            ? <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
            : <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }} className="text-sm whitespace-nowrap">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
