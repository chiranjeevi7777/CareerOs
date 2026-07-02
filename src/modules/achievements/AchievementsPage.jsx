import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
  const { achievements, applications, dsa, networking, calculateStreak } = useApp();
  const earned = achievements.filter(a => a.earned);
  const streak = calculateStreak();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="glass-card p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
        <div className="flex items-center gap-6">
          <div className="text-6xl">🏆</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{earned.length} / {achievements.length}</h2>
            <p className="text-slate-500 dark:text-slate-400">Badges Earned</p>
            <div className="mt-2 h-2 w-64 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(earned.length / achievements.length) * 100}%` }}
                transition={{ duration: 1.5 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats that affect achievements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: applications.length, needed: [1, 10, 50, 100, 500, 1000], color: '#6366f1' },
          { label: 'DSA Solved', value: dsa.length, needed: [10, 50, 100], color: '#8b5cf6' },
          { label: 'Contacts', value: networking.length, needed: [50], color: '#ec4899' },
          { label: 'Day Streak', value: streak, needed: [3, 7, 30], color: '#f59e0b' },
        ].map(({ label, value, needed, color }) => {
          const next = needed.find(n => n > value);
          return (
            <div key={label} className="kpi-card">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
              {next && <p className="text-xs text-slate-400 mt-0.5 animate-none">Next badge at {next}</p>}
            </div>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`glass-card p-4 flex flex-col items-center text-center gap-2 transition-all duration-300 ${
              achievement.earned
                ? 'hover:shadow-xl hover:-translate-y-1 ring-1 ring-yellow-500/30'
                : 'opacity-50'
            }`}
          >
            <div className={`text-4xl ${achievement.earned ? '' : 'grayscale opacity-40'}`} style={{ filter: achievement.earned ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'grayscale(1)' }}>
              {achievement.earned ? achievement.icon : '🔒'}
            </div>
            <div>
              <p className={`font-bold text-xs leading-tight ${achievement.earned ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                {achievement.title}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                {achievement.description}
              </p>
            </div>
            {achievement.earned && achievement.earnedDate && (
              <p className="text-[10px] text-yellow-500 dark:text-yellow-400 font-medium">
                ✓ {new Date(achievement.earnedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
