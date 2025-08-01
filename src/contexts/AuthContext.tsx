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
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('fuelsync_token');
  const isAuthenticated = !!user && !!token;

  // Initialize auth state on mount
  useEffect(() => {
    if (initialized) return;

    const initializeAuth = async () => {
      try {
        console.log('[AUTH-CONTEXT] Initializing auth...');
        const token = localStorage.getItem('fuelsync_token');
        const storedUser = localStorage.getItem('fuelsync_user');

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role && ['superadmin', 'owner', 'manager', 'attendant'].includes(parsedUser.role)) {
            setUser(parsedUser as User);
            console.log('[AUTH-CONTEXT] User restored from storage:', parsedUser);
          } else {
            console.error('[AUTH-CONTEXT] Invalid user role:', parsedUser.role);
            localStorage.removeItem('fuelsync_token');
            localStorage.removeItem('fuelsync_user');
          }
        } else {
          console.log('[AUTH-CONTEXT] No stored credentials found');
        }
      } catch (error) {
        console.error('[AUTH-CONTEXT] Error initializing auth:', error);
        localStorage.removeItem('fuelsync_token');
        localStorage.removeItem('fuelsync_user');
        setUser(null);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    // Listen for auth expiration events from API client
    const handleAuthExpired = () => {
      console.log('[AUTH-CONTEXT] Auth expired event received');
      setUser(null);
      setIsLoading(false);
      setInitialized(true);
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    // Initialize immediately, no delay needed
    initializeAuth();

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [initialized]);

  const login = async (email: string, password: string, isAdminLogin = false) => {
    try {
      setIsLoading(true);
      console.log('[AUTH-CONTEXT] Attempting login:', { email, isAdminLogin });
      
      const response = await authApi.login({ email, password }, isAdminLogin);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { user: authUser, token } = response;
      
      if (!authUser.id || !authUser.email || !authUser.name || !authUser.role) {
        throw new Error('Invalid user data received');
      }
      
      if (!['superadmin', 'owner', 'manager', 'attendant'].includes(authUser.role)) {
        throw new Error('Invalid user role received');
      }
      
      localStorage.setItem('fuelsync_token', token);
      localStorage.setItem('fuelsync_user', JSON.stringify(authUser));
      
      setUser(authUser as User);
      console.log('[AUTH-CONTEXT] Login successful:', authUser);
      
      // Let App.tsx handle navigation based on user role
      console.log('[AUTH-CONTEXT] User authenticated, letting App.tsx handle navigation');
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
        
        if (response.user && ['superadmin', 'owner', 'manager', 'attendant'].includes(response.user.role)) {
          localStorage.setItem('fuelsync_user', JSON.stringify(response.user));
          setUser(response.user as User);
        }
        
        return;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('[AUTH-CONTEXT] Token refresh error:', error);
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
    } finally {
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      setUser(null);
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
