import { createDomainStore } from '../../../shared/storage';

const defaultSkills = [
  { id: '1', name: 'Python', category: 'Programming', progress: 65, status: 'Learning', color: '#3b82f6' },
  { id: '2', name: 'Java', category: 'Programming', progress: 45, status: 'Learning', color: '#f59e0b' },
  { id: '3', name: 'JavaScript', category: 'Programming', progress: 70, status: 'Practicing', color: '#eab308' },
  { id: '4', name: 'C++', category: 'Programming', progress: 55, status: 'Learning', color: '#6366f1' },
  { id: '5', name: 'SQL', category: 'Databases', progress: 60, status: 'Practicing', color: '#10b981' },
  { id: '6', name: 'PostgreSQL', category: 'Databases', progress: 35, status: 'Learning', color: '#06b6d4' },
  { id: '7', name: 'MongoDB', category: 'Databases', progress: 30, status: 'Learning', color: '#22c55e' },
  { id: '8', name: 'React', category: 'Web Development', progress: 75, status: 'Practicing', color: '#38bdf8' },
  { id: '9', name: 'Node.js', category: 'Web Development', progress: 50, status: 'Learning', color: '#84cc16' },
  { id: '10', name: 'HTML', category: 'Web Development', progress: 90, status: 'Interview Ready', color: '#f97316' },
  { id: '11', name: 'CSS', category: 'Web Development', progress: 80, status: 'Practicing', color: '#8b5cf6' },
  { id: '12', name: 'DBMS', category: 'Core Subjects', progress: 55, status: 'Practicing', color: '#ec4899' },
  { id: '13', name: 'OOP', category: 'Core Subjects', progress: 70, status: 'Practicing', color: '#f43f5e' },
  { id: '14', name: 'Operating Systems', category: 'Core Subjects', progress: 40, status: 'Learning', color: '#14b8a6' },
  { id: '15', name: 'Computer Networks', category: 'Core Subjects', progress: 35, status: 'Learning', color: '#a855f7' },
];

const store = createDomainStore('jhos_skills', defaultSkills);

export const skillsStorage = {
  getAll: () => store.get(),
  saveAll: (skills) => store.set(skills),
};
