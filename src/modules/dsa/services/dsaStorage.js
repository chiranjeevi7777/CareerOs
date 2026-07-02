import { createDomainStore } from '../../../shared/storage';

const store = createDomainStore('jhos_dsa', []);

export const dsaStorage = {
  getAll: () => store.get(),
  saveAll: (problems) => store.set(problems),
};
