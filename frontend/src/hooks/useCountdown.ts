/**
 * useCountdown Hook
 *
 * Countdown timer for OTP validity and resend cooldown.
 * Returns remaining seconds and control functions.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCountdownReturn {
  /** Remaining seconds */
  secondsLeft: number;
  /** Whether the countdown is currently active */
  isActive: boolean;
  /** Start the countdown with a given duration in seconds */
  start: (durationSeconds: number) => void;
  /** Stop the countdown */
  stop: () => void;
  /** Reset the countdown to 0 and stop */
  reset: () => void;
}

export function useCountdown(): UseCountdownReturn {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (durationSeconds: number) => {
      clearTimer();
      setSecondsLeft(durationSeconds);
      setIsActive(true);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer],
  );

  const stop = useCallback(() => {
    clearTimer();
    setIsActive(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsLeft(0);
    setIsActive(false);
  }, [clearTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { secondsLeft, isActive, start, stop, reset };
}
