import { useState, useCallback } from 'react';
import { interviewStorage } from '../services/interviewStorage';
import { genId } from '../../../shared/utils';

/**
 * Interviews module hook — real interview log CRUD.
 * (Mock interview AI session state lives in AICopilot page directly.)
 */
export const useInterviews = () => {
  const [interviews, setInterviews] = useState(() => interviewStorage.getAll());

  const persist = useCallback((updated) => {
    setInterviews(updated);
    interviewStorage.saveAll(updated);
  }, []);

  const addInterview = useCallback((interview) => {
    const newInterview = { ...interview, id: genId(), createdAt: new Date().toISOString() };
    persist([newInterview, ...interviews]);
    return newInterview;
  }, [interviews, persist]);

  const updateInterview = useCallback((id, data) => {
    persist(interviews.map((i) => (i.id === id ? { ...i, ...data } : i)));
  }, [interviews, persist]);

  const deleteInterview = useCallback((id) => {
    persist(interviews.filter((i) => i.id !== id));
  }, [interviews, persist]);

  return { interviews, addInterview, updateInterview, deleteInterview };
};
