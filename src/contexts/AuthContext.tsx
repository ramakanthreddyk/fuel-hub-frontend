
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

export type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth on app load
    const storedToken = localStorage.getItem('fuelsync_token');
    const storedUser = localStorage.getItem('fuelsync_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log(`[FRONTEND-AUTH] Login attempt for email: ${email}`);
    
    try {
      console.log('[FRONTEND-AUTH] Sending login request to API');
      const response = await authApi.login({ email, password });
      
      console.log('[FRONTEND-AUTH] Login response received:', {
        token: response.token ? '✓ Present' : '✗ Missing',
        user: response.user ? '✓ Present' : '✗ Missing',
        role: response.user?.role
      });
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('fuelsync_token', response.token);
      localStorage.setItem('fuelsync_user', JSON.stringify(response.user));
      
      // Role-based redirect
      console.log(`[FRONTEND-AUTH] Redirecting user with role: ${response.user.role}`);
      switch (response.user.role) {
        case 'superadmin':
          navigate('/superadmin/overview');
          break;
        case 'attendant':
          navigate('/dashboard/readings/new');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('[FRONTEND-AUTH] Login failed:', error);
      console.log('[FRONTEND-AUTH] Error details:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fuelsync_token');
    localStorage.removeItem('fuelsync_user');
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    setUser,
    setToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
