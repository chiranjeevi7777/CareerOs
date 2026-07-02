import { createDomainStore } from '../../../shared/storage';
import { getTodayKey } from '../../../shared/utils';

const defaultSettings = {
  theme: 'dark',
  missionStartDate: getTodayKey(),
  missionDuration: 60,
  targetApplications: 2000,
  targetInterviews: 50,
  targetOffers: 1,
  name: 'Job Seeker',
  role: 'Software Engineer',
  notifications: true,
};

const store = createDomainStore('jhos_settings', defaultSettings);

export const settingsStorage = {
  get: () => store.get(),
  save: (settings) => store.set(settings),
};
