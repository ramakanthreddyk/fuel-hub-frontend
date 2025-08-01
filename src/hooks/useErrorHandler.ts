/**
 * @file hooks/useErrorHandler.ts
 * @description Enhanced error handling hook with comprehensive error parsing and reporting
 */
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
  fallbackMessage?: string;
}

export interface ParsedError {
  type: 'network' | 'server' | 'client' | 'validation' | 'permission' | 'timeout' | 'unknown';
  message: string;
  statusCode?: number;
  details?: any;
  retryable: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  // Parse different types of errors into a consistent format
  const parseError = useCallback((error: any): ParsedError => {
    // Network/Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (!axiosError.response) {
        // Network error (no response received)
        return {
          type: 'network',
          message: 'Unable to connect to the server. Please check your internet connection.',
          retryable: true,
        };
      }

      const status = axiosError.response.status;
      const data = axiosError.response.data as any;

      switch (status) {
        case 400:
          return {
            type: 'validation',
            message: data?.message || 'Invalid request. Please check your input.',
            statusCode: status,
            details: data?.errors || data?.details,
            retryable: false,
          };

        case 401:
          return {
            type: 'permission',
            message: 'Your session has expired. Please log in again.',
            statusCode: status,
            retryable: false,
          };

        case 403:
          return {
            type: 'permission',
            message: 'You don\'t have permission to perform this action.',
            statusCode: status,
            retryable: false,
          };

        case 404:
          return {
            type: 'client',
            message: 'The requested resource was not found.',
            statusCode: status,
            retryable: false,
          };

        case 408:
          return {
            type: 'timeout',
            message: 'Request timed out. Please try again.',
            statusCode: status,
            retryable: true,
          };

        case 429:
          return {
            type: 'client',
            message: 'Too many requests. Please wait a moment before trying again.',
            statusCode: status,
            retryable: true,
          };

        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: 'server',
            message: 'Server error. Our team has been notified.',
            statusCode: status,
            retryable: true,
          };

        default:
          return {
            type: 'unknown',
            message: data?.message || 'An unexpected error occurred.',
            statusCode: status,
            details: data,
            retryable: status >= 500,
          };
      }
    }

    // JavaScript/React errors
    if (error instanceof Error) {
      return {
        type: 'client',
        message: error.message || 'An unexpected error occurred.',
        retryable: false,
      };
    }

    // String errors
    if (typeof error === 'string') {
      return {
        type: 'unknown',
        message: error,
        retryable: false,
      };
    }

    // Unknown error format
    return {
      type: 'unknown',
      message: 'An unexpected error occurred.',
      retryable: false,
    };
  }, []);

  // Report error to external service (placeholder)
  const reportError = useCallback((
    error: any,
    context: ErrorContext,
    parsedError: ParsedError
  ) => {
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
      const errorReport = {
        message: parsedError.message,
        type: parsedError.type,
        statusCode: parsedError.statusCode,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        stack: error instanceof Error ? error.stack : undefined,
      };

      console.log('Error report (would be sent to service):', errorReport);
      // Example: Sentry.captureException(error, { extra: errorReport });
    }
  }, []);

  // Main error handler function
  const handleError = useCallback((
    error: any,
    context: ErrorContext = {},
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      reportToService = true,
      fallbackMessage = 'Something went wrong. Please try again.',
    } = options;

    const parsedError = parseError(error);

    // Log to console in development
    if (logToConsole && process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${context.component || 'Unknown Component'}`);
      console.error('Original Error:', error);
      console.error('Parsed Error:', parsedError);
      console.error('Context:', context);
      console.groupEnd();
    }

    // Show toast notification
    if (showToast) {
      const toastMessage = parsedError.message || fallbackMessage;

      toast({
        title: getErrorTitle(parsedError.type),
        description: toastMessage,
        variant: "destructive",
        duration: parsedError.type === 'network' ? 5000 : 4000,
      });
    }

    // Report to error service
    if (reportToService) {
      reportError(error, context, parsedError);
    }

    return parsedError;
  }, [parseError, reportError, toast]);

  // Specialized handlers for common scenarios
  const handleApiError = useCallback((
    error: any,
    action: string,
    options?: ErrorHandlerOptions
  ) => {
    return handleError(error, { action, component: 'API' }, options);
  }, [handleError]);

  const handleFormError = useCallback((
    error: any,
    formName: string,
    options?: ErrorHandlerOptions
  ) => {
    return handleError(error, { component: 'Form', action: formName }, options);
  }, [handleError]);

  const handleComponentError = useCallback((
    error: any,
    componentName: string,
    options?: ErrorHandlerOptions
  ) => {
    return handleError(error, { component: componentName }, options);
  }, [handleError]);

  // Legacy method for backward compatibility
  const handleErrorLegacy = useCallback((error: unknown, defaultMessage: string) => {
    handleError(error, {}, { fallbackMessage: defaultMessage });
  }, [handleError]);

  return {
    handleError: handleErrorLegacy, // Legacy method for backward compatibility
    handleErrorAdvanced: handleError,
    handleApiError,
    handleFormError,
    handleComponentError,
    parseError,
  };
}

// Helper function to get error title based on type
function getErrorTitle(type: ParsedError['type']): string {
  switch (type) {
    case 'network':
      return 'Connection Error';
    case 'server':
      return 'Server Error';
    case 'client':
      return 'Request Error';
    case 'validation':
      return 'Validation Error';
    case 'permission':
      return 'Access Denied';
    case 'timeout':
      return 'Request Timeout';
    default:
      return 'Error';
  }
}
