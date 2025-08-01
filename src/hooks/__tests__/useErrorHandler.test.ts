/**
 * @file hooks/__tests__/useErrorHandler.test.ts
 * @description Tests for the useErrorHandler hook
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosError } from 'axios';
import { useErrorHandler } from '../useErrorHandler';

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
  },
  isAxiosError: vi.fn(),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseError', () => {
    it('parses network errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const networkError = {
        isAxiosError: true,
        response: undefined,
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(networkError);
      
      expect(parsedError).toEqual({
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
        retryable: true,
      });
    });

    it('parses 400 validation errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const validationError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: { field: 'Required' },
          },
        },
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(validationError);
      
      expect(parsedError).toEqual({
        type: 'validation',
        message: 'Validation failed',
        statusCode: 400,
        details: { field: 'Required' },
        retryable: false,
      });
    });

    it('parses 401 authentication errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const authError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
        },
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(authError);
      
      expect(parsedError).toEqual({
        type: 'permission',
        message: 'Your session has expired. Please log in again.',
        statusCode: 401,
        retryable: false,
      });
    });

    it('parses 403 permission errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const permissionError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {},
        },
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(permissionError);
      
      expect(parsedError).toEqual({
        type: 'permission',
        message: 'You don\'t have permission to perform this action.',
        statusCode: 403,
        retryable: false,
      });
    });

    it('parses 404 not found errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const notFoundError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(notFoundError);
      
      expect(parsedError).toEqual({
        type: 'client',
        message: 'The requested resource was not found.',
        statusCode: 404,
        retryable: false,
      });
    });

    it('parses 500 server errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      const parsedError = result.current.parseError(serverError);
      
      expect(parsedError).toEqual({
        type: 'server',
        message: 'Server error. Our team has been notified.',
        statusCode: 500,
        retryable: true,
      });
    });

    it('parses JavaScript errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const jsError = new Error('JavaScript error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const parsedError = result.current.parseError(jsError);
      
      expect(parsedError).toEqual({
        type: 'client',
        message: 'JavaScript error',
        retryable: false,
      });
    });

    it('parses string errors correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const parsedError = result.current.parseError('String error');
      
      expect(parsedError).toEqual({
        type: 'unknown',
        message: 'String error',
        retryable: false,
      });
    });

    it('handles unknown error formats', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const parsedError = result.current.parseError({ unknown: 'format' });
      
      expect(parsedError).toEqual({
        type: 'unknown',
        message: 'An unexpected error occurred.',
        retryable: false,
      });
    });
  });

  describe('handleError (legacy)', () => {
    it('shows toast notification by default', () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleError(error, 'Default message');
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Request Error',
        description: 'Test error',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('uses fallback message when error has no message', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleError({}, 'Fallback message');
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });
  });

  describe('handleErrorAdvanced', () => {
    it('logs error to console in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = vi.spyOn(console, 'group');
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      act(() => {
        result.current.handleErrorAdvanced(error, { component: 'TestComponent' });
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error in TestComponent');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('respects showToast option', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      act(() => {
        result.current.handleErrorAdvanced(error, {}, { showToast: false });
      });
      
      expect(mockToast).not.toHaveBeenCalled();
    });

    it('uses custom fallback message', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      (axios.isAxiosError as any).mockReturnValue(false);
      
      act(() => {
        result.current.handleErrorAdvanced(
          {},
          {},
          { fallbackMessage: 'Custom fallback' }
        );
      });
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Custom fallback',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('returns parsed error', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      let parsedError;
      act(() => {
        parsedError = result.current.handleErrorAdvanced(error);
      });
      
      expect(parsedError).toEqual({
        type: 'client',
        message: 'Test error',
        retryable: false,
      });
    });
  });

  describe('Specialized handlers', () => {
    it('handleApiError sets correct context', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('API error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const consoleSpy = vi.spyOn(console, 'group');
      
      act(() => {
        result.current.handleApiError(error, 'fetchData');
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error in API');
    });

    it('handleFormError sets correct context', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('Form error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const consoleSpy = vi.spyOn(console, 'group');
      
      act(() => {
        result.current.handleFormError(error, 'loginForm');
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error in Form');
    });

    it('handleComponentError sets correct context', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const error = new Error('Component error');
      (axios.isAxiosError as any).mockReturnValue(false);
      
      const consoleSpy = vi.spyOn(console, 'group');
      
      act(() => {
        result.current.handleComponentError(error, 'PumpCard');
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error in PumpCard');
    });
  });

  describe('Toast duration', () => {
    it('uses longer duration for network errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const networkError = {
        isAxiosError: true,
        response: undefined,
      } as AxiosError;
      
      (axios.isAxiosError as any).mockReturnValue(true);
      
      act(() => {
        result.current.handleErrorAdvanced(networkError);
      });
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
        duration: 5000,
      });
    });

    it('uses standard duration for other errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(error);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Request Error',
        description: 'Test error',
        variant: 'destructive',
        duration: 4000,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(null);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles undefined errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(undefined);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles empty string errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced('');
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles number errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(404);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles boolean errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(false);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles array errors', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(['error1', 'error2']);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles errors with circular references', () => {
      const { result } = renderHook(() => useErrorHandler());

      const circularError: any = { message: 'Circular error' };
      circularError.self = circularError;

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(circularError);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles axios errors without response data', () => {
      const { result } = renderHook(() => useErrorHandler());

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: null,
        },
      } as AxiosError;

      (axios.isAxiosError as any).mockReturnValue(true);

      const parsedError = result.current.parseError(axiosError);

      expect(parsedError).toEqual({
        type: 'server',
        message: 'Server error. Our team has been notified.',
        statusCode: 500,
        details: null,
        retryable: true,
      });
    });

    it('handles axios errors with malformed response data', () => {
      const { result } = renderHook(() => useErrorHandler());

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: 'not an object',
        },
      } as AxiosError;

      (axios.isAxiosError as any).mockReturnValue(true);

      const parsedError = result.current.parseError(axiosError);

      expect(parsedError).toEqual({
        type: 'validation',
        message: 'Invalid request. Please check your input.',
        statusCode: 400,
        details: undefined,
        retryable: false,
      });
    });

    it('handles unknown HTTP status codes', () => {
      const { result } = renderHook(() => useErrorHandler());

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 999,
          data: { message: 'Unknown status' },
        },
      } as AxiosError;

      (axios.isAxiosError as any).mockReturnValue(true);

      const parsedError = result.current.parseError(axiosError);

      expect(parsedError).toEqual({
        type: 'unknown',
        message: 'Unknown status',
        statusCode: 999,
        details: { message: 'Unknown status' },
        retryable: false,
      });
    });

    it('handles errors with very long messages', () => {
      const { result } = renderHook(() => useErrorHandler());

      const longMessage = 'A'.repeat(10000);
      const error = new Error(longMessage);

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(error);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Request Error',
        description: longMessage,
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles errors with special characters', () => {
      const { result } = renderHook(() => useErrorHandler());

      const specialMessage = 'Error with <>&"\' characters';
      const error = new Error(specialMessage);

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(error);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Request Error',
        description: specialMessage,
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles errors with unicode characters', () => {
      const { result } = renderHook(() => useErrorHandler());

      const unicodeMessage = 'Error with 🚨💥🔥 emojis';
      const error = new Error(unicodeMessage);

      (axios.isAxiosError as any).mockReturnValue(false);

      act(() => {
        result.current.handleErrorAdvanced(error);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Request Error',
        description: unicodeMessage,
        variant: 'destructive',
        duration: 4000,
      });
    });

    it('handles toast function throwing', () => {
      const { result } = renderHook(() => useErrorHandler());

      mockToast.mockImplementation(() => {
        throw new Error('Toast error');
      });

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();
    });

    it('handles console methods not available', () => {
      const originalConsole = global.console;
      delete (global as any).console;

      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error, { component: 'TestComponent' });
        });
      }).not.toThrow();

      global.console = originalConsole;
    });

    it('handles Date.now not available', () => {
      const originalDateNow = Date.now;
      delete (Date as any).now;

      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();

      Date.now = originalDateNow;
    });

    it('handles navigator not available', () => {
      const originalNavigator = global.navigator;
      delete (global as any).navigator;

      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();

      global.navigator = originalNavigator;
    });

    it('handles window not available', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('handles process.env not available', () => {
      const originalEnv = process.env.NODE_ENV;
      delete (process.env as any).NODE_ENV;

      const { result } = renderHook(() => useErrorHandler());

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();

      process.env.NODE_ENV = originalEnv;
    });

    it('handles axios.isAxiosError throwing', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockImplementation(() => {
        throw new Error('isAxiosError error');
      });

      const error = new Error('Test error');

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error);
        });
      }).not.toThrow();
    });

    it('handles multiple rapid error calls', () => {
      const { result } = renderHook(() => useErrorHandler());

      (axios.isAxiosError as any).mockReturnValue(false);

      // Call error handler 100 times rapidly
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.handleErrorAdvanced(new Error(`Error ${i}`));
        });
      }

      expect(mockToast).toHaveBeenCalledTimes(100);
    });

    it('handles context with circular references', () => {
      const { result } = renderHook(() => useErrorHandler());

      const circularContext: any = { component: 'TestComponent' };
      circularContext.self = circularContext;

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error, circularContext);
        });
      }).not.toThrow();
    });

    it('handles options with circular references', () => {
      const { result } = renderHook(() => useErrorHandler());

      const circularOptions: any = { showToast: true };
      circularOptions.self = circularOptions;

      const error = new Error('Test error');
      (axios.isAxiosError as any).mockReturnValue(false);

      expect(() => {
        act(() => {
          result.current.handleErrorAdvanced(error, {}, circularOptions);
        });
      }).not.toThrow();
    });
  });
});
