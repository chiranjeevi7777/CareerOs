/**
 * Applications domain storage — owns the 'jhos_applications' localStorage key.
 * No other module may read or write this key directly.
 */
import { createDomainStore } from '../../../shared/storage';

const store = createDomainStore('jhos_applications', []);

export const applicationStorage = {
  getAll: () => store.get(),
  saveAll: (applications) => store.set(applications),
};
