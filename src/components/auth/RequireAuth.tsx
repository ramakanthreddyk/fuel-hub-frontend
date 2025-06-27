
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
  const { isAuthenticated, user, isLoading, token } = useAuth();
  const location = useLocation();

  console.log('[REQUIRE-AUTH] Current state:', {
    isAuthenticated,
    isLoading,
    hasToken: !!token,
    hasUser: !!user,
    userRole: user?.role,
    pathname: location.pathname,
    allowedRoles
  });

  if (isLoading) {
    console.log('[REQUIRE-AUTH] Still loading, showing skeleton');
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

  // Check authentication
  if (!isAuthenticated || !token || !user) {
    console.log('[REQUIRE-AUTH] Not authenticated, redirecting to login:', {
      isAuthenticated,
      hasToken: !!token,
      hasUser: !!user
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('[REQUIRE-AUTH] User role not authorized:', {
      userRole: user.role,
      allowedRoles
    });
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Special handling for superadmin routes
  if (location.pathname.startsWith('/superadmin') && user.role !== 'superadmin') {
    console.log('[REQUIRE-AUTH] Non-superadmin trying to access superadmin route');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('[REQUIRE-AUTH] Access granted for user:', user.role);
  return <>{children}</>;
};
