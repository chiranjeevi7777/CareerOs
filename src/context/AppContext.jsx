/**
 * AppContext — Thin Orchestrator
 *
 * This file's ONLY job is to compose module hooks and expose their state
 * through a single React context for backward compatibility during migration.
 *
 * RULES:
 * - No business logic lives here.
 * - No localStorage access here.
 * - Each domain's logic lives in its module hook.
 * - As module pages are migrated to consume their own hooks directly,
 *   the exports from this context will be pruned.
 */
import React, { createContext, useContext, useEffect } from 'react';

// Module hooks — each owns its own storage and logic
import { useApplications } from '../modules/applications/hooks/useApplications';
import { useInterviews } from '../modules/interviews/hooks/useInterviews';
import { useNetworking } from '../modules/networking/hooks/useNetworking';
import { useDSA } from '../modules/dsa/hooks/useDSA';
import { useSkills } from '../modules/skills/hooks/useSkills';
import { useResumes } from '../modules/resume/hooks/useResumes';
import { useMissions } from '../modules/missions/hooks/useMissions';
import { useSettings } from '../modules/settings/hooks/useSettings';
import { useAchievements } from '../modules/achievements/hooks/useAchievements';
import { useTimetable } from '../modules/timetable/hooks/useTimetable';
import { useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // ── Module hooks ──
  const appMod = useApplications();
  const intMod = useInterviews();
  const netMod = useNetworking();
  const dsaMod = useDSA();
  const skillsMod = useSkills();
  const resumeMod = useResumes();
  const missionMod = useMissions();
  const settingsMod = useSettings();
  const achMod = useAchievements();
  const timetableMod = useTimetable();

  // ── Theme side-effect ──
  const { settings } = settingsMod;
  useEffect(() => {
    document.documentElement.classList.toggle('dark', (settings.theme || 'dark') === 'dark');
  }, [settings.theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    settingsMod.updateSettings({ theme: newTheme });
  }, [settings, settingsMod]);

  // ── Achievement triggers ──
  // Called by AppContext when domain data changes; passes counts, not internals
  useEffect(() => {
    achMod.checkAchievements({
      applications: appMod.applications,
      interviews: intMod.interviews,
      dsa: dsaMod.dsa,
      networking: netMod.networking,
    });
  }, [
    appMod.applications.length,
    intMod.interviews.length,
    dsaMod.dsa.length,
    netMod.networking.length,
  ]);

  const value = {
    // Applications domain
    applications: appMod.applications,
    addApplication: appMod.addApplication,
    updateApplication: appMod.updateApplication,
    deleteApplication: appMod.deleteApplication,
    setAllApplications: appMod.setAllApplications,

    // Interviews domain
    interviews: intMod.interviews,
    addInterview: intMod.addInterview,
    updateInterview: intMod.updateInterview,
    deleteInterview: intMod.deleteInterview,

    // Networking domain
    networking: netMod.networking,
    addContact: netMod.addContact,
    updateContact: netMod.updateContact,
    deleteContact: netMod.deleteContact,

    // DSA domain
    dsa: dsaMod.dsa,
    addDSA: dsaMod.addDSA,
    deleteDSA: dsaMod.deleteDSA,

    // Skills domain
    skills: skillsMod.skills,
    addSkill: skillsMod.addSkill,
    updateSkill: skillsMod.updateSkill,

    // Resume domain
    resumes: resumeMod.resumes,
    addResume: resumeMod.addResume,
    updateResume: resumeMod.updateResume,
    deleteResume: resumeMod.deleteResume,

    // Timetable domain
    timetable: timetableMod.timetable,
    addSlot: timetableMod.addSlot,
    updateSlot: timetableMod.updateSlot,
    deleteSlot: timetableMod.deleteSlot,

    // Missions domain
    missions: missionMod.missions,
    missionTemplates: missionMod.missionTemplates,
    getTodayMissions: missionMod.getTodayMissions,
    updateMissionProgress: missionMod.updateMissionProgress,
    calculateStreak: missionMod.calculateStreak,
    addMissionTemplate: missionMod.addMissionTemplate,
    deleteMissionTemplate: missionMod.deleteMissionTemplate,

    // Settings domain
    settings: settingsMod.settings,
    updateSettings: settingsMod.updateSettings,
    theme: settings.theme || 'dark',
    toggleTheme,

    // Achievements domain
    achievements: achMod.achievements,
    checkAchievements: achMod.checkAchievements,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
