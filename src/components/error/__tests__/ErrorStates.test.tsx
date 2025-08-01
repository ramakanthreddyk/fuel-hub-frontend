/**
 * @file components/error/__tests__/ErrorStates.test.tsx
 * @description Comprehensive tests for error state components
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ErrorState,
  NetworkError,
  ServerError,
  NotFoundError,
  PermissionError,
  TimeoutError,
  GenericError,
  DataLoadError,
  RateLimitError,
  InlineError,
  ComponentErrorFallback,
} from '../ErrorStates';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="error-card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="error-content">{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button onClick={onClick} data-testid={`button-${variant || 'default'}`} {...props}>
      {children}
    </button>
  ),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  Wifi: () => <div data-testid="wifi-icon">Wifi</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  FileX: () => <div data-testid="file-x-icon">FileX</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('ErrorStates', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ErrorState (Base Component)', () => {
    it('renders with required props', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
        />
      );

      expect(screen.getByText('Test Error')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
          onRetry={mockOnRetry}
        />
      );

      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('hides retry button when showRetry is false', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
          onRetry={mockOnRetry}
          showRetry={false}
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('renders custom retry label', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
          onRetry={mockOnRetry}
          retryLabel="Retry Now"
        />
      );

      expect(screen.getByText('Retry Now')).toBeInTheDocument();
    });

    it('renders custom actions', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
          actions={<button data-testid="custom-action">Custom Action</button>}
        />
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div data-testid="test-icon">TestIcon</div>}
          className="custom-error-class"
        />
      );

      const card = screen.getByTestId('error-card');
      expect(card).toHaveClass('custom-error-class');
    });
  });

  describe('NetworkError', () => {
    it('renders network error with correct content', () => {
      render(<NetworkError onRetry={mockOnRetry} />);

      expect(screen.getByText('Connection Problem')).toBeInTheDocument();
      expect(screen.getByText(/Unable to connect to the server/)).toBeInTheDocument();
      expect(screen.getByTestId('wifi-icon')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      render(<NetworkError onRetry={mockOnRetry} />);

      fireEvent.click(screen.getByText('Try Again'));
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('ServerError', () => {
    it('renders server error with correct content', () => {
      render(<ServerError onRetry={mockOnRetry} />);

      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(screen.getByText(/Something went wrong on our end/)).toBeInTheDocument();
      expect(screen.getByTestId('database-icon')).toBeInTheDocument();
      expect(screen.getByText('Retry Request')).toBeInTheDocument();
    });
  });

  describe('NotFoundError', () => {
    it('renders not found error with default resource', () => {
      render(<NotFoundError onRetry={mockOnRetry} />);

      expect(screen.getByText('Not Found')).toBeInTheDocument();
      expect(screen.getByText(/The resource you're looking for/)).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByText('Search Again')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('renders not found error with custom resource', () => {
      render(<NotFoundError resource="pump" onRetry={mockOnRetry} />);

      expect(screen.getByText(/The pump you're looking for/)).toBeInTheDocument();
    });

    it('handles go back button click', () => {
      const mockHistoryBack = vi.fn();
      Object.defineProperty(window, 'history', {
        value: { back: mockHistoryBack },
        writable: true,
      });

      render(<NotFoundError onRetry={mockOnRetry} />);

      fireEvent.click(screen.getByText('Go Back'));
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('PermissionError', () => {
    it('renders permission error with correct content', () => {
      render(<PermissionError onRetry={mockOnRetry} />);

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText(/You don't have permission/)).toBeInTheDocument();
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Check Again')).not.toBeInTheDocument(); // showRetry is false
    });

    it('handles dashboard navigation', () => {
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      render(<PermissionError onRetry={mockOnRetry} />);

      fireEvent.click(screen.getByText('Go to Dashboard'));
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  describe('TimeoutError', () => {
    it('renders timeout error with correct content', () => {
      render(<TimeoutError onRetry={mockOnRetry} />);

      expect(screen.getByText('Request Timeout')).toBeInTheDocument();
      expect(screen.getByText(/The request is taking longer than expected/)).toBeInTheDocument();
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('GenericError', () => {
    it('renders generic error with default message', () => {
      render(<GenericError onRetry={mockOnRetry} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('renders generic error with custom message', () => {
      render(<GenericError message="Custom error message" onRetry={mockOnRetry} />);

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('DataLoadError', () => {
    it('renders data load error with correct content', () => {
      render(<DataLoadError onRetry={mockOnRetry} />);

      expect(screen.getByText('Failed to Load Data')).toBeInTheDocument();
      expect(screen.getByText(/We couldn't load the requested data/)).toBeInTheDocument();
      expect(screen.getByTestId('file-x-icon')).toBeInTheDocument();
      expect(screen.getByText('Reload Data')).toBeInTheDocument();
    });
  });

  describe('RateLimitError', () => {
    it('renders rate limit error with countdown', () => {
      render(<RateLimitError retryAfter={60} onRetry={mockOnRetry} />);

      expect(screen.getByText('Too Many Requests')).toBeInTheDocument();
      expect(screen.getByText(/You've made too many requests/)).toBeInTheDocument();
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
      expect(screen.getByText(/Wait 60s/)).toBeInTheDocument();
    });

    it('updates countdown timer', async () => {
      vi.useFakeTimers();
      
      render(<RateLimitError retryAfter={3} onRetry={mockOnRetry} />);

      expect(screen.getByText(/Wait 3s/)).toBeInTheDocument();

      // Advance timer by 1 second
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText(/Wait 2s/)).toBeInTheDocument();
      });

      // Advance timer by another second
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText(/Wait 1s/)).toBeInTheDocument();
      });

      // Advance timer to completion
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('enables retry button when countdown reaches zero', async () => {
      vi.useFakeTimers();
      
      render(<RateLimitError retryAfter={1} onRetry={mockOnRetry} />);

      // Initially disabled
      expect(screen.getByText(/Wait 1s/)).toBeInTheDocument();

      // After countdown
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
        fireEvent.click(retryButton);
        expect(mockOnRetry).toHaveBeenCalledTimes(1);
      });

      vi.useRealTimers();
    });
  });

  describe('InlineError', () => {
    it('renders inline error with default variant', () => {
      render(<InlineError message="Inline error message" onRetry={mockOnRetry} />);

      expect(screen.getByText('Inline error message')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });

    it('renders inline error with compact variant', () => {
      render(<InlineError message="Compact error" variant="compact" onRetry={mockOnRetry} />);

      expect(screen.getByText('Compact error')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('renders without retry button when onRetry is not provided', () => {
      render(<InlineError message="No retry error" />);

      expect(screen.getByText('No retry error')).toBeInTheDocument();
      expect(screen.queryByTestId('refresh-icon')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<InlineError message="Custom class error" className="custom-inline-error" />);

      const errorElement = screen.getByText('Custom class error').closest('div');
      expect(errorElement).toHaveClass('custom-inline-error');
    });
  });

  describe('ComponentErrorFallback', () => {
    const mockError = new Error('Component error');
    const mockResetError = vi.fn();

    it('renders component error fallback', () => {
      render(
        <ComponentErrorFallback
          error={mockError}
          resetError={mockResetError}
          componentName="TestComponent"
        />
      );

      expect(screen.getByText('TestComponent Error')).toBeInTheDocument();
      expect(screen.getByText(/This TestComponent encountered an error/)).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('uses default component name when not provided', () => {
      render(<ComponentErrorFallback error={mockError} resetError={mockResetError} />);

      expect(screen.getByText('component Error')).toBeInTheDocument();
      expect(screen.getByText(/This component encountered an error/)).toBeInTheDocument();
    });

    it('calls resetError when try again is clicked', () => {
      render(<ComponentErrorFallback error={mockError} resetError={mockResetError} />);

      fireEvent.click(screen.getByText('Try Again'));
      expect(mockResetError).toHaveBeenCalledTimes(1);
    });

    it('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<ComponentErrorFallback error={mockError} resetError={mockResetError} />);

      expect(screen.getByText('Error Details')).toBeInTheDocument();
      expect(screen.getByText('Component error')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('hides error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(<ComponentErrorFallback error={mockError} resetError={mockResetError} />);

      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Edge Cases', () => {
    it('handles null onRetry function', () => {
      expect(() => {
        render(<NetworkError onRetry={null as any} />);
      }).not.toThrow();
    });

    it('handles undefined onRetry function', () => {
      expect(() => {
        render(<NetworkError onRetry={undefined} />);
      }).not.toThrow();
    });

    it('handles onRetry function that throws', () => {
      const throwingRetry = vi.fn(() => {
        throw new Error('Retry error');
      });

      render(<NetworkError onRetry={throwingRetry} />);

      expect(() => {
        fireEvent.click(screen.getByText('Try Again'));
      }).toThrow('Retry error');
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      render(<GenericError message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles error messages with special characters', () => {
      const specialMessage = 'Error with <>&"\' characters';
      render(<GenericError message={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles error messages with unicode characters', () => {
      const unicodeMessage = 'Error with 🚨💥🔥 emojis';
      render(<GenericError message={unicodeMessage} />);

      expect(screen.getByText(unicodeMessage)).toBeInTheDocument();
    });

    it('handles empty error messages', () => {
      render(<GenericError message="" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('handles null error messages', () => {
      render(<GenericError message={null as any} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('handles undefined error messages', () => {
      render(<GenericError message={undefined} />);

      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });

    it('handles RateLimitError with zero retryAfter', () => {
      render(<RateLimitError retryAfter={0} onRetry={mockOnRetry} />);

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('handles RateLimitError with negative retryAfter', () => {
      render(<RateLimitError retryAfter={-5} onRetry={mockOnRetry} />);

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('handles RateLimitError with very large retryAfter', () => {
      render(<RateLimitError retryAfter={999999} onRetry={mockOnRetry} />);

      expect(screen.getByText(/Wait 999999s/)).toBeInTheDocument();
    });

    it('handles ComponentErrorFallback with null error', () => {
      render(<ComponentErrorFallback error={null as any} resetError={mockOnRetry} />);

      expect(screen.getByText('component Error')).toBeInTheDocument();
    });

    it('handles ComponentErrorFallback with error without message', () => {
      const errorWithoutMessage = {} as Error;
      render(<ComponentErrorFallback error={errorWithoutMessage} resetError={mockOnRetry} />);

      expect(screen.getByText('component Error')).toBeInTheDocument();
    });

    it('handles ComponentErrorFallback with very long component name', () => {
      const longComponentName = 'VeryLongComponentName'.repeat(10);
      render(
        <ComponentErrorFallback
          error={new Error('Test')}
          resetError={mockOnRetry}
          componentName={longComponentName}
        />
      );

      expect(screen.getByText(`${longComponentName} Error`)).toBeInTheDocument();
    });

    it('handles InlineError with null message', () => {
      render(<InlineError message={null as any} />);

      // Should render without crashing
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('handles InlineError with undefined message', () => {
      render(<InlineError message={undefined as any} />);

      // Should render without crashing
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('handles NotFoundError with null resource', () => {
      render(<NotFoundError resource={null as any} />);

      expect(screen.getByText(/The null you're looking for/)).toBeInTheDocument();
    });

    it('handles NotFoundError with undefined resource', () => {
      render(<NotFoundError resource={undefined} />);

      expect(screen.getByText(/The resource you're looking for/)).toBeInTheDocument();
    });

    it('handles NotFoundError with empty resource', () => {
      render(<NotFoundError resource="" />);

      expect(screen.getByText(/The  you're looking for/)).toBeInTheDocument();
    });

    it('handles window.history not available', () => {
      const originalHistory = window.history;
      delete (window as any).history;

      render(<NotFoundError onRetry={mockOnRetry} />);

      expect(() => {
        fireEvent.click(screen.getByText('Go Back'));
      }).toThrow();

      (window as any).history = originalHistory;
    });

    it('handles window.location not available', () => {
      const originalLocation = window.location;
      delete (window as any).location;

      render(<PermissionError onRetry={mockOnRetry} />);

      expect(() => {
        fireEvent.click(screen.getByText('Go to Dashboard'));
      }).toThrow();

      (window as any).location = originalLocation;
    });

    it('handles setTimeout not available in RateLimitError', () => {
      const originalSetTimeout = global.setTimeout;
      delete (global as any).setTimeout;

      expect(() => {
        render(<RateLimitError retryAfter={5} onRetry={mockOnRetry} />);
      }).toThrow();

      global.setTimeout = originalSetTimeout;
    });

    it('handles clearTimeout not available in RateLimitError', () => {
      const originalClearTimeout = global.clearTimeout;
      delete (global as any).clearTimeout;

      const { unmount } = render(<RateLimitError retryAfter={5} onRetry={mockOnRetry} />);

      expect(() => {
        unmount();
      }).toThrow();

      global.clearTimeout = originalClearTimeout;
    });

    it('handles rapid retry button clicks', () => {
      render(<NetworkError onRetry={mockOnRetry} />);

      const retryButton = screen.getByText('Try Again');

      // Click rapidly 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(retryButton);
      }

      expect(mockOnRetry).toHaveBeenCalledTimes(10);
    });

    it('handles component unmounting during countdown', () => {
      vi.useFakeTimers();

      const { unmount } = render(<RateLimitError retryAfter={10} onRetry={mockOnRetry} />);

      // Start countdown
      vi.advanceTimersByTime(1000);

      // Unmount during countdown
      expect(() => {
        unmount();
      }).not.toThrow();

      vi.useRealTimers();
    });

    it('handles process.env not available', () => {
      const originalProcess = global.process;
      delete (global as any).process;

      render(
        <ComponentErrorFallback
          error={new Error('Test')}
          resetError={mockOnRetry}
        />
      );

      expect(screen.getByText('component Error')).toBeInTheDocument();

      global.process = originalProcess;
    });

    it('handles multiple error state components simultaneously', () => {
      render(
        <div>
          <NetworkError onRetry={mockOnRetry} />
          <ServerError onRetry={mockOnRetry} />
          <TimeoutError onRetry={mockOnRetry} />
        </div>
      );

      expect(screen.getByText('Connection Problem')).toBeInTheDocument();
      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(screen.getByText('Request Timeout')).toBeInTheDocument();

      // All retry buttons should work
      const retryButtons = screen.getAllByText('Try Again');
      retryButtons.forEach(button => {
        fireEvent.click(button);
      });

      expect(mockOnRetry).toHaveBeenCalledTimes(2); // NetworkError and TimeoutError
    });

    it('handles error state with custom actions that throw', () => {
      const ThrowingAction = () => {
        const handleClick = () => {
          throw new Error('Action error');
        };
        return <button onClick={handleClick}>Throwing Action</button>;
      };

      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<div>Icon</div>}
          actions={<ThrowingAction />}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByText('Throwing Action'));
      }).toThrow('Action error');
    });

    it('handles error state with null icon', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={null}
        />
      );

      expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('handles error state with undefined icon', () => {
      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={undefined as any}
        />
      );

      expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('handles error state with complex icon component', () => {
      const ComplexIcon = () => (
        <div>
          <span>Complex</span>
          <span>Icon</span>
        </div>
      );

      render(
        <ErrorState
          title="Test Error"
          description="Test description"
          icon={<ComplexIcon />}
        />
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });
  });
});
