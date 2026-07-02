import React from 'react';

/**
 * Empty state placeholder with icon + message, used when a list is empty.
 *
 * @param {React.ReactNode} icon
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} action   - Optional CTA button
 */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
    {icon && <div className="opacity-30 text-5xl">{icon}</div>}
    <p className="font-semibold text-slate-400">{title}</p>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
