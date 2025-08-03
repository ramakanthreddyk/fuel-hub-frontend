/**
 * @file useSessionHandler.ts
 * @description Custom hook for handling session expiration and authentication errors
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionHandlerOptions {
  redirectTo?: string;
  showToast?: boolean;
  requiredRole?: string;
}

export function useSessionHandler(options: SessionHandlerOptions = {}) {
  const { 
    redirectTo = '/login', 
    showToast = true, 
    requiredRole 
  } = options;
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSessionExpired = (error?: any) => {
    if (showToast) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
    }
    
    logout();
    navigate(redirectTo);
  };

  const handleUnauthorized = (currentRole?: string) => {
    if (showToast) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page. Required role: ${requiredRole}`,
        variant: "destructive",
      });
    }
    
    // Redirect based on current role
    if (currentRole === 'superadmin') {
      navigate('/superadmin/overview');
    } else if (currentRole) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const checkError = (error: any) => {
    if (!error) return false;
    
    // Check for 401 Unauthorized (session expired)
    if (error?.response?.status === 401 || error?.status === 401) {
      handleSessionExpired(error);
      return true;
    }
    
    // Check for 403 Forbidden (insufficient permissions)
    if (error?.response?.status === 403 || error?.status === 403) {
      handleUnauthorized(user?.role);
      return true;
    }
    
    return false;
  };

  const checkAuth = () => {
    // Check if user is authenticated
    if (!user) {
      handleSessionExpired();
      return false;
    }
    
    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      handleUnauthorized(user.role);
      return false;
    }
    
    return true;
  };

  // Auto-check authentication on mount and user changes
  useEffect(() => {
    if (requiredRole) {
      checkAuth();
    }
  }, [user, requiredRole]);

  return {
    user,
    checkError,
    checkAuth,
    handleSessionExpired,
    handleUnauthorized,
    isAuthenticated: !!user,
    hasRequiredRole: !requiredRole || user?.role === requiredRole
  };
}

/**
 * Hook specifically for SuperAdmin pages
 */
export function useSuperAdminSession() {
  return useSessionHandler({
    requiredRole: 'superadmin',
    redirectTo: '/login',
    showToast: true
  });
}

/**
 * Hook for handling API errors with session management
 */
export function useApiErrorHandler() {
  const sessionHandler = useSessionHandler();
  
  const handleApiError = (error: any, customMessage?: string) => {
    // Let session handler check for auth errors first
    if (sessionHandler.checkError(error)) {
      return; // Session handler took care of it
    }
    
    // Handle other API errors
    const { toast } = useToast();
    const message = customMessage || 
                   error?.response?.data?.message || 
                   error?.message || 
                   'An unexpected error occurred';
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };
  
  return {
    handleApiError,
    ...sessionHandler
  };
}
