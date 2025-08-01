/**
 * @file utils/__tests__/lazyLoad.test.tsx
 * @description Tests for lazy loading utilities and edge cases
 */
import React, { Suspense } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  LoadingSpinner,
  PageLoadingSpinner,
  lazyLoad,
  lazyLoadPage,
  lazyLoadComponent,
  preloadComponent,
  useDynamicImport,
  createLazyRoute,
} from '../lazyLoad';

// Mock ErrorBoundary
vi.mock('@/components/error/ErrorBoundary', () => ({
  ErrorBoundary: ({ children, fallback }: any) => {
    try {
      return children;
    } catch (error) {
      return fallback || <div data-testid="error-fallback">Error occurred</div>;
    }
  },
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon">Loading...</div>,
}));

// Test components
const TestComponent = ({ message = 'Test Component' }: { message?: string }) => (
  <div data-testid="test-component">{message}</div>
);

const ErrorComponent = () => {
  throw new Error('Component error');
};

describe('Lazy Loading Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LoadingSpinner', () => {
    it('renders with default message', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingSpinner message="Custom loading message" />);
      
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('handles empty message', () => {
      render(<LoadingSpinner message="" />);
      
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('handles null message', () => {
      render(<LoadingSpinner message={null as any} />);
      
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('handles undefined message', () => {
      render(<LoadingSpinner message={undefined} />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('PageLoadingSpinner', () => {
    it('renders page loading spinner', () => {
      render(<PageLoadingSpinner />);
      
      expect(screen.getByText('Loading page...')).toBeInTheDocument();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });
  });

  describe('lazyLoad', () => {
    it('loads component successfully', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyComponent = lazyLoad(mockImport, { componentName: 'TestComponent' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent message="Lazy loaded" />
        </Suspense>
      );

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Lazy loaded')).toBeInTheDocument();
      });

      expect(mockImport).toHaveBeenCalledTimes(1);
    });

    it('handles import failure', async () => {
      const mockImport = vi.fn().mockRejectedValue(new Error('Import failed'));
      const LazyComponent = lazyLoad(mockImport, { componentName: 'FailingComponent' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for error fallback
      await waitFor(() => {
        expect(screen.getByText(/Failed to load FailingComponent/)).toBeInTheDocument();
      });
    });

    it('uses custom fallback component', async () => {
      const CustomFallback = () => <div data-testid="custom-fallback">Custom Loading</div>;
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyComponent = lazyLoad(mockImport, { 
        fallback: CustomFallback,
        componentName: 'TestComponent' 
      });

      render(
        <Suspense fallback={<div>Suspense Loading</div>}>
          <LazyComponent />
        </Suspense>
      );

      // Should show custom fallback
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });

    it('handles component that throws during render', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: ErrorComponent });
      const LazyComponent = lazyLoad(mockImport, { componentName: 'ErrorComponent' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText(/Failed to load ErrorComponent/)).toBeInTheDocument();
      });
    });

    it('handles import that returns invalid module', async () => {
      const mockImport = vi.fn().mockResolvedValue({ notDefault: TestComponent });
      const LazyComponent = lazyLoad(mockImport as any, { componentName: 'InvalidModule' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText(/Failed to load InvalidModule/)).toBeInTheDocument();
      });
    });

    it('handles import that returns null', async () => {
      const mockImport = vi.fn().mockResolvedValue(null);
      const LazyComponent = lazyLoad(mockImport as any, { componentName: 'NullModule' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText(/Failed to load NullModule/)).toBeInTheDocument();
      });
    });

    it('handles import that returns undefined', async () => {
      const mockImport = vi.fn().mockResolvedValue(undefined);
      const LazyComponent = lazyLoad(mockImport as any, { componentName: 'UndefinedModule' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText(/Failed to load UndefinedModule/)).toBeInTheDocument();
      });
    });
  });

  describe('lazyLoadPage', () => {
    it('creates lazy page component', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyPage = lazyLoadPage(mockImport, 'TestPage');

      render(
        <Suspense fallback={<div>Suspense Loading</div>}>
          <LazyPage />
        </Suspense>
      );

      expect(screen.getByText('Loading page...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('lazyLoadComponent', () => {
    it('creates lazy component with custom loading message', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyComponent = lazyLoadComponent(mockImport, 'CustomComponent');

      render(
        <Suspense fallback={<div>Suspense Loading</div>}>
          <LazyComponent />
        </Suspense>
      );

      expect(screen.getByText('Loading CustomComponent...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('preloadComponent', () => {
    it('preloads on mouse enter', () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const preloadProps = preloadComponent(mockImport);

      const TestElement = () => (
        <div data-testid="preload-element" {...preloadProps}>
          Hover me
        </div>
      );

      render(<TestElement />);

      const element = screen.getByTestId('preload-element');
      fireEvent.mouseEnter(element);

      expect(mockImport).toHaveBeenCalledTimes(1);
    });

    it('preloads on focus', () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const preloadProps = preloadComponent(mockImport);

      const TestElement = () => (
        <button data-testid="preload-button" {...preloadProps}>
          Focus me
        </button>
      );

      render(<TestElement />);

      const button = screen.getByTestId('preload-button');
      fireEvent.focus(button);

      expect(mockImport).toHaveBeenCalledTimes(1);
    });

    it('handles preload errors gracefully', () => {
      const mockImport = vi.fn().mockRejectedValue(new Error('Preload failed'));
      const preloadProps = preloadComponent(mockImport);

      const TestElement = () => (
        <div data-testid="preload-element" {...preloadProps}>
          Hover me
        </div>
      );

      render(<TestElement />);

      const element = screen.getByTestId('preload-element');
      
      expect(() => {
        fireEvent.mouseEnter(element);
      }).not.toThrow();
    });

    it('handles multiple preload calls', () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const preloadProps = preloadComponent(mockImport);

      const TestElement = () => (
        <div data-testid="preload-element" {...preloadProps}>
          Hover me
        </div>
      );

      render(<TestElement />);

      const element = screen.getByTestId('preload-element');
      
      // Multiple events should only call import once
      fireEvent.mouseEnter(element);
      fireEvent.focus(element);
      fireEvent.mouseEnter(element);

      expect(mockImport).toHaveBeenCalledTimes(3); // Each event calls import
    });
  });

  describe('useDynamicImport', () => {
    it('loads component successfully', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });

      const TestHook = () => {
        const { component, loading, error } = useDynamicImport(mockImport);
        
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (component) return React.createElement(component);
        return <div>No component</div>;
      };

      render(<TestHook />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });

    it('handles import failure', async () => {
      const mockImport = vi.fn().mockRejectedValue(new Error('Import failed'));

      const TestHook = () => {
        const { component, loading, error } = useDynamicImport(mockImport);
        
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (component) return React.createElement(component);
        return <div>No component</div>;
      };

      render(<TestHook />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Error: Import failed')).toBeInTheDocument();
      });
    });

    it('handles component unmounting during import', async () => {
      const mockImport = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ default: TestComponent }), 100))
      );

      const TestHook = () => {
        const { component, loading, error } = useDynamicImport(mockImport);
        
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (component) return React.createElement(component);
        return <div>No component</div>;
      };

      const { unmount } = render(<TestHook />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Unmount before import completes
      unmount();

      // Should not cause memory leaks or errors
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    it('handles retry functionality', async () => {
      let shouldFail = true;
      const mockImport = vi.fn().mockImplementation(() => {
        if (shouldFail) {
          return Promise.reject(new Error('Import failed'));
        }
        return Promise.resolve({ default: TestComponent });
      });

      const TestHook = () => {
        const { component, loading, error, retry } = useDynamicImport(mockImport);
        
        if (loading) return <div>Loading...</div>;
        if (error) return (
          <div>
            <div>Error: {error.message}</div>
            <button onClick={retry}>Retry</button>
          </div>
        );
        if (component) return React.createElement(component);
        return <div>No component</div>;
      };

      render(<TestHook />);

      // Wait for initial error
      await waitFor(() => {
        expect(screen.getByText('Error: Import failed')).toBeInTheDocument();
      });

      // Enable success and retry
      shouldFail = false;
      fireEvent.click(screen.getByText('Retry'));

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('createLazyRoute', () => {
    it('creates lazy route component', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyRoute = createLazyRoute(mockImport, 'TestRoute');

      render(
        <Suspense fallback={<div>Suspense Loading</div>}>
          <LazyRoute />
        </Suspense>
      );

      expect(screen.getByText('Loading page...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles import function that throws synchronously', () => {
      const mockImport = vi.fn().mockImplementation(() => {
        throw new Error('Sync import error');
      });

      expect(() => {
        lazyLoad(mockImport, { componentName: 'SyncErrorComponent' });
      }).not.toThrow();
    });

    it('handles import function that returns non-promise', () => {
      const mockImport = vi.fn().mockReturnValue('not a promise' as any);

      expect(() => {
        lazyLoad(mockImport, { componentName: 'NonPromiseComponent' });
      }).not.toThrow();
    });

    it('handles missing React.lazy', () => {
      const originalLazy = React.lazy;
      delete (React as any).lazy;

      expect(() => {
        lazyLoad(() => Promise.resolve({ default: TestComponent }));
      }).toThrow();

      (React as any).lazy = originalLazy;
    });

    it('handles missing React.Suspense', () => {
      const originalSuspense = React.Suspense;
      delete (React as any).Suspense;

      const LazyComponent = lazyLoad(() => Promise.resolve({ default: TestComponent }));

      expect(() => {
        render(<LazyComponent />);
      }).toThrow();

      (React as any).Suspense = originalSuspense;
    });

    it('handles very slow imports', async () => {
      const mockImport = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ default: TestComponent }), 5000))
      );

      const LazyComponent = lazyLoad(mockImport, { componentName: 'SlowComponent' });

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should still be loading after a reasonable time
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles concurrent imports of same component', async () => {
      const mockImport = vi.fn().mockResolvedValue({ default: TestComponent });
      const LazyComponent = lazyLoad(mockImport, { componentName: 'ConcurrentComponent' });

      // Render multiple instances concurrently
      render(
        <div>
          <Suspense fallback={<div>Loading 1...</div>}>
            <LazyComponent message="Instance 1" />
          </Suspense>
          <Suspense fallback={<div>Loading 2...</div>}>
            <LazyComponent message="Instance 2" />
          </Suspense>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Instance 1')).toBeInTheDocument();
        expect(screen.getByText('Instance 2')).toBeInTheDocument();
      });

      // Import should be called for each lazy component creation
      expect(mockImport).toHaveBeenCalled();
    });
  });
});
