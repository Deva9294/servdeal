'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/lib/api';
import { setCredentials, logout, finishInitializing } from '@/store/authSlice';

export function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check cookie first, then localStorage
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const token = getCookie('token') || localStorage.getItem('token');
    if (!token) {
      dispatch(finishInitializing());
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        dispatch(setCredentials({ user: data.user, token }));
      })
      .catch((err) => {
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 401) {
          dispatch(logout());
        } else {
          dispatch(finishInitializing());
        }
      });
  }, [dispatch]);

  return null;
}
