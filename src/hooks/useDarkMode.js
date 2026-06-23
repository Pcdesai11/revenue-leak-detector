import { useEffect, useState } from 'react';

/**
 * Manages dark mode by toggling a `.dark` class on <html>.
 * Defaults to the user's system preference, then can be toggled manually.
 * State lives in memory only (no persistence) — it resets on page reload.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, setIsDark];
}
