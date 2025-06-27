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
  login: (email: string, password: string, forceAdminRoute?: boolean) => Promise<void>;
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
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('fuelsync_token');
        const storedUser = localStorage.getItem('fuelsync_user');
        
        if (storedToken && storedUser) {
          // Validate token by checking if it's not expired
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp > currentTime) {
              // Token is still valid
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
              console.log('[AUTH] Restored valid session');
            } else {
              // Token expired, clear storage
              console.log('[AUTH] Token expired, clearing session');
              localStorage.removeItem('fuelsync_token');
              localStorage.removeItem('fuelsync_user');
            }
          } catch (error) {
            // Invalid token format, clear storage
            console.log('[AUTH] Invalid token format, clearing session');
            localStorage.removeItem('fuelsync_token');
            localStorage.removeItem('fuelsync_user');
          }
        }
      } catch (error) {
        console.error('[AUTH] Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, forceAdminRoute: boolean = false) => {
    setIsLoading(true);
    console.log(`[FRONTEND-AUTH] Login attempt for email: ${email}`);
    console.log(`[FRONTEND-AUTH] Force admin route: ${forceAdminRoute}`);
    
    try {
      console.log('[FRONTEND-AUTH] Sending login request to API');
      const response = await authApi.login({ email, password }, forceAdminRoute);
      
      console.log('[FRONTEND-AUTH] Login response received:', {
        token: response.token ? '✓ Present' : '✗ Missing',
        user: response.user ? '✓ Present' : '✗ Missing',
        role: response.user?.role,
        isSuperAdmin: response.user?.role === 'superadmin'
      });
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('fuelsync_token', response.token);
      localStorage.setItem('fuelsync_user', JSON.stringify(response.user));
      
      // Role-based redirect with SuperAdmin flag
      console.log(`[FRONTEND-AUTH] Redirecting user with role: ${response.user.role}`);
      
      if (response.user.role === 'superadmin') {
        console.log('[FRONTEND-AUTH] 🔱 SuperAdmin detected! Using admin routes without tenant context');
        navigate('/superadmin/overview');
      } else {
        console.log('[FRONTEND-AUTH] Regular user detected, using tenant-scoped routes');
        switch (response.user.role) {
          case 'attendant':
            navigate('/dashboard/readings/new');
            break;
          default:
            navigate('/dashboard');
        }
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
