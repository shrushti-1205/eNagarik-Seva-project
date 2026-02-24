import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Role } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string, role: Role) => Promise<{ success: boolean; reason?: 'INVALID_CREDENTIALS' | 'NOT_VERIFIED' }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (emailOrPhone: string, password: string, role: Role): Promise<{ success: boolean; reason?: 'INVALID_CREDENTIALS' | 'NOT_VERIFIED' }> => {
    setIsLoading(true);
    try {
      let loggedInUser: User | null = null;
      if (role === Role.ADMIN) {
        loggedInUser = await apiService.loginAdmin(emailOrPhone, password);
      } else {
        loggedInUser = await apiService.loginUser(emailOrPhone, password);
      }
      
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return { success: true };
      }
      return { success: false, reason: 'INVALID_CREDENTIALS' };
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_VERIFIED') {
        return { success: false, reason: 'NOT_VERIFIED' };
      }
      console.error("Login failed:", error);
      return { success: false, reason: 'INVALID_CREDENTIALS' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};