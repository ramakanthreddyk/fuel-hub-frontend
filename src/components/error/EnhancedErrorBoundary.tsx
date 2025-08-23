/**
 * @file components/error/EnhancedErrorBoundary.tsx
 * @description Enhanced error boundary with comprehensive error handling
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { secureLog } from '@/utils/security';
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { errorReporting } from '@/utils/errorReporting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug, Home, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
  retryCount: number;
  level: string;
}

type ComponentType<P = {}> = React.ComponentType<P>;

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    
    this.setState({
      errorInfo,
      errorId,
    });

    // Report error with context
    errorReporting.reportError({
      error,
      component: this.getComponentName(),
      action: 'Component Error',
      severity: this.getSeverity(error),
      context: {
        errorInfo,
        level: this.props.level || 'component',
        retryCount: this.state.retryCount,
        componentStack: errorInfo.componentStack,
        errorBoundary: 'EnhancedErrorBoundary',
      },
      tags: ['error-boundary', this.props.level || 'component'],
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      secureLog.error('Error:', error);
      secureLog.error('Error Info:', errorInfo);
      secureLog.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  private generateErrorId(): string {
    return `eb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getComponentName(): string {
    // Try to extract component name from error stack
    if (this.state.error?.stack) {
      const match = this.state.error.stack.match(/at (\w+)/);
      if (match) return match[1];
    }
    return 'Unknown Component';
  }

  private getSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk') || message.includes('loading')) return 'medium';
    if (message.includes('network') || message.includes('fetch')) return 'medium';
    if (message.includes('permission') || message.includes('auth')) return 'high';
    if (this.props.level === 'page') return 'critical';
    if (this.props.level === 'section') return 'high';
    
    return 'medium';
  }

  private resetError = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleRetry = () => {
    // Add delay for retries to prevent rapid retry loops
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000);
    
    this.retryTimeoutId = setTimeout(() => {
      this.resetError();
    }, delay);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleDownloadReport = () => {
    const report = {
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
      },
      errorInfo: this.state.errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.state.errorId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            errorInfo={this.state.errorInfo!}
            resetError={<SafeText text={this.resetError} />}
            retryCount={this.state.retryCount}
            level={this.props.level || 'component'}
          />
        );
      }

      // Default fallback UI
      return (
        <div className="error-boundary-container p-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                {this.props.level === 'page' ? 'Page Error' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground">
                <p>
                  {this.props.level === 'page'
                    ? 'This page encountered an error and cannot be displayed.'
                    : 'A component on this page has encountered an error.'}
                </p>
                {this.state.retryCount > 0 && (
                  <p className="text-sm mt-2">
                    Retry attempts: {this.state.retryCount}
                  </p>
                )}
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="bg-muted p-4 rounded-md">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    {this.state.errorId && (
                      <div>
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                    )}
                    {this.state.error?.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>

                {this.props.level === 'page' && (
                  <>
                    <Button
                      onClick={<SafeText text={this.handleReload} />}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reload Page
                    </Button>

                    <Button
                      onClick={this.handleGoHome}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Go Home
                    </Button>
                  </>
                )}

                {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={<SafeText text={this.handleDownloadReport} />}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                )}
              </div>

              {this.state.retryCount >= 3 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Multiple retry attempts failed. This might be a persistent issue.
                  </p>
                  <Button
                    onClick={() => window.location.href = 'mailto:support@fuelhub.com?subject=Error Report'}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </EnhancedErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for error boundary context
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

// Specialized error boundaries for different levels
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="page">
    {<SafeText text={children} />}
  </EnhancedErrorBoundary>
);

export const SectionErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="section">
    {<SafeText text={children} />}
  </EnhancedErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary level="component">
    {<SafeText text={children} />}
  </EnhancedErrorBoundary>
);
