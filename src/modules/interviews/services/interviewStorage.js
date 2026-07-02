import { createDomainStore } from '../../../shared/storage';

const store = createDomainStore('jhos_interviews', []);

export const interviewStorage = {
  getAll: () => store.get(),
  saveAll: (interviews) => store.set(interviews),
};
