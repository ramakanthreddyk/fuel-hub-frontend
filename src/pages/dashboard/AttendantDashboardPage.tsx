import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * This is a simple redirect page for attendants
 */
export default function AttendantDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect attendants to the dedicated attendant dashboard
    if (user?.role === 'attendant') {
      navigate('/attendant', { replace: true });
    }
  }, [user, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to attendant dashboard...</p>
      </div>
    </div>
  );
}