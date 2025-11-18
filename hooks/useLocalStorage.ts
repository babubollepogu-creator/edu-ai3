
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// FIX: Import Dispatch and SetStateAction from react to resolve namespace error.
function useLocalStorage<T>(key: string | null, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !key) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (key) {
      try {
        if (storedValue === null || storedValue === undefined) {
          window.localStorage.removeItem(key);
        } else {
          const valueToStore = JSON.stringify(storedValue);
          window.localStorage.setItem(key, valueToStore);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
