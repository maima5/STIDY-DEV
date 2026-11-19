import { createContext, ReactNode, useContext } from 'react';
import TimeUpModal from '@/components/focus/TimeUpModal';
import { usePomodoro } from '@/hooks/use-pomodoro';

type Ctx = ReturnType<typeof usePomodoro>;

const FocusContext = createContext<Ctx | null>(null);

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus harus dipakai di dalam FocusProvider');
  return ctx;
}

/**
 * Satu timer pomodoro untuk seluruh aplikasi, sehingga kartu "Mode Fokus" di beranda
 * dan halaman Waktu Fokus selalu sinkron dan timer tetap jalan saat berpindah halaman.
 */
export function FocusProvider({ children }: { children: ReactNode }) {
  const pomodoro = usePomodoro();
  return (
    <FocusContext.Provider value={pomodoro}>
      {children}
      <TimeUpModal
        finish={pomodoro.finish}
        nextSession={pomodoro.session + 1}
        onContinue={() => pomodoro.advance(true)}
        onLater={() => pomodoro.advance(false)}
      />
    </FocusContext.Provider>
  );
}
