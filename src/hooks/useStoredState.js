import { useCallback, useState } from "react";

export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const update = useCallback((next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // The demo remains usable when storage is unavailable or full.
      }
      return resolved;
    });
  }, [key]);

  return [value, update];
}
