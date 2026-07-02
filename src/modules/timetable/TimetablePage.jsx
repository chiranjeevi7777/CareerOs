import React, { useState } from 'react';
import { useTimetable } from './hooks/useTimetable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button } from '../../shared/ui';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f97316', '#22c55e', '#ef4444', '#06b6d4'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 5;
  return `${String(h).padStart(2, '0')}:00`;
});

const emptySlot = {
  time: '09:00',
  endTime: '10:00',
  activity: '',
  color: '#6366f1',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

function SlotFormModal({ open, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptySlot);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleDay = (day) => {
    setForm(p => ({
      ...p,
      days: p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.activity.trim()) {
      toast.error('Activity required');
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Slot' : 'Add Time Slot'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Activity *</label>
          <input className="input-field" value={form.activity} onChange={e => set('activity', e.target.value)} placeholder="DSA Practice, Job Applications..." required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Start Time</label>
            <select className="select-field" value={form.time} onChange={e => set('time', e.target.value)}>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">End Time</label>
            <select className="select-field" value={form.endTime} onChange={e => set('endTime', e.target.value)}>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${form.color === c ? 'border-white scale-125' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Days</label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map(day => (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-0 ${form.days.includes(day) ? 'text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                style={form.days.includes(day) ? { backgroundColor: form.color } : {}}>
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1">
            <Check className="w-4 h-4" /> Save Slot
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function TimetablePage() {
  const { timetable, addSlot, updateSlot, deleteSlot } = useTimetable();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeDay, setActiveDay] = useState(() => {
    const idx = new Date().getDay();
    return DAYS[idx === 0 ? 6 : idx - 1]; // Convert Sun=0 to our Mon-first system
  });

  const todaySlots = timetable.filter(s => s.days && s.days.includes(activeDay))
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleSave = (form) => {
    if (editItem) {
      updateSlot(editItem.id, form);
      toast.success('Slot updated!');
    } else {
      addSlot(form);
      toast.success('Slot added!');
    }
    setEditItem(null);
  };

  // Calculate total daily hours
  const totalMinutes = todaySlots.reduce((acc, s) => {
    const [sh, sm] = s.time.split(':').map(Number);
    const [eh, em] = s.endTime.split(':').map(Number);
    return acc + Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Timetable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 animate-none">
            {todaySlots.length} slots · {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m planned today
          </p>
        </div>
        <Button onClick={() => { setEditItem(null); setShowModal(true); }} variant="primary">
          <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-0 cursor-pointer ${activeDay === day ? 'bg-primary-600 text-white shadow-md' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10'}`}>
            {day}
            <span className="ml-2 text-xs opacity-60">{timetable.filter(s => s.days?.includes(day)).length}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Timeline */}
        <div className="lg:col-span-2 glass-card p-5 relative">
          <div className="absolute left-[60px] top-5 bottom-5 w-0.5 bg-slate-200 dark:bg-white/10" />
          
          <div className="space-y-3">
            <AnimatePresence>
              {todaySlots.map((slot, i) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 group"
                >
                  {/* Time */}
                  <div className="w-14 text-right flex-shrink-0">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{slot.time}</span>
                  </div>

                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full flex-shrink-0 border-2 border-white dark:border-dark-800 relative z-10"
                    style={{ backgroundColor: slot.color }} />

                  {/* Content */}
                  <div className="flex-1 flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md"
                    style={{ borderLeft: `3px solid ${slot.color}`, backgroundColor: `${slot.color}15` }}>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{slot.activity}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{slot.time} – {slot.endTime}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditItem(slot); setShowModal(true); }} className="text-slate-400 hover:text-primary-500 p-1 bg-transparent border-0 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm('Delete?')) { deleteSlot(slot.id); toast.success('Deleted'); }}} className="text-slate-400 hover:text-danger-500 p-1 bg-transparent border-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {todaySlots.length === 0 && (
              <div className="text-center py-12 text-slate-400 ml-16">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No slots for {activeDay}</p>
                <p className="text-sm mt-1">Add time blocks to plan your day</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Week Overview</h3>
          <div className="space-y-3">
            {DAYS.map(day => {
              const slots = timetable.filter(s => s.days?.includes(day));
              const mins = slots.reduce((acc, s) => {
                const [sh, sm] = s.time.split(':').map(Number);
                const [eh, em] = s.endTime.split(':').map(Number);
                return acc + Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
              }, 0);
              const hours = Math.round(mins / 60 * 10) / 10;
              return (
                <div key={day} className={`p-3 rounded-xl cursor-pointer transition-all ${activeDay === day ? 'bg-primary-100 dark:bg-primary-500/20 border border-primary-300 dark:border-primary-500/30' : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                  onClick={() => setActiveDay(day)}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{day}</span>
                    <span className="text-xs text-slate-500">{hours}h</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {slots.slice(0, 4).map(s => (
                      <div key={s.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    ))}
                    {slots.length > 4 && <span className="text-[10px] text-slate-400">+{slots.length - 4}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <SlotFormModal
          open={showModal}
          initial={editItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}
