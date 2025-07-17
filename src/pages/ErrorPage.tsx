import { useEffect, useState } from 'react';
import { ApiConnectionError } from '@/components/common/ApiConnectionError';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const [errorType, setErrorType] = useState<string>('unknown');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an API error stored
    const storedError = localStorage.getItem('fuelsync_api_error');
    if (storedError) {
      try {
        const parsedError = JSON.parse(storedError);
        setErrorType(parsedError.type || 'unknown');
        setErrorMessage(parsedError.message || 'An unknown error occurred');
      } catch (e) {
        console.error('Failed to parse stored error:', e);
      }
    }
  }, []);

  const handleRetry = () => {
    // Clear the error
    localStorage.removeItem('fuelsync_api_error');
    
    // Redirect to home page
    navigate('/');
  };

  // Show different error components based on error type
  if (errorType === 'network') {
    return <ApiConnectionError onRetry={handleRetry} />;
  }

  // Default error fallback
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <ErrorFallback 
        error={new Error(errorMessage)} 
        onRetry={handleRetry}
        title="Something went wrong"
      />
    </div>
  );
}