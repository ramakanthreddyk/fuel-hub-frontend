
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component to handle redirects for the attendant route
 */
export function AttendantRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simply redirect to the attendant dashboard
    navigate('/attendant/dashboard', { replace: true });
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading attendant dashboard...</p>
      </div>
    </div>
  );
}
