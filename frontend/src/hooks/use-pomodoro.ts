import { useEffect, useRef, useState } from 'react';
import { FocusFinish, FocusPhase, FocusSettings } from '@/types/focus';

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = { focusMinutes: 25, breakMinutes: 10, sessions: 4 };

const pad = (n: number) => String(n).padStart(2, '0');
const durationOf = (phase: FocusPhase, s: FocusSettings) =>
  (phase === 'focus' ? s.focusMinutes : s.breakMinutes) * 60;

/** Timer pomodoro: fokus → istirahat → sesi berikutnya, sampai target sesi tercapai. */
export function usePomodoro(initial: FocusSettings = DEFAULT_FOCUS_SETTINGS) {
  const [settings, setSettings] = useState(initial);
  const [phase, setPhase] = useState<FocusPhase>('focus');
  const [session, setSession] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(durationOf('focus', initial));
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  // Waktu selesai (epoch ms) — dihitung dari jam, bukan dari jumlah tick, agar tidak melenceng
  const endsAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        setRunning(false);
        setFinished(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  const start = (seconds: number) => {
    endsAt.current = Date.now() + seconds * 1000;
    setRunning(true);
  };

  const toggle = () => {
    if (finished || secondsLeft === 0) return;
    if (running) {
      setSecondsLeft(Math.max(1, Math.ceil((endsAt.current - Date.now()) / 1000)));
      setRunning(false);
    } else {
      start(secondsLeft);
    }
  };

  /** Mengulang hitung mundur fase yang sedang berjalan. */
  const reset = () => {
    setRunning(false);
    setFinished(false);
    setSecondsLeft(durationOf(phase, settings));
  };

  const isLastFocus = phase === 'focus' && session >= settings.sessions;
  const finish: FocusFinish | null = !finished ? null : isLastFocus ? 'all-done' : phase === 'focus' ? 'focus-end' : 'break-end';

  /** Pindah ke fase berikutnya setelah waktu habis; `autoStart` langsung menjalankannya. */
  const advance = (autoStart: boolean) => {
    const nextPhase: FocusPhase = isLastFocus || phase === 'break' ? 'focus' : 'break';
    const nextSession = isLastFocus ? 1 : phase === 'break' ? session + 1 : session;
    const seconds = durationOf(nextPhase, settings);
    setPhase(nextPhase);
    setSession(nextSession);
    setSecondsLeft(seconds);
    setFinished(false);
    if (autoStart && !isLastFocus) start(seconds);
  };

  /** Menyimpan durasi baru dan mengulang hitung mundur fase saat ini. */
  const saveSettings = (next: FocusSettings) => {
    setSettings(next);
    setSession((s) => Math.min(s, next.sessions));
    setRunning(false);
    setFinished(false);
    setSecondsLeft(durationOf(phase, next));
  };

  return {
    settings,
    phase,
    session,
    secondsLeft,
    time: `${pad(Math.floor(secondsLeft / 60))}:${pad(secondsLeft % 60)}`,
    running,
    /** Belum pernah dijalankan pada fase ini */
    idle: !running && secondsLeft === durationOf(phase, settings),
    finish,
    toggle,
    reset,
    advance,
    saveSettings,
  };
}
