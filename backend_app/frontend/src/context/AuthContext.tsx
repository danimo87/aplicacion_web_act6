import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
  user: { nombre: string; apellido: string; rol: string } | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ nombre: string; apellido: string; rol: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('usuario');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response: AuthResponse = await authApi.login(credentials);
    const { access_token, usuario } = response;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    setToken(access_token);
    setUser(usuario);
  };

  const register = async (data: RegisterData): Promise<void> => {
    await authApi.register(data);
  };

  const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const userRole = user?.rol || null;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
