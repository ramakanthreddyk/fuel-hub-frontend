/**
 * @file useErrorHandler.ts
 * @description Centralized error handling hook
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 */

/**
 * Error categories for different types of errors
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Categorize an error based on its properties
 * @param error The error to categorize
 * @returns The error category
 */
export const categorizeError = (error: any): ErrorCategory => {
  // Network errors
  if (!error.response || error.message?.includes('Network Error')) {
    return ErrorCategory.NETWORK;
  }

  // HTTP status based categorization
  const status = error.response?.status;
  
  if (status === 401) {
    return ErrorCategory.AUTHENTICATION;
  }
  
  if (status === 403) {
    return ErrorCategory.AUTHORIZATION;
  }
  
  if (status === 404) {
    return ErrorCategory.NOT_FOUND;
  }
  
  if (status === 422 || status === 400) {
    return ErrorCategory.VALIDATION;
  }
  
  if (status >= 500) {
    return ErrorCategory.SERVER;
  }
  
  return ErrorCategory.UNKNOWN;
};

/**
 * Get a user-friendly error message
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: any, fallbackMessage = 'An error occurred'): string => {
  // Extract message from error object
  const errorMessage = error.response?.data?.message || error.message || fallbackMessage;
  
  // Get error category
  const category = categorizeError(error);
  
  // Return appropriate message based on category
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Network error. Please check your connection and try again.';
    case ErrorCategory.AUTHENTICATION:
      return 'Authentication error. Please log in again.';
    case ErrorCategory.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
    case ErrorCategory.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorCategory.VALIDATION:
      return errorMessage;
    case ErrorCategory.SERVER:
      return 'Server error. Please try again later.';
    default:
      return errorMessage;
  }
};

/**
 * Hook for centralized error handling
 */
export const useErrorHandler = () => {
  /**
   * Handle an error with appropriate UI feedback
   * @param error The error to handle
   * @param fallbackMessage Optional fallback message
   */
  const handleError = (error: any, fallbackMessage?: string) => {
    const message = getUserFriendlyErrorMessage(error, fallbackMessage);
    const category = categorizeError(error);
    
    // Log error for debugging
    console.error(`[ERROR-HANDLER] ${category}:`, error);
    
    // Return the error category and message for additional handling
    return { category, message };
  };
  
  return { handleError, categorizeError, getUserFriendlyErrorMessage };
};