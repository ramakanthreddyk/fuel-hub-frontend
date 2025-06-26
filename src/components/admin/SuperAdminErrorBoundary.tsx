import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface SuperAdminErrorBoundaryProps {
  error: any;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function SuperAdminErrorBoundary({ error, onRetry, children }: SuperAdminErrorBoundaryProps) {
  if (!error) {
    return <>{children}</>;
  }

  // Check for specific error types
  const isSchemaError = error?.message?.includes('schema_name') || 
                        error?.response?.data?.message?.includes('schema_name');
  
  const isForbiddenError = error?.response?.status === 403 || 
                          error?.message?.includes('Forbidden') ||
                          error?.response?.data?.message?.includes('Insufficient role');

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
        <h3 className="text-xl font-semibold mb-2">
          {isSchemaError ? 'Database Schema Error' : 
           isForbiddenError ? 'Access Denied' : 'Error Loading Data'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {isSchemaError ? 
            'The database schema appears to be missing required columns. This may indicate a database migration issue.' : 
           isForbiddenError ?
            'You do not have sufficient permissions to access this resource. Please contact your administrator.' :
            'There was a problem loading the requested data. Please try again later.'}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}