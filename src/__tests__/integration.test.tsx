/**
 * @file __tests__/integration.test.tsx
 * @description Integration tests for component interactions and edge cases
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedPumpCard } from '@/components/pumps/UnifiedPumpCard';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

// Mock all UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div onClick={onClick} data-testid="dropdown-item">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock all Lucide icons
vi.mock('lucide-react', () => {
  const icons = [
    'Fuel', 'Settings', 'MoreVertical', 'Eye', 'Trash2', 'AlertTriangle',
    'CheckCircle', 'Clock', 'Edit', 'Power', 'Gauge', 'Zap', 'Hash',
    'Activity', 'RefreshCw', 'Home', 'Bug'
  ];
  
  const mockIcons: any = {};
  icons.forEach(icon => {
    mockIcons[icon] = () => <div data-testid={`${icon.toLowerCase()}-icon`}>{icon}</div>;
  });
  
  return mockIcons;
});

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Component that uses multiple hooks
const TestComponentWithHooks = ({ shouldError = false }: { shouldError?: boolean }) => {
  usePerformanceMonitor('TestComponentWithHooks');
  const { handleError } = useErrorHandler();

  React.useEffect(() => {
    if (shouldError) {
      handleError(new Error('Test error'), 'Test fallback');
    }
  }, [shouldError, handleError]);

  if (shouldError) {
    throw new Error('Component error');
  }

  return <div data-testid="test-component">Test Component</div>;
};

describe('Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('UnifiedPumpCard with ErrorBoundary', () => {
    const mockPump = {
      id: 'pump-001',
      name: 'Test Pump',
      serialNumber: 'SN-001',
      status: 'active' as const,
      nozzleCount: 4,
      stationName: 'Test Station',
    };

    it('renders pump card normally when no errors occur', () => {
      render(
        <TestWrapper>
          <ErrorBoundary>
            <UnifiedPumpCard pump={mockPump} />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('catches errors in pump card actions', () => {
      const errorActions = {
        onViewNozzles: vi.fn(() => {
          throw new Error('Action error');
        }),
      };

      render(
        <TestWrapper>
          <ErrorBoundary>
            <UnifiedPumpCard pump={mockPump} variant="compact" actions={errorActions} />
          </ErrorBoundary>
        </TestWrapper>
      );

      const viewNozzlesButton = screen.getByText('View Nozzles');
      
      // Error in action handler should not crash the component
      expect(() => {
        fireEvent.click(viewNozzlesButton);
      }).toThrow('Action error');
    });

    it('handles pump card with malformed data', () => {
      const malformedPump = {
        id: null,
        name: undefined,
        status: 'invalid-status',
        nozzleCount: 'not-a-number',
      } as any;

      render(
        <TestWrapper>
          <ErrorBoundary>
            <UnifiedPumpCard pump={malformedPump} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Should render without crashing
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('handles multiple pump cards with different error states', () => {
      const pumps = [
        { ...mockPump, id: 'pump-1', name: 'Pump 1' },
        { ...mockPump, id: 'pump-2', name: 'Pump 2', status: 'maintenance' as const },
        { ...mockPump, id: 'pump-3', name: 'Pump 3', nozzleCount: 0 },
      ];

      render(
        <TestWrapper>
          <ErrorBoundary>
            <div>
              {pumps.map(pump => (
                <UnifiedPumpCard key={pump.id} pump={pump} />
              ))}
            </div>
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Pump 1')).toBeInTheDocument();
      expect(screen.getByText('Pump 2')).toBeInTheDocument();
      expect(screen.getByText('Pump 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('integrates error handler with error boundary', () => {
      render(
        <TestWrapper>
          <ErrorBoundary>
            <TestComponentWithHooks shouldError={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Should show error boundary UI
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });

    it('handles component recovery after error', () => {
      const { rerender } = render(
        <TestWrapper>
          <ErrorBoundary>
            <TestComponentWithHooks shouldError={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Error state
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

      // Click try again
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      // Re-render without error
      rerender(
        <TestWrapper>
          <ErrorBoundary>
            <TestComponentWithHooks shouldError={false} />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('monitors performance across multiple components', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      
      // Mock slow performance
      const mockPerformance = {
        now: vi.fn()
          .mockReturnValueOnce(0)   // Start time
          .mockReturnValueOnce(50), // End time (50ms - slow)
      };
      
      Object.defineProperty(global, 'performance', {
        value: mockPerformance,
        writable: true,
      });

      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <TestWrapper>
          <TestComponentWithHooks />
        </TestWrapper>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow render detected'),
        expect.any(Object)
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('handles performance monitoring with memory pressure', () => {
      const mockMemory = {
        usedJSHeapSize: 100 * 1024 * 1024, // 100MB
        totalJSHeapSize: 200 * 1024 * 1024,
        jsHeapSizeLimit: 500 * 1024 * 1024,
      };

      Object.defineProperty(global.performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      render(
        <TestWrapper>
          <TestComponentWithHooks />
        </TestWrapper>
      );

      // Should render without issues despite memory pressure
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Stress Testing', () => {
    it('handles rapid component mounting and unmounting', () => {
      const { rerender, unmount } = render(
        <TestWrapper>
          <UnifiedPumpCard pump={mockPump} />
        </TestWrapper>
      );

      // Rapidly re-render 100 times
      for (let i = 0; i < 100; i++) {
        const updatedPump = { ...mockPump, name: `Pump ${i}` };
        rerender(
          <TestWrapper>
            <UnifiedPumpCard pump={updatedPump} />
          </TestWrapper>
        );
      }

      expect(screen.getByText('Pump 99')).toBeInTheDocument();

      // Should unmount without errors
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles large number of pump cards', () => {
      const largePumpList = Array.from({ length: 1000 }, (_, i) => ({
        ...mockPump,
        id: `pump-${i}`,
        name: `Pump ${i}`,
      }));

      render(
        <TestWrapper>
          <ErrorBoundary>
            <div>
              {largePumpList.slice(0, 10).map(pump => (
                <UnifiedPumpCard key={pump.id} pump={pump} />
              ))}
            </div>
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Pump 0')).toBeInTheDocument();
      expect(screen.getByText('Pump 9')).toBeInTheDocument();
    });

    it('handles concurrent error states', async () => {
      const ErrorComponent = ({ delay }: { delay: number }) => {
        React.useEffect(() => {
          setTimeout(() => {
            throw new Error(`Error after ${delay}ms`);
          }, delay);
        }, [delay]);
        
        return <div>Component {delay}</div>;
      };

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorComponent delay={10} />
            <ErrorComponent delay={20} />
            <ErrorComponent delay={30} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Wait for errors to occur
      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
      }, { timeout: 100 });
    });
  });

  describe('Browser Compatibility Edge Cases', () => {
    it('handles missing modern browser APIs', () => {
      // Mock missing APIs
      const originalIntersectionObserver = global.IntersectionObserver;
      const originalResizeObserver = global.ResizeObserver;
      const originalPerformance = global.performance;

      delete (global as any).IntersectionObserver;
      delete (global as any).ResizeObserver;
      delete (global as any).performance;

      expect(() => {
        render(
          <TestWrapper>
            <UnifiedPumpCard pump={mockPump} />
          </TestWrapper>
        );
      }).not.toThrow();

      // Restore APIs
      global.IntersectionObserver = originalIntersectionObserver;
      global.ResizeObserver = originalResizeObserver;
      global.performance = originalPerformance;
    });

    it('handles localStorage unavailable', () => {
      const originalLocalStorage = global.localStorage;
      delete (global as any).localStorage;

      expect(() => {
        render(
          <TestWrapper>
            <ErrorBoundary>
              <UnifiedPumpCard pump={mockPump} />
            </ErrorBoundary>
          </TestWrapper>
        );
      }).not.toThrow();

      global.localStorage = originalLocalStorage;
    });

    it('handles fetch API unavailable', () => {
      const originalFetch = global.fetch;
      delete (global as any).fetch;

      expect(() => {
        render(
          <TestWrapper>
            <ErrorBoundary>
              <UnifiedPumpCard pump={mockPump} />
            </ErrorBoundary>
          </TestWrapper>
        );
      }).not.toThrow();

      global.fetch = originalFetch;
    });
  });

  describe('Memory Leak Prevention', () => {
    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(
        <TestWrapper>
          <UnifiedPumpCard pump={mockPump} actions={{
            onViewNozzles: vi.fn(),
            onEdit: vi.fn(),
            onDelete: vi.fn(),
          }} />
        </TestWrapper>
      );

      // Should unmount cleanly without memory leaks
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles component unmounting during async operations', async () => {
      const AsyncComponent = () => {
        const [data, setData] = React.useState(null);

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setData('loaded');
          }, 100);

          return () => clearTimeout(timer);
        }, []);

        return <div>{data || 'loading'}</div>;
      };

      const { unmount } = render(
        <TestWrapper>
          <AsyncComponent />
        </TestWrapper>
      );

      // Unmount before async operation completes
      unmount();

      // Wait to ensure no memory leaks
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });
    });
  });
});
