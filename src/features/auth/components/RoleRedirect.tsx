import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRedirectProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath: string;
}

/**
 * Component that redirects users to a specific path if they don't have the required role
 */
export function RoleRedirect({ children, allowedRoles, redirectPath }: RoleRedirectProps) {
  const navigate = useNavigate();
  
  // Get user from localStorage directly to avoid context issues
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('fuelsync_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };
  
  const user = getUserFromStorage();

  useEffect(() => {
    // If user is logged in but doesn't have the required role, redirect
    if (user && !allowedRoles.includes(user.role)) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, allowedRoles, redirectPath, navigate]);

  // If user has the required role, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}