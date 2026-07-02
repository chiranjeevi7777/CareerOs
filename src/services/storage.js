// Centralized Local Storage Service for Job Hunt OS

const KEYS = {
  APPLICATIONS: 'jhos_applications',
  INTERVIEWS: 'jhos_interviews',
  NETWORKING: 'jhos_networking',
  DSA: 'jhos_dsa',
  SKILLS: 'jhos_skills',
  RESUMES: 'jhos_resumes',
  TIMETABLE: 'jhos_timetable',
  MISSIONS: 'jhos_missions',
  SETTINGS: 'jhos_settings',
  MISSION_START_DATE: 'jhos_mission_start',
  ACHIEVEMENTS: 'jhos_achievements',
};

const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Applications
export const getApplications = () => getItem(KEYS.APPLICATIONS, []);
export const saveApplications = (apps) => setItem(KEYS.APPLICATIONS, apps);

// Interviews
export const getInterviews = () => getItem(KEYS.INTERVIEWS, []);
export const saveInterviews = (interviews) => setItem(KEYS.INTERVIEWS, interviews);

// Networking
export const getNetworking = () => getItem(KEYS.NETWORKING, []);
export const saveNetworking = (contacts) => setItem(KEYS.NETWORKING, contacts);

// DSA
export const getDSA = () => getItem(KEYS.DSA, []);
export const saveDSA = (problems) => setItem(KEYS.DSA, problems);

// Skills
const defaultSkills = [
  // Programming
  { id: '1', name: 'Python', category: 'Programming', progress: 65, status: 'Learning', color: '#3b82f6' },
  { id: '2', name: 'Java', category: 'Programming', progress: 45, status: 'Learning', color: '#f59e0b' },
  { id: '3', name: 'JavaScript', category: 'Programming', progress: 70, status: 'Practicing', color: '#eab308' },
  { id: '4', name: 'C++', category: 'Programming', progress: 55, status: 'Learning', color: '#6366f1' },
  // Databases
  { id: '5', name: 'SQL', category: 'Databases', progress: 60, status: 'Practicing', color: '#10b981' },
  { id: '6', name: 'PostgreSQL', category: 'Databases', progress: 35, status: 'Learning', color: '#06b6d4' },
  { id: '7', name: 'MongoDB', category: 'Databases', progress: 30, status: 'Learning', color: '#22c55e' },
  // Web Development
  { id: '8', name: 'React', category: 'Web Development', progress: 75, status: 'Practicing', color: '#38bdf8' },
  { id: '9', name: 'Node.js', category: 'Web Development', progress: 50, status: 'Learning', color: '#84cc16' },
  { id: '10', name: 'HTML', category: 'Web Development', progress: 90, status: 'Interview Ready', color: '#f97316' },
  { id: '11', name: 'CSS', category: 'Web Development', progress: 80, status: 'Practicing', color: '#8b5cf6' },
  // Core Subjects
  { id: '12', name: 'DBMS', category: 'Core Subjects', progress: 55, status: 'Practicing', color: '#ec4899' },
  { id: '13', name: 'OOP', category: 'Core Subjects', progress: 70, status: 'Practicing', color: '#f43f5e' },
  { id: '14', name: 'Operating Systems', category: 'Core Subjects', progress: 40, status: 'Learning', color: '#14b8a6' },
  { id: '15', name: 'Computer Networks', category: 'Core Subjects', progress: 35, status: 'Learning', color: '#a855f7' },
];
export const getSkills = () => getItem(KEYS.SKILLS, defaultSkills);
export const saveSkills = (skills) => setItem(KEYS.SKILLS, skills);

// Resumes
export const getResumes = () => getItem(KEYS.RESUMES, []);
export const saveResumes = (resumes) => setItem(KEYS.RESUMES, resumes);

// Timetable
const defaultTimetable = [
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
];
export const getTimetable = () => getItem(KEYS.TIMETABLE, defaultTimetable);
export const saveTimetable = (timetable) => setItem(KEYS.TIMETABLE, timetable);

// Missions
const defaultMissionTemplates = [
  { id: '1', title: 'Apply to 100 jobs', icon: '📨', target: 100, type: 'number' },
  { id: '2', title: 'Send 50 LinkedIn connections', icon: '🔗', target: 50, type: 'number' },
  { id: '3', title: 'Solve 5 DSA problems', icon: '💻', target: 5, type: 'number' },
  { id: '4', title: 'Study Python (2 hours)', icon: '🐍', target: 1, type: 'checkbox' },
  { id: '5', title: 'Study SQL (1 hour)', icon: '🗄️', target: 1, type: 'checkbox' },
  { id: '6', title: 'Mock Interview Practice', icon: '🎯', target: 1, type: 'checkbox' },
  { id: '7', title: 'Resume Improvement', icon: '📄', target: 1, type: 'checkbox' },
];
export const getMissionTemplates = () => getItem('jhos_mission_templates', defaultMissionTemplates);
export const saveMissionTemplates = (templates) => setItem('jhos_mission_templates', templates);

