import { useEffect, useState } from 'react';
import { getTimeParts, TimeParts } from '@/utils/time';

/**
 * Custom hook: live countdown yang di-update setiap detik.
 * @param deadline - target tanggal/waktu
 */
export function useCountdown(deadline: Date): TimeParts {
  const [parts, setParts] = useState<TimeParts>(getTimeParts(deadline));

  useEffect(() => {
    // langsung update supaya tidak menunggu 1 detik pertama
    setParts(getTimeParts(deadline));

    const id = setInterval(() => {
      setParts(getTimeParts(deadline));
    }, 1000);

    return () => clearInterval(id);
  }, [deadline.getTime()]);

  return parts;
}

