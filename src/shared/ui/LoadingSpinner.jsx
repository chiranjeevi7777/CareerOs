import React from 'react';

/**
 * Inline loading spinner — used inside cards while AI data loads.
 * @param {'sm'|'md'|'lg'} size
 * @param {string} label - Optional accessibility label / text
 */
export const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin`} />
      {label && <p className="text-xs text-slate-400 font-medium">{label}</p>}
    </div>
  );
};
