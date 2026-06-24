import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `target` once `start` becomes true.
 * Returns the current animated value, already rounded.
 */
export function useCountUp(target, { duration = 800, start = true, delay = 0 } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          frame.current = requestAnimationFrame(tick);
        }
      }
      frame.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, start, delay]);

  return value;
}
