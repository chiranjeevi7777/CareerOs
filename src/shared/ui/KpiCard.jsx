import React from 'react';
import { motion } from 'framer-motion';

/**
 * KPI metric card used on Dashboard and module summary rows.
 *
 * @param {string} label      - Metric label
 * @param {string|number} value
 * @param {string} color      - Hex color for accent bar/text
 * @param {React.ReactNode} icon
 * @param {string} subtitle   - Optional secondary text
 */
export const KpiCard = ({ label, value, color, icon, subtitle, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`kpi-card ${className}`}
  >
    {icon && (
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <span style={{ color }}>{icon}</span>
      </div>
    )}
    <p className="text-2xl font-bold" style={color ? { color } : {}}>{value}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
  </motion.div>
);
