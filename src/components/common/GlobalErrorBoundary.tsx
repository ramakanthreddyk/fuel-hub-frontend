
/**
 * @file components/common/GlobalErrorBoundary.tsx
 * @description Enhanced global error boundary for the entire application
 */
import React from 'react';
import { secureLog } from '@/utils/security';
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

interface Props {
  children: React.ReactNode;
}

export function GlobalErrorBoundary({ children }: Props) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console
    secureLog.error('🚨 Global Error Boundary:', error, errorInfo);

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      secureLog.debug('Error report for service:', errorReport);
      // Example: Sentry.captureException(error, { extra: errorReport });
    }
  };

  return (
    <ErrorBoundary
      onError={handleError}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {<SafeText text={children} />}
    </ErrorBoundary>
  );
}
