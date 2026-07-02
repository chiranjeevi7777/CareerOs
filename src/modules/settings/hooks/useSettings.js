import { useState, useCallback } from 'react';
import { settingsStorage } from '../services/settingsStorage';

export const useSettings = () => {
  const [settings, setSettings] = useState(() => settingsStorage.get());

  const updateSettings = useCallback((data) => {
    const updated = { ...settings, ...data };
    setSettings(updated);
    settingsStorage.save(updated);
    return updated;
  }, [settings]);

  return { settings, updateSettings };
};
