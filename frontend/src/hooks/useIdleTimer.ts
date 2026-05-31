'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useIdleTimer() {
  const { logout, isLoggedIn } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggedInRef = useRef(isLoggedIn);

  isLoggedInRef.current = isLoggedIn;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isLoggedInRef.current) logout();
    }, IDLE_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

    const handleActivity = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoggedIn, resetTimer]);

  return null;
}
