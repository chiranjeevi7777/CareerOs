import { useState, useCallback } from 'react';
import { createDomainStore } from '../../../shared/storage';
import { genId } from '../../../shared/utils';

const timetableStore = createDomainStore('jhos_timetable', [
  { id: '1', time: '06:00', endTime: '07:00', activity: 'Exercise / Morning Routine', color: '#22c55e', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '2', time: '07:00', endTime: '09:00', activity: 'DSA Practice', color: '#6366f1', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '3', time: '09:00', endTime: '10:00', activity: 'Breakfast / Break', color: '#f59e0b', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '4', time: '10:00', endTime: '12:00', activity: 'Job Applications', color: '#3b82f6', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '5', time: '12:00', endTime: '13:00', activity: 'Lunch Break', color: '#f97316', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '6', time: '13:00', endTime: '14:00', activity: 'SQL / Database Study', color: '#10b981', days: ['Mon','Tue','Wed','Thu','Fri'] },
  { id: '7', time: '14:00', endTime: '16:00', activity: 'Networking on LinkedIn', color: '#ec4899', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { id: '8', time: '16:00', endTime: '18:00', activity: 'Python / Technical Skills', color: '#8b5cf6', days: ['Mon','Tue','Wed','Thu','Fri','Sat'] },
  { id: '9', time: '19:00', endTime: '21:00', activity: 'Projects / Portfolio', color: '#06b6d4', days: ['Mon','Tue','Wed','Thu','Fri','Sat'] },
  { id: '10', time: '21:00', endTime: '22:00', activity: 'Review & Planning', color: '#f43f5e', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
]);

export function useTimetable() {
  const [timetable, setTimetable] = useState(() => timetableStore.get());

  const persistTimetable = useCallback((updated) => {
    setTimetable(updated);
    timetableStore.set(updated);
  }, []);

  const addSlot = useCallback((slot) => {
    const updated = [...timetable, { ...slot, id: genId() }]
      .sort((a, b) => a.time.localeCompare(b.time));
    persistTimetable(updated);
  }, [timetable, persistTimetable]);

  const updateSlot = useCallback((id, data) => {
    const updated = timetable.map((t) => (t.id === id ? { ...t, ...data } : t));
    persistTimetable(updated);
  }, [timetable, persistTimetable]);

  const deleteSlot = useCallback((id) => {
    const updated = timetable.filter((t) => t.id !== id);
    persistTimetable(updated);
  }, [timetable, persistTimetable]);

  return {
    timetable,
    addSlot,
    updateSlot,
    deleteSlot,
  };
}
