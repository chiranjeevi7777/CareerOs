import { useState, useCallback } from 'react';
import { missionsStorage } from '../services/missionsStorage';
import { genId, getTodayKey } from '../../../shared/utils';

export const useMissions = () => {
  const [missions, setMissions] = useState(() => missionsStorage.getMissions());
  const [missionTemplates, setMissionTemplates] = useState(() => missionsStorage.getTemplates());

  const updateMissionProgress = useCallback((templateId, value) => {
    const todayKey = getTodayKey();
    const updated = {
      ...missions,
      [todayKey]: { ...(missions[todayKey] || {}), [templateId]: value },
    };
    setMissions(updated);
    missionsStorage.saveMissions(updated);
  }, [missions]);

  const getTodayMissions = useCallback(() => missions[getTodayKey()] || {}, [missions]);

  const calculateStreak = useCallback(() => {
    let streak = 0;
    const date = new Date();
    const templates = missionsStorage.getTemplates();
    for (let i = 0; i < 365; i++) {
      const key = date.toISOString().split('T')[0];
      const dayMissions = missions[key] || {};
      const completed = templates.filter((t) => {
        const v = dayMissions[t.id];
        return t.type === 'checkbox' ? v === true : Number(v) >= t.target;
      }).length;
      if (i === 0 || completed > 0) {
        if (completed > 0) streak++;
        else break;
      } else break;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [missions]);

  const addMissionTemplate = useCallback((template) => {
    const updated = [...missionTemplates, { ...template, id: genId() }];
    setMissionTemplates(updated);
    missionsStorage.saveTemplates(updated);
  }, [missionTemplates]);

  const deleteMissionTemplate = useCallback((id) => {
    const updated = missionTemplates.filter((t) => t.id !== id);
    setMissionTemplates(updated);
    missionsStorage.saveTemplates(updated);
  }, [missionTemplates]);

  return {
    missions, missionTemplates,
    getTodayMissions, updateMissionProgress, calculateStreak,
    addMissionTemplate, deleteMissionTemplate,
  };
};
