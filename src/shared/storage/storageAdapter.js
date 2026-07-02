/**
 * Domain-agnostic localStorage adapter.
 *
 * Usage per module:
 *   import { createDomainStore } from '../../shared/storage/storageAdapter';
 *   const applicationsStore = createDomainStore('jhos_applications', []);
 *   applicationsStore.get();
 *   applicationsStore.set([...]);
 */

const parse = (raw, fallback) => {
  try {
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const read = (key, fallback = null) => {
  try {
    return parse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[storageAdapter] Failed to write key "${key}":`, e);
  }
};

/**
 * Creates a scoped store for a single domain entity.
 * @param {string} key       - localStorage key
 * @param {*} defaultValue   - value returned when key is absent
 */
export const createDomainStore = (key, defaultValue) => ({
  key,
  get: () => read(key, defaultValue),
  set: (value) => write(key, value),
  clear: () => localStorage.removeItem(key),
});

/** Export raw primitives for advanced use (e.g. import/export all data). */
export const storageRead = read;
export const storageWrite = write;
