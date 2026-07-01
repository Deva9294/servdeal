import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  city?: string;
  referralCode?: string;
  location?: { lat: number; lng: number };
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isInitializing: boolean;
};

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    // Try cookie first, then localStorage
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    return getCookie('token') || localStorage.getItem('token');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitializing = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        // Also set cookie for consistency with backend
        const isProd = process.env.NODE_ENV === 'production';
        document.cookie = `token=${action.payload.token}; path=/; max-age=${7 * 24 * 60 * 60}; ${isProd ? 'secure; samesite=none' : 'samesite=lax'}`;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isInitializing = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, updateUser, logout, finishInitializing } = authSlice.actions;
export default authSlice.reducer;
