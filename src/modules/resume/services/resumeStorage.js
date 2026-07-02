import { createDomainStore } from '../../../shared/storage';

const store = createDomainStore('jhos_resumes', []);
export const resumeStorage = {
  getAll: () => store.get(),
  saveAll: (resumes) => store.set(resumes),
};
