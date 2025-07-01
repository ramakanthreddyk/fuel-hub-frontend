
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

export type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string, isAdminLogin?: boolean) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('fuelsync_token');
  const isAuthenticated = !!user && !!token;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('fuelsync_token');
        const storedUser = localStorage.getItem('fuelsync_user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('[AUTH-CONTEXT] Error initializing auth:', error);
        localStorage.removeItem('fuelsync_token');
        localStorage.removeItem('fuelsync_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, isAdminLogin = false) => {
    try {
      const response = await authApi.login({ email, password }, isAdminLogin);
      
      const { user: authUser, token } = response;
      
      // Store auth data
      localStorage.setItem('fuelsync_token', token);
      localStorage.setItem('fuelsync_user', JSON.stringify(authUser));
      
      setUser(authUser);
      
      // Navigate based on role
      if (authUser.role === 'superadmin') {
        navigate('/superadmin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('[AUTH-CONTEXT] Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('[AUTH-CONTEXT] Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  const getCurrentUser = () => {
    return user;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    token,
    login,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
