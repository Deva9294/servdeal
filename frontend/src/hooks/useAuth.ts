'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export function useAuth() {
  const { user, token } = useSelector((s: RootState) => s.auth);
  return { user, token, isLoggedIn: Boolean(token) };
}
