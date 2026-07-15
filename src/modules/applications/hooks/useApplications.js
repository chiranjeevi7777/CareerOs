import { useState, useCallback } from 'react';
import { applicationStorage } from '../services/applicationStorage';
import { genId } from '../../../shared/utils';

/**
 * All application business logic lives here.
 * This hook is the ONLY way to read or mutate application data.
 *
 * @returns {{ applications, addApplication, updateApplication, deleteApplication }}
 */
export const useApplications = () => {
  const [applications, setApplications] = useState(() => applicationStorage.getAll());

  const persist = useCallback((updated) => {
    setApplications(updated);
    applicationStorage.saveAll(updated);
  }, []);

  const addApplication = useCallback((app) => {
    const newApp = { ...app, id: genId(), createdAt: new Date().toISOString() };
    persist([newApp, ...applications]);
    return newApp;
  }, [applications, persist]);

  const updateApplication = useCallback((id, data) => {
    persist(applications.map((a) => (a.id === id ? { ...a, ...data } : a)));
  }, [applications, persist]);

  const deleteApplication = useCallback((id) => {
    persist(applications.filter((a) => a.id !== id));
  }, [applications, persist]);

  const setAllApplications = useCallback((apps) => {
    persist(apps);
  }, [persist]);

  return { applications, addApplication, updateApplication, deleteApplication, setAllApplications };
};

