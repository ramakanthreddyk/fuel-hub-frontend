/**
 * @file components/error/ErrorStates.tsx
 * @description Reusable error state components for different scenarios
 */
import React from 'react';
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Search, 
  Database, 
  Shield, 
  Clock,
  FileX,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BaseErrorProps {
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
}

interface ErrorStateProps extends BaseErrorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
}

// Base error state component
export function ErrorState({
  title,
  description,
  icon,
  actions,
  className,
  onRetry,
  retryLabel = "Try Again",
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="flex flex-col items-center text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          {<SafeText text={icon} />}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {<SafeText text={title} />}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {<SafeText text={description} />}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {showRetry && onRetry && (
            <Button onClick={<SafeText text={onRetry} />} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {<SafeText text={retryLabel} />}
            </Button>
          )}
          {<SafeText text={actions} />}
        </div>
      </CardContent>
    </Card>
  );
}

// Network/Connection Error
export function NetworkError({ onRetry, className, ...props }: BaseErrorProps) {
  return (
    <ErrorState
      title="Connection Problem"
      description="Unable to connect to the server. Please check your internet connection and try again."
      icon={<Wifi className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// API/Server Error
export function ServerError({ onRetry, className, ...props }: BaseErrorProps) {
  return (
    <ErrorState
      title="Server Error"
      description="Something went wrong on our end. Our team has been notified and is working on a fix."
      icon={<Database className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      retryLabel="Retry Request"
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// Not Found Error
export function NotFoundError({ 
  onRetry, 
  className, 
  resource = "resource",
  ...props 
}: BaseErrorProps & { resource?: string }) {
  return (
    <ErrorState
      title="Not Found"
      description={`The ${<SafeText text={resource} />} you're looking for doesn't exist or has been moved.`}
      icon={<Search className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      retryLabel="Search Again"
      className={<SafeText text={className} />}
      actions={
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      }
      {...props}
    />
  );
}

// Permission/Authorization Error
export function PermissionError({ onRetry, className, ...props }: BaseErrorProps) {
  return (
    <ErrorState
      title="Access Denied"
      description="You don't have permission to access this resource. Please contact your administrator."
      icon={<Shield className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      retryLabel="Check Again"
      showRetry={<SafeText text={false} />}
      className={<SafeText text={className} />}
      actions={
        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      }
      {...props}
    />
  );
}

// Timeout Error
export function TimeoutError({ onRetry, className, ...props }: BaseErrorProps) {
  return (
    <ErrorState
      title="Request Timeout"
      description="The request is taking longer than expected. Please try again."
      icon={<Clock className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      retryLabel="Try Again"
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// Generic Error
export function GenericError({ 
  onRetry, 
  className, 
  message = "An unexpected error occurred",
  ...props 
}: BaseErrorProps & { message?: string }) {
  return (
    <ErrorState
      title="Something went wrong"
      description={message}
      icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// Data Loading Error
export function DataLoadError({ onRetry, className, ...props }: BaseErrorProps) {
  return (
    <ErrorState
      title="Failed to Load Data"
      description="We couldn't load the requested data. This might be a temporary issue."
      icon={<FileX className="w-8 h-8 text-red-600" />}
      onRetry={<SafeText text={onRetry} />}
      retryLabel="Reload Data"
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// Rate Limit Error
export function RateLimitError({ 
  onRetry, 
  className, 
  retryAfter = 60,
  ...props 
}: BaseErrorProps & { retryAfter?: number }) {
  const [countdown, setCountdown] = React.useState(retryAfter);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <ErrorState
      title="Too Many Requests"
      description={`You've made too many requests. Please wait ${countdown > 0 ? `${<SafeText text={countdown} />} seconds` : ''} before trying again.`}
      icon={<Zap className="w-8 h-8 text-red-600" />}
      onRetry={countdown === 0 ? onRetry : undefined}
      retryLabel={countdown > 0 ? `Wait ${<SafeText text={countdown} />}s` : "Try Again"}
      showRetry={<SafeText text={true} />}
      className={<SafeText text={className} />}
      {...props}
    />
  );
}

// Inline Error (for smaller spaces)
export function InlineError({ 
  message, 
  onRetry, 
  className,
  variant = "default"
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2", className)}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1">{<SafeText text={message} />}</span>
        {onRetry && (
          <Button size="sm" variant="ghost" onClick={<SafeText text={onRetry} />} className="h-6 px-2 text-red-600 hover:text-red-700">
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-lg", className)}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <span className="text-red-800">{<SafeText text={message} />}</span>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={<SafeText text={onRetry} />} className="border-red-300 text-red-700 hover:bg-red-100">
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}

// Error boundary fallback for specific components
export function ComponentErrorFallback({ 
  error, 
  resetError,
  componentName = "component"
}: {
  error: Error;
  resetError: () => void;
  componentName?: string;
}) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
      <h3 className="font-medium text-red-900 mb-2">
        {<SafeText text={componentName} />} Error
      </h3>
      <p className="text-sm text-red-700 mb-4">
        This {<SafeText text={componentName} />} encountered an error and couldn't render properly.
      </p>
      <Button size="sm" onClick={resetError} variant="outline" className="border-red-300 text-red-700">
        <RefreshCw className="w-4 h-4 mr-1" />
        Try Again
      </Button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-red-600 cursor-pointer">Error Details</summary>
          <pre className="text-xs text-red-800 mt-2 bg-red-100 p-2 rounded overflow-auto">
            {<SafeText text={error.message} />}
          </pre>
        </details>
      )}
    </div>
  );
}
