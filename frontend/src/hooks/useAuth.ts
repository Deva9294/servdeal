'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { logout as logoutAction } from '@/store/authSlice';
import api from '@/lib/api';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isInitializing } = useSelector((s: RootState) => s.auth);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    dispatch(logoutAction());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
  };

  return { user, token, isLoggedIn: Boolean(token), isInitializing, logout };
}
