import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Standard modal overlay used by all modules.
 * Closes on backdrop click or Escape key.
 *
 * @param {boolean} open      - Controlled open state
 * @param {Function} onClose  - Close handler
 * @param {string} title      - Modal header title
 * @param {string} maxWidth   - Tailwind max-w class (default 'max-w-lg')
 */
export const Modal = ({ open, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={handleBackdrop}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.18 }}
            className={`modal-box ${maxWidth} w-full`}
          >
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="font-bold text-slate-900 dark:text-white text-base">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
