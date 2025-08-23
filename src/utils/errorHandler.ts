/**
 * @file utils/errorHandler.ts
 * @description Centralized error handling utilities for consistent error management
 */

import { logger } from './logger';
import { sanitizeForLogging } from './security';

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
  timestamp: string;
  context?: Record<string, unknown>;
}

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // API errors
  API_ERROR = 'API_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorCallbacks: Map<string, (error: AppError) => void> = new Map();

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  /**
   * Register a callback for specific error codes
   */
  onError(code: string, callback: (error: AppError) => void): void {
    this.errorCallbacks.set(code, callback);
  }

  /**
   * Create a standardized error object
   */
  createError(
    code: ErrorCode,
    message: string,
    details?: unknown,
    statusCode?: number,
    context?: Record<string, unknown>
  ): AppError {
    return {
      code,
      message: sanitizeForLogging(message),
      details: details ? sanitizeForLogging(details) : undefined,
      statusCode,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined,
    };
  }

  /**
   * Handle different types of errors and convert them to AppError
   */
  handleError(error: unknown, context?: Record<string, unknown>): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else if (this.isAxiosError(error)) {
      appError = this.handleAxiosError(error, context);
    } else if (error instanceof Error) {
      appError = this.handleJavaScriptError(error, context);
    } else {
      appError = this.handleUnknownError(error, context);
    }

    // Log the error
    logger.error('Error handled', appError, context);

    // Execute registered callback if exists
    const callback = this.errorCallbacks.get(appError.code);
    if (callback) {
      try {
        callback(appError);
      } catch (callbackError) {
        logger.error('Error in error callback', callbackError);
      }
    }

    return appError;
  }

  /**
   * Handle Axios/HTTP errors
   */
  private handleAxiosError(error: any, context?: Record<string, unknown>): AppError {
    const response = error.response;
    const request = error.request;

    if (response) {
      // Server responded with error status
      const statusCode = response.status;
      const data = response.data;

      let code: ErrorCode;
      let message: string;

      switch (statusCode) {
        case 400:
          code = ErrorCode.VALIDATION_ERROR;
          message = data?.message || 'Invalid request data';
          break;
        case 401:
          code = ErrorCode.UNAUTHORIZED;
          message = 'Authentication required';
          break;
        case 403:
          code = ErrorCode.FORBIDDEN;
          message = 'Access denied';
          break;
        case 404:
          code = ErrorCode.NOT_FOUND;
          message = 'Resource not found';
          break;
        case 422:
          code = ErrorCode.VALIDATION_ERROR;
          message = data?.message || 'Validation failed';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          code = ErrorCode.SERVER_ERROR;
          message = 'Server error occurred';
          break;
        default:
          code = ErrorCode.API_ERROR;
          message = data?.message || `HTTP ${statusCode} error`;
      }

      return this.createError(code, message, data, statusCode, {
        ...context,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (request) {
      // Network error
      return this.createError(
        ErrorCode.NETWORK_ERROR,
        'Network error - please check your connection',
        undefined,
        0,
        context
      );
    } else {
      // Request setup error
      return this.createError(
        ErrorCode.UNKNOWN_ERROR,
        error.message || 'Request configuration error',
        undefined,
        undefined,
        context
      );
    }
  }

  /**
   * Handle JavaScript errors
   */
  private handleJavaScriptError(error: Error, context?: Record<string, unknown>): AppError {
    let code: ErrorCode;

    // Categorize common JavaScript errors
    if (error.name === 'TypeError') {
      code = ErrorCode.INVALID_INPUT;
    } else if (error.name === 'ReferenceError') {
      code = ErrorCode.UNKNOWN_ERROR;
    } else if (error.message.includes('timeout')) {
      code = ErrorCode.TIMEOUT_ERROR;
    } else {
      code = ErrorCode.UNKNOWN_ERROR;
    }

    return this.createError(
      code,
      error.message,
      {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      undefined,
      context
    );
  }

  /**
   * Handle unknown error types
   */
  private handleUnknownError(error: unknown, context?: Record<string, unknown>): AppError {
    return this.createError(
      ErrorCode.UNKNOWN_ERROR,
      'An unexpected error occurred',
      error,
      undefined,
      context
    );
  }

  /**
   * Type guards
   */
  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      'timestamp' in error
    );
  }

  private isAxiosError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('response' in error || 'request' in error) &&
      'config' in error
    );
  }

  /**
   * Sanitize context for logging
   */
  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(context)) {
      sanitized[key] = sanitizeForLogging(value);
    }
    
    return sanitized;
  }

  /**
   * Create user-friendly error messages
   */
  getUserMessage(error: AppError): string {
    const userMessages: Record<string, string> = {
      [ErrorCode.NETWORK_ERROR]: 'Please check your internet connection and try again.',
      [ErrorCode.TIMEOUT_ERROR]: 'The request timed out. Please try again.',
      [ErrorCode.UNAUTHORIZED]: 'Please log in to continue.',
      [ErrorCode.FORBIDDEN]: 'You don\'t have permission to perform this action.',
      [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
      [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
      [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
      [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorCode.SERVER_ERROR]: 'A server error occurred. Please try again later.',
      [ErrorCode.BUSINESS_RULE_VIOLATION]: 'This action violates business rules.',
      [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'You don\'t have sufficient permissions.',
      [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
    };

    return userMessages[error.code] || error.message;
  }

  /**
   * Check if error should be retried
   */
  isRetryable(error: AppError): boolean {
    const retryableCodes = [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT_ERROR,
      ErrorCode.SERVER_ERROR,
    ];

    return retryableCodes.includes(error.code as ErrorCode);
  }

  /**
   * Check if error requires user authentication
   */
  requiresAuth(error: AppError): boolean {
    const authCodes = [
      ErrorCode.UNAUTHORIZED,
      ErrorCode.TOKEN_EXPIRED,
    ];

    return authCodes.includes(error.code as ErrorCode);
  }
}

// Export singleton instance
export const errorHandler = AppErrorHandler.getInstance();

// Convenience functions
export const handleError = (error: unknown, context?: Record<string, unknown>): AppError => {
  return errorHandler.handleError(error, context);
};

export const createError = (
  code: ErrorCode,
  message: string,
  details?: unknown,
  statusCode?: number,
  context?: Record<string, unknown>
): AppError => {
  return errorHandler.createError(code, message, details, statusCode, context);
};

export const getUserMessage = (error: AppError): string => {
  return errorHandler.getUserMessage(error);
};

// Result type for consistent error handling
export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const success = <T>(data: T): Result<T> => ({ success: true, data });
export const failure = <T>(error: AppError): Result<T> => ({ success: false, error });

// Async wrapper that converts exceptions to Results
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<Result<T>> => {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    const appError = handleError(error, context);
    return failure(appError);
  }
};

// Sync wrapper that converts exceptions to Results
export const safe = <T>(
  fn: () => T,
  context?: Record<string, unknown>
): Result<T> => {
  try {
    const data = fn();
    return success(data);
  } catch (error) {
    const appError = handleError(error, context);
    return failure(appError);
  }
};