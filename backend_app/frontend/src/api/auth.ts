import { api } from './axios';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<any> => {
    const response = await api.post('/usuarios/registro', data);
    return response.data;
  },
};