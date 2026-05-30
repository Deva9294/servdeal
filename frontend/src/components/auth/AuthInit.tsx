'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/lib/api';
import { setCredentials, logout } from '@/store/authSlice';

export function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api
      .get('/auth/me')
      .then(({ data }) => {
        dispatch(setCredentials({ user: data.user, token }));
      })
      .catch((err) => {
        // Only logout on actual 401 auth failure, not on network/API errors
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 401) {
          dispatch(logout());
        }
        // For network errors (wrong API URL, backend down), keep token for retry
      });
  }, [dispatch]);

  return null;
}
