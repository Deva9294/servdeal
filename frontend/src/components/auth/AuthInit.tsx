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
      .catch(() => dispatch(logout()));
  }, [dispatch]);

  return null;
}
