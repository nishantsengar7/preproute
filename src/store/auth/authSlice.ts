import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('tms_token');
let initialUser: User | null = null;

try {
  const userJson = localStorage.getItem('tms_user');
  if (userJson) {
    initialUser = JSON.parse(userJson);
  }
} catch (e) {
  console.error('Failed to parse user from localStorage', e);
  localStorage.removeItem('tms_user');
}

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('tms_token', action.payload.token);
      localStorage.setItem('tms_user', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
      localStorage.removeItem('tms_token');
      localStorage.removeItem('tms_user');
    },
    logout(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('tms_token');
      localStorage.removeItem('tms_user');
    },
    clearError(state) {
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
