import { createDomainStore } from '../../../shared/storage';

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

const store = createDomainStore('jhos_achievements', defaultAchievements);

export const achievementsStorage = {
  getAll: () => store.get(),
  saveAll: (achievements) => store.set(achievements),
};
