import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for reading and writing to localStorage safely.
 * Handles SSR environments and private browsing mode exceptions.
 * 
 * @param {string} key - LocalStorage key
 * @param {any} initialValue - Fallback initial value
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback((value) => {
    try {
      setStoredValue((currentVal) => {
        const valueToStore = value instanceof Function ? value(currentVal) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
