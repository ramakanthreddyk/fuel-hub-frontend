
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading, token, logout } = useAuth();
  const location = useLocation();
  
  // Check if token exists but might be expired
  const checkTokenValidity = () => {
    if (token) {
      try {
        // Simple check - if token exists in localStorage
        const storedToken = localStorage.getItem('fuelsync_token');
        if (!storedToken || storedToken !== token) {
          console.log('[AUTH] Token mismatch, logging out');
          logout();
          return false;
        }
        return true;
      } catch (error) {
        console.error('[AUTH] Token validation error:', error);
        logout();
        return false;
      }
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  // Check both isAuthenticated flag and token validity
  if (!isAuthenticated || !checkTokenValidity()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
