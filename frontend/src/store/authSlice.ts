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
    return localStorage.getItem('token');
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
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, updateUser, logout, finishInitializing } = authSlice.actions;
export default authSlice.reducer;
