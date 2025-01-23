"use client";

import { useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return [initialValue, () => {}];
    }
    const item = window?.localStorage?.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window?.localStorage?.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
};
