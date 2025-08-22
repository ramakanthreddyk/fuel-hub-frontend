
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  error?: Error | null;
  onRetry?: () => void;
}

export function DashboardErrorBoundary({ children, error, onRetry }: Props) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
          <h3 className="font-medium text-gray-900 mb-1">Data Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Backend service may be temporarily unavailable
          </p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
