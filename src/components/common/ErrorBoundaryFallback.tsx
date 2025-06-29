
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryFallbackProps {
  error?: Error;
  resetError?: () => void;
  showDetails?: boolean;
}

/**
 * Enhanced error fallback component for error boundaries
 * 
 * Features:
 * - User-friendly error messages
 * - Option to retry/reset
 * - Navigation back to safety
 * - Optional technical details for debugging
 * - Accessible error presentation
 */
export function ErrorBoundaryFallback({ 
  error, 
  resetError, 
  showDetails = false 
}: ErrorBoundaryFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl font-semibold text-red-600">
            Something went wrong
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            We encountered an unexpected error. This has been logged and our team will investigate.
          </p>

          {showDetails && error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs font-mono">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            {resetError && (
              <Button 
                onClick={resetError}
                className="w-full"
                aria-label="Try again"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
              aria-label="Go to homepage"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
