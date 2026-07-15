import { useState, useCallback } from 'react';
import { skillsStorage } from '../services/skillsStorage';
import { genId } from '../../../shared/utils';

/**
 * Skills module hook — skill tracker CRUD.
 */
export const useSkills = () => {
  const [skills, setSkills] = useState(() => skillsStorage.getAll());

  const persist = useCallback((updated) => {
    setSkills(updated);
    skillsStorage.saveAll(updated);
  }, []);

  const addSkill = useCallback((skill) => {
    persist([...skills, { ...skill, id: genId() }]);
  }, [skills, persist]);

  const updateSkill = useCallback((id, data) => {
    persist(skills.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, [skills, persist]);

  const deleteSkill = useCallback((id) => {
    persist(skills.filter((s) => s.id !== id));
  }, [skills, persist]);

  return { skills, addSkill, updateSkill, deleteSkill };
};
