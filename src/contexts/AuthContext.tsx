
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/v1/auth/login', { email, password });
      
      // Mock login for now
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: email.includes('admin') ? 'superadmin' : 'owner',
        tenantId: email.includes('admin') ? undefined : 'tenant-1',
        tenantName: email.includes('admin') ? undefined : 'Reddy Fuels'
      };
      
      const mockToken = 'mock-jwt-token-123';
      
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('fuelsync_token', mockToken);
      localStorage.setItem('fuelsync_user', JSON.stringify(mockUser));
      
      // Role-based redirect
      switch (mockUser.role) {
        case 'superadmin':
          navigate('/superadmin/tenants');
          break;
        case 'attendant':
          navigate('/dashboard/readings');
          break;
        default:
          navigate('/dashboard/stations');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
    navigate('/');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
