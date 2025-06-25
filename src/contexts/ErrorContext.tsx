
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorContextType {
  errors: string[];
  addError: (error: string | Error) => void;
  removeError: (index: number) => void;
  clearErrors: () => void;
  handleApiError: (error: any, customMessage?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string | Error) => {
    const errorMessage = error instanceof Error ? error.message : error;
    setErrors(prev => [...prev, errorMessage]);
    
    // Also show as toast
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const handleApiError = (error: any, customMessage?: string) => {
    console.error('API Error:', error);
    
    let errorMessage = customMessage || 'An unexpected error occurred';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please log in again.';
          break;
        case 403:
          errorMessage = 'You don\'t have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          errorMessage = data?.message || 'Please check your input and try again.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = data?.message || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    addError(errorMessage);
  };

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
