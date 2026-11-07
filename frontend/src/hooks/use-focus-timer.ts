import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

export function useFocusTimer(initialSeconds = 25 * 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return {
    time: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
    running,
    toggle: () => setRunning((r) => !r),
    reset: () => { setRunning(false); setSeconds(initialSeconds); },
  };
}