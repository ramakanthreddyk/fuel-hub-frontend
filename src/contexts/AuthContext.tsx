/**
 * @file contexts/AuthContext.tsx
 * @description Authentication context provider
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
          console.log('[AUTH-CONTEXT] User restored from storage:', parsedUser);
        } else {
          console.log('[AUTH-CONTEXT] No stored auth data found');
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
      setIsLoading(true);
      console.log('[AUTH-CONTEXT] Attempting login:', { email, isAdminLogin });
      
      const response = await authApi.login({ email, password }, isAdminLogin);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { user: authUser, token } = response;
      
      // Ensure user has required fields
      if (!authUser.id || !authUser.email || !authUser.name || !authUser.role) {
        throw new Error('Invalid user data received');
      }
      
      // Store auth data
      localStorage.setItem('fuelsync_token', token);
      localStorage.setItem('fuelsync_user', JSON.stringify(authUser));
      
      setUser(authUser);
      console.log('[AUTH-CONTEXT] Login successful:', authUser);
      
      // Navigate based on role - avoid redirecting if already on correct page
      const currentPath = location.pathname;
      
      if (authUser.role === 'superadmin') {
        if (!currentPath.startsWith('/superadmin')) {
          navigate('/superadmin/overview', { replace: true });
        }
      } else {
        // For owner, manager, attendant - go to dashboard
        if (!currentPath.startsWith('/dashboard')) {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error: any) {
      console.error('[AUTH-CONTEXT] Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('[AUTH-CONTEXT] Refreshing token');
      const response = await authApi.refreshToken();
      
      if (response && response.token) {
        localStorage.setItem('fuelsync_token', response.token);
        console.log('[AUTH-CONTEXT] Token refreshed successfully');
        
        // If user info is also returned, update it
        if (response.user) {
          localStorage.setItem('fuelsync_user', JSON.stringify(response.user));
          setUser(response.user);
        }
        
        return;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('[AUTH-CONTEXT] Token refresh error:', error);
      // If refresh fails, log out the user
      logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('[AUTH-CONTEXT] Logging out user');
      await authApi.logout();
    } catch (error) {
      console.error('[AUTH-CONTEXT] Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      setUser(null);
      // Only navigate to login if not already there
      if (!location.pathname.includes('/login') && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
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
    refreshToken
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
