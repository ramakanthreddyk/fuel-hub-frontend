/**
 * @file components/error/ErrorBoundary.tsx
 * @description Global error boundary component for catching and handling React errors
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { secureLog } from '@/utils/security';
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate a unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      secureLog.error('Error:', error);
      secureLog.error('Error Info:', errorInfo);
      secureLog.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error reporting service (e.g., Sentry, LogRocket)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    secureLog.debug('Error report:', errorReport);
    // Example: sendToErrorService(errorReport);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <p className="text-gray-600 mt-2">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
              <div className="flex justify-center mt-4">
                <Badge variant="outline" className="text-xs">
                  Error ID: {<SafeText text={errorId} />}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && this.props.showDetails && error && (
                <div className="border-t pt-6">
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      <Bug className="w-4 h-4" />
                      Error Details (Development)
                      <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Error Message:</h4>
                        <pre className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800 overflow-auto">
                          {<SafeText text={error.message} />}
                        </pre>
                      </div>

                      {error.stack && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Stack Trace:</h4>
                          <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 overflow-auto max-h-40">
                            {<SafeText text={error.stack} />}
                          </pre>
                        </div>
                      )}

                      {errorInfo?.componentStack && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Component Stack:</h4>
                          <pre className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800 overflow-auto max-h-40">
                            {<SafeText text={errorInfo.componentStack} />}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500 border-t pt-6">
                <p>
                  If this problem persists, please contact support with the error ID above.
                </p>
                {isDevelopment && (
                  <p className="mt-2 text-blue-600">
                    💡 Development mode: Check the console for more details
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, context?: string) => {
    secureLog.error(`Error in ${context || 'unknown context'}:`, error);
    
    // In production, report to error service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
    }
  }, []);
}
