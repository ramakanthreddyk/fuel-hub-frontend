/**
 * @file components/error/__tests__/ErrorBoundary.test.tsx
 * @description Tests for the ErrorBoundary component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="error-card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="error-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="error-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2 data-testid="error-title">{children}</h2>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="error-button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="error-badge">{children}</span>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  Bug: () => <div data-testid="bug-icon">Bug</div>,
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="working-component">Working component</div>;
};

describe('ErrorBoundary', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Normal Operation', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByTestId('error-card')).not.toBeInTheDocument();
    });

    it('renders children with custom props', () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <div data-testid="custom-child">Custom child</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('catches and displays error when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockOnError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('displays error ID in the UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    });

    it('shows action buttons when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Reload Page')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('resets error state when Try Again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      // Re-render with non-throwing component
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByTestId('error-card')).not.toBeInTheDocument();
    });

    it('reloads page when Reload Page is clicked', () => {
      // Mock window.location.reload
      const mockReload = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText('Reload Page');
      fireEvent.click(reloadButton);

      expect(mockReload).toHaveBeenCalled();
    });

    it('navigates to home when Go Home is clicked', () => {
      // Mock window.location.href
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByText('Go Home');
      fireEvent.click(goHomeButton);

      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  describe('Development Mode Features', () => {
    it('shows error details in development mode', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details/)).toBeInTheDocument();
      expect(screen.getByTestId('bug-icon')).toBeInTheDocument();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('hides error details when showDetails is false', () => {
      render(
        <ErrorBoundary showDetails={false}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/Error Details/)).not.toBeInTheDocument();
    });

    it('logs error to console in development', () => {
      const consoleSpy = vi.spyOn(console, 'group');
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith('🚨 Error Boundary Caught Error');
    });
  });

  describe('Custom Fallback', () => {
    it('renders custom fallback when provided', () => {
      const CustomFallback = <div data-testid="custom-fallback">Custom error UI</div>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('error-card')).not.toBeInTheDocument();
    });
  });

  describe('Error Reporting', () => {
    it('generates unique error IDs', () => {
      const { unmount, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const firstErrorId = screen.getByText(/Error ID:/).textContent;
      
      unmount();
      
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const secondErrorId = screen.getByText(/Error ID:/).textContent;
      
      expect(firstErrorId).not.toBe(secondErrorId);
    });

    it('includes error context in production reporting', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const consoleSpy = vi.spyOn(console, 'log');

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error report:',
        expect.objectContaining({
          message: 'Test error message',
          errorId: expect.any(String),
          timestamp: expect.any(String),
          userAgent: expect.any(String),
          url: expect.any(String),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-title')).toBeInTheDocument();
    });

    it('has focusable action buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const buttons = screen.getAllByTestId('error-button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles errors thrown in useEffect', () => {
      const EffectError = () => {
        React.useEffect(() => {
          throw new Error('Effect error');
        }, []);
        return <div>Component with effect error</div>;
      };

      // Note: useEffect errors are not caught by error boundaries
      // This test documents the expected behavior
      expect(() => {
        render(
          <ErrorBoundary>
            <EffectError />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('handles errors thrown in event handlers', () => {
      const EventError = () => {
        const handleClick = () => {
          throw new Error('Event handler error');
        };
        return <button onClick={handleClick}>Click me</button>;
      };

      render(
        <ErrorBoundary>
          <EventError />
        </ErrorBoundary>
      );

      const button = screen.getByText('Click me');

      // Event handler errors are not caught by error boundaries
      expect(() => {
        fireEvent.click(button);
      }).toThrow('Event handler error');
    });

    it('handles async errors', async () => {
      const AsyncError = () => {
        React.useEffect(() => {
          setTimeout(() => {
            throw new Error('Async error');
          }, 0);
        }, []);
        return <div>Async component</div>;
      };

      // Async errors are not caught by error boundaries
      expect(() => {
        render(
          <ErrorBoundary>
            <AsyncError />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('handles null error objects', () => {
      const NullError = () => {
        throw null;
      };

      render(
        <ErrorBoundary>
          <NullError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles undefined error objects', () => {
      const UndefinedError = () => {
        throw undefined;
      };

      render(
        <ErrorBoundary>
          <UndefinedError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles string errors', () => {
      const StringError = () => {
        throw 'String error message';
      };

      render(
        <ErrorBoundary>
          <StringError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles object errors without message', () => {
      const ObjectError = () => {
        throw { code: 500, details: 'Server error' };
      };

      render(
        <ErrorBoundary>
          <ObjectError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const LongError = () => {
        throw new Error('A'.repeat(1000));
      };

      render(
        <ErrorBoundary>
          <LongError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles errors with special characters', () => {
      const SpecialCharError = () => {
        throw new Error('Error with special chars: <>&"\'');
      };

      render(
        <ErrorBoundary>
          <SpecialCharError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles errors with unicode characters', () => {
      const UnicodeError = () => {
        throw new Error('Unicode error: 🚨💥🔥');
      };

      render(
        <ErrorBoundary>
          <UnicodeError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles multiple consecutive errors', () => {
      const MultiError = ({ errorCount }: { errorCount: number }) => {
        if (errorCount > 0) {
          throw new Error(`Error ${errorCount}`);
        }
        return <div>No error</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <MultiError errorCount={0} />
        </ErrorBoundary>
      );

      // First error
      rerender(
        <ErrorBoundary>
          <MultiError errorCount={1} />
        </ErrorBoundary>
      );
      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Reset and second error
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      rerender(
        <ErrorBoundary>
          <MultiError errorCount={2} />
        </ErrorBoundary>
      );
      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles errors during error boundary rendering', () => {
      const ErrorInFallback = () => {
        throw new Error('Error in fallback');
      };

      // This would cause an infinite loop in a poorly implemented error boundary
      expect(() => {
        render(
          <ErrorBoundary fallback={<ErrorInFallback />}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).toThrow();
    });

    it('handles memory pressure during error reporting', () => {
      // Mock memory pressure
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 100 * 1024 * 1024, // 100MB
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 100 * 1024 * 1024,
      };

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Restore original memory
      (global.performance as any).memory = originalMemory;
    });

    it('handles network errors during error reporting', () => {
      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles localStorage unavailable during error reporting', () => {
      // Mock localStorage to throw
      const originalLocalStorage = global.localStorage;
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: vi.fn(() => { throw new Error('localStorage unavailable'); }),
          setItem: vi.fn(() => { throw new Error('localStorage unavailable'); }),
        },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Restore localStorage
      global.localStorage = originalLocalStorage;
    });

    it('handles component unmounting during error state', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Should not throw when unmounting
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles rapid error state changes', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Rapidly toggle error state
      for (let i = 0; i < 10; i++) {
        rerender(
          <ErrorBoundary>
            <ThrowError shouldThrow={i % 2 === 0} />
          </ErrorBoundary>
        );
      }

      // Should handle rapid changes gracefully
      expect(screen.getByTestId('working-component')).toBeInTheDocument();
    });

    it('handles errors with circular references', () => {
      const CircularError = () => {
        const obj: any = { name: 'circular' };
        obj.self = obj;
        const error = new Error('Circular reference error');
        (error as any).circular = obj;
        throw error;
      };

      render(
        <ErrorBoundary>
          <CircularError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();
    });

    it('handles errors in different environments', () => {
      const originalEnv = process.env.NODE_ENV;

      // Test in production environment
      process.env.NODE_ENV = 'production';

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Test in test environment
      process.env.NODE_ENV = 'test';

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-card')).toBeInTheDocument();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });
});
