import { useState, useCallback } from 'react';

/**
 * A typed, generic hook that syncs a state value with `localStorage`.
 *
 * @param key   - localStorage key string
 * @param initialValue - fallback value when key is absent or unparseable
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const resolved = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota exceeded or private mode — silently ignore
        }
        return resolved;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
