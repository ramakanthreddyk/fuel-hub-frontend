import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath: string;
}

/**
 * A route component that checks if the user has the required role
 * and redirects to the specified path if not
 */
export function ProtectedRoute({ allowedRoles, redirectPath }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to specified path
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  // User has the required role, render the child routes
  return <Outlet />;
}