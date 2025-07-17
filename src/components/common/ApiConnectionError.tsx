import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Server } from 'lucide-react';

interface ApiConnectionErrorProps {
  onRetry?: () => void;
}

export function ApiConnectionError({ onRetry }: ApiConnectionErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Server className="h-6 w-6" />
            Backend Server Not Reachable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              We're unable to connect to the FuelSync backend server. This could be due to server maintenance or network issues.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>Possible solutions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your internet connection</li>
              <li>Try again in a few minutes</li>
              <li>Contact your system administrator if the problem persists</li>
            </ul>
          </div>
          
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}