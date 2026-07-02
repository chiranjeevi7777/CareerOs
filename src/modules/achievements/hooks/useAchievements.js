import { useState, useCallback } from 'react';
import { achievementsStorage } from '../services/achievementsStorage';

/**
 * Achievements module hook.
 *
 * Receives snapshots from other modules via checkAchievements().
 * It NEVER imports from other modules — counts are passed in as arguments.
 * This maintains the "listener" pattern with no upward coupling.
 *
 * @param {{ applications: number, interviews: number, dsaProblems: number, contacts: number }} counts
 */
export const useAchievements = () => {
  const [achievements, setAchievements] = useState(() => achievementsStorage.getAll());

  /**
   * Evaluates all achievement conditions against current domain counts.
   * Call this from AppContext whenever any tracked domain changes.
   *
   * @param {{ applications: Array, interviews: Array, dsa: Array, networking: Array }} snapshots
   */
  const checkAchievements = useCallback(({ applications = [], interviews = [], dsa = [], networking = [] }) => {
    const current = achievementsStorage.getAll();
    let updated = [...current];
    let changed = false;

    const earn = (id) => {
      const idx = updated.findIndex((a) => a.id === id);
      if (idx !== -1 && !updated[idx].earned) {
        updated[idx] = { ...updated[idx], earned: true, earnedDate: new Date().toISOString() };
        changed = true;
      }
    };

    if (applications.length >= 1)    earn('first_app');
    if (applications.length >= 10)   earn('apps_10');
    if (applications.length >= 50)   earn('apps_50');
    if (applications.length >= 100)  earn('apps_100');
    if (applications.length >= 500)  earn('apps_500');
    if (applications.length >= 1000) earn('apps_1000');
    if (interviews.length >= 1)      earn('first_interview');
    if (applications.some((a) => a.status === 'Offer')) earn('first_offer');
    if (dsa.length >= 10)  earn('dsa_10');
    if (dsa.length >= 50)  earn('dsa_50');
    if (dsa.length >= 100) earn('dsa_100');
    if (networking.length >= 50) earn('network_50');

    if (changed) {
      setAchievements(updated);
      achievementsStorage.saveAll(updated);
    }
  }, []);

  return { achievements, checkAchievements };
};
