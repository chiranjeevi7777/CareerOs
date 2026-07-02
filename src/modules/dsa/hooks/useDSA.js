import { useState, useCallback } from 'react';
import { dsaStorage } from '../services/dsaStorage';
import { genId, getTodayKey } from '../../../shared/utils';

/**
 * DSA module hook — problem log CRUD and streak calculation.
 */
export const useDSA = () => {
  const [dsa, setDsa] = useState(() => dsaStorage.getAll());

  const persist = useCallback((updated) => {
    setDsa(updated);
    dsaStorage.saveAll(updated);
  }, []);

  const addDSA = useCallback((problem) => {
    const newProblem = {
      ...problem,
      id: genId(),
      solvedDate: problem.solvedDate || getTodayKey(),
    };
    persist([newProblem, ...dsa]);
    return newProblem;
  }, [dsa, persist]);

  const deleteDSA = useCallback((id) => {
    persist(dsa.filter((d) => d.id !== id));
  }, [dsa, persist]);

  const dsaStreak = useCallback(() => {
    let streak = 0;
    const date = new Date();
    for (let i = 0; i < 365; i++) {
      const key = date.toISOString().split('T')[0];
      if (dsa.some((d) => d.solvedDate === key)) {
        streak++;
      } else if (i > 0) {
        break;
      }
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [dsa]);

  return { dsa, addDSA, deleteDSA, dsaStreak };
};
