import { useState, useCallback } from 'react';
import { resumeStorage } from '../services/resumeStorage';
import { genId } from '../../../shared/utils';

export const useResumes = () => {
  const [resumes, setResumes] = useState(() => resumeStorage.getAll());

  const persist = useCallback((updated) => {
    setResumes(updated);
    resumeStorage.saveAll(updated);
  }, []);

  const addResume = useCallback((resume) => {
    const newResume = { ...resume, id: genId(), dateAdded: new Date().toISOString() };
    persist([newResume, ...resumes]);
    return newResume;
  }, [resumes, persist]);

  const updateResume = useCallback((id, data) => {
    persist(resumes.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, [resumes, persist]);

  const deleteResume = useCallback((id) => {
    persist(resumes.filter((r) => r.id !== id));
  }, [resumes, persist]);

  return { resumes, addResume, updateResume, deleteResume };
};
