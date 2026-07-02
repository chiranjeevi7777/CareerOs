import { createDomainStore } from '../../../shared/storage';

const store = createDomainStore('jhos_networking', []);

export const networkingStorage = {
  getAll: () => store.get(),
  saveAll: (contacts) => store.set(contacts),
};
