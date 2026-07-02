import { useState, useCallback } from 'react';
import { networkingStorage } from '../services/networkingStorage';
import { genId } from '../../../shared/utils';

/**
 * Networking module hook — all contact CRUD and persistence.
 */
export const useNetworking = () => {
  const [networking, setNetworking] = useState(() => networkingStorage.getAll());

  const persist = useCallback((updated) => {
    setNetworking(updated);
    networkingStorage.saveAll(updated);
  }, []);

  const addContact = useCallback((contact) => {
    const newContact = { ...contact, id: genId(), createdAt: new Date().toISOString() };
    persist([newContact, ...networking]);
    return newContact;
  }, [networking, persist]);

  const updateContact = useCallback((id, data) => {
    persist(networking.map((n) => (n.id === id ? { ...n, ...data } : n)));
  }, [networking, persist]);

  const deleteContact = useCallback((id) => {
    persist(networking.filter((n) => n.id !== id));
  }, [networking, persist]);

  return { networking, addContact, updateContact, deleteContact };
};
