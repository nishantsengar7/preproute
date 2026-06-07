import api from './api';
import type { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  login: async (credentials: Record<string, string>): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/auth/login', credentials);
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    return api.post('/auth/logout');
  },
  
  getMe: async (): Promise<ApiResponse<User>> => {
    return api.get('/auth/me');
  }
};

export default authService;
