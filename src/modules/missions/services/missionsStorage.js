import { createDomainStore } from '../../../shared/storage';
import { getTodayKey } from '../../../shared/utils';

const defaultMissionTemplates = [
  { id: '1', title: 'Apply to 100 jobs', icon: '📨', target: 100, type: 'number' },
  { id: '2', title: 'Send 50 LinkedIn connections', icon: '🔗', target: 50, type: 'number' },
  { id: '3', title: 'Solve 5 DSA problems', icon: '💻', target: 5, type: 'number' },
  { id: '4', title: 'Study Python (2 hours)', icon: '🐍', target: 1, type: 'checkbox' },
  { id: '5', title: 'Study SQL (1 hour)', icon: '🗄️', target: 1, type: 'checkbox' },
  { id: '6', title: 'Mock Interview Practice', icon: '🎯', target: 1, type: 'checkbox' },
  { id: '7', title: 'Resume Improvement', icon: '📄', target: 1, type: 'checkbox' },
];

const missionsStore = createDomainStore('jhos_missions', {});
const templatesStore = createDomainStore('jhos_mission_templates', defaultMissionTemplates);

export const missionsStorage = {
  getMissions: () => missionsStore.get(),
  saveMissions: (missions) => missionsStore.set(missions),
  getTemplates: () => templatesStore.get(),
  saveTemplates: (templates) => templatesStore.set(templates),
};