export const getMissions = () => getItem(KEYS.MISSIONS, {});
export const saveMissions = (missions) => setItem(KEYS.MISSIONS, missions);

// Settings
const defaultSettings = {
  theme: 'dark',
  missionStartDate: new Date().toISOString().split('T')[0],
  missionDuration: 60,
  targetApplications: 2000,
  targetInterviews: 50,
  targetOffers: 1,
  name: 'Job Seeker',
  role: 'Software Engineer',
  notifications: true,
};
export const getSettings = () => getItem(KEYS.SETTINGS, defaultSettings);
export const saveSettings = (settings) => setItem(KEYS.SETTINGS, settings);

// Mission Start Date
export const getMissionStartDate = () => {
  const settings = getSettings();
  return settings.missionStartDate || new Date().toISOString().split('T')[0];
};

// Achievements
const defaultAchievements = [
  { id: 'first_app', title: 'First Step', description: 'Sent your first application', icon: '🚀', earned: false, earnedDate: null },
  { id: 'apps_10', title: 'Getting Started', description: '10 applications sent', icon: '📨', earned: false, earnedDate: null },
  { id: 'apps_50', title: 'On a Roll', description: '50 applications sent', icon: '🔥', earned: false, earnedDate: null },
  { id: 'apps_100', title: 'Century Club', description: '100 applications sent', icon: '💯', earned: false, earnedDate: null },
  { id: 'apps_500', title: 'Half Thousand', description: '500 applications sent', icon: '⚡', earned: false, earnedDate: null },
  { id: 'apps_1000', title: 'Thousand Strong', description: '1000 applications sent', icon: '🏆', earned: false, earnedDate: null },
  { id: 'first_interview', title: 'Interview Ready', description: 'Landed your first interview', icon: '🎯', earned: false, earnedDate: null },
  { id: 'first_offer', title: 'Offer Received!', description: 'Got your first job offer', icon: '🎉', earned: false, earnedDate: null },
  { id: 'streak_3', title: '3-Day Streak', description: 'Completed missions 3 days in a row', icon: '🌟', earned: false, earnedDate: null },
  { id: 'streak_7', title: 'Week Warrior', description: 'Completed missions 7 days in a row', icon: '⚔️', earned: false, earnedDate: null },
  { id: 'streak_30', title: 'Monthly Champion', description: '30-day mission streak', icon: '👑', earned: false, earnedDate: null },
  { id: 'dsa_10', title: 'Coder Awakens', description: 'Solved 10 DSA problems', icon: '💻', earned: false, earnedDate: null },
  { id: 'dsa_50', title: 'Algorithm Adept', description: 'Solved 50 DSA problems', icon: '🧠', earned: false, earnedDate: null },
  { id: 'dsa_100', title: 'LeetCode Legend', description: 'Solved 100 DSA problems', icon: '⚡', earned: false, earnedDate: null },
  { id: 'network_50', title: 'Connected', description: 'Built a network of 50 contacts', icon: '🌐', earned: false, earnedDate: null },
];
export const getAchievements = () => getItem(KEYS.ACHIEVEMENTS, defaultAchievements);
export const saveAchievements = (achievements) => setItem(KEYS.ACHIEVEMENTS, achievements);

// Export all data as JSON backup
export const exportAllData = () => {
  return {
    applications: getApplications(),
    interviews: getInterviews(),
    networking: getNetworking(),
    dsa: getDSA(),
    skills: getSkills(),
    resumes: getResumes(),
    timetable: getTimetable(),
    missions: getMissions(),
    settings: getSettings(),
    achievements: getAchievements(),
    exportDate: new Date().toISOString(),
  };
};

// Import data from JSON backup
export const importAllData = (data) => {
  if (data.applications) saveApplications(data.applications);
  if (data.interviews) saveInterviews(data.interviews);
  if (data.networking) saveNetworking(data.networking);
  if (data.dsa) saveDSA(data.dsa);
  if (data.skills) saveSkills(data.skills);
  if (data.resumes) saveResumes(data.resumes);
  if (data.timetable) saveTimetable(data.timetable);
  if (data.missions) saveMissions(data.missions);
  if (data.settings) saveSettings(data.settings);
  if (data.achievements) saveAchievements(data.achievements);
};

// Generate unique ID
export const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

// Get today key
export const getTodayKey = () => new Date().toISOString().split('T')[0];
