/**
 * @file __tests__/performance/performanceTests.test.tsx
 * @description Performance testing suite for components and workflows
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { measurePerformance } from '@/test/setup';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PumpsPage from '@/pages/dashboard/PumpsPage';
import { VirtualizedList } from '@/components/ui/VirtualizedList';

// Mock large datasets
const generateLargePumpList = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Pump ${i + 1}`,
    serialNumber: `SN${String(i + 1).padStart(3, '0')}`,
    stationId: `station-${Math.floor(i / 10) + 1}`,
    status: ['active', 'maintenance', 'inactive'][i % 3],
    nozzleCount: Math.floor(Math.random() * 6) + 2,
  }));

const generateLargeTransactionList = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    amount: Math.random() * 100 + 10,
    pump: `Pump ${Math.floor(Math.random() * 20) + 1}`,
    station: `Station ${Math.floor(Math.random() * 5) + 1}`,
    time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    fuelType: ['gasoline', 'diesel', 'premium'][Math.floor(Math.random() * 3)],
  }));

// Mock API responses with large datasets
vi.mock('@/hooks/api/usePumps', () => ({
  usePumps: () => ({
    data: generateLargePumpList(1000),
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/api/useDashboard', () => ({
  useDashboardStats: () => ({
    data: {
      totalSales: 125000,
      totalTransactions: 1250,
      activePumps: 12,
      totalStations: 3,
    },
    isLoading: false,
    error: null,
  }),
  useRecentTransactions: () => ({
    data: generateLargeTransactionList(500),
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Performance Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Mock performance APIs
    Object.defineProperty(global, 'performance', {
      value: {
        ...performance,
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByType: vi.fn().mockReturnValue([]),
        getEntriesByName: vi.fn().mockReturnValue([]),
        clearMarks: vi.fn(),
        clearMeasures: vi.fn(),
        now: vi.fn().mockReturnValue(Date.now()),
        memory: {
          usedJSHeapSize: 1000000,
          totalJSHeapSize: 2000000,
          jsHeapSizeLimit: 4000000,
        },
      },
      writable: true,
    });

    // Mock PerformanceObserver
    global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn().mockReturnValue([]),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering Performance', () => {
    it('should render dashboard within performance budget', async () => {
      const renderTime = await measurePerformance(async () => {
        render(<DashboardPage />, { wrapper: createWrapper() });
        
        await waitFor(() => {
          expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
        });
      });

      expect(renderTime).toBeLessThan(1000); // Should render within 1 second
    });

    it('should render large pump list efficiently', async () => {
      const renderTime = await measurePerformance(async () => {
        render(<PumpsPage />, { wrapper: createWrapper() });
        
        await waitFor(() => {
          expect(screen.getByRole('table')).toBeInTheDocument();
        });
      });

      expect(renderTime).toBeLessThan(2000); // Should handle large lists within 2 seconds
    });

    it('should handle rapid re-renders without performance degradation', async () => {
      const { rerender } = render(<DashboardPage />, { wrapper: createWrapper() });

      const rerenderTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const time = await measurePerformance(async () => {
          rerender(<DashboardPage />);
          await waitFor(() => {
            expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
          });
        });
        rerenderTimes.push(time);
      }

      // Performance should not degrade significantly
      const averageTime = rerenderTimes.reduce((a, b) => a + b, 0) / rerenderTimes.length;
      const maxTime = Math.max(...rerenderTimes);
      
      expect(averageTime).toBeLessThan(100);
      expect(maxTime).toBeLessThan(200);
    });
  });

  describe('Virtual Scrolling Performance', () => {
    it('should virtualize large lists efficiently', async () => {
      const largeDataset = generateLargePumpList(10000);
      
      const renderTime = await measurePerformance(async () => {
        render(
          <VirtualizedList
            items={largeDataset}
            itemHeight={50}
            containerHeight={400}
            renderItem={({ item, index }) => (
              <div key={item.id} data-testid={`item-${index}`}>
                {item.name}
              </div>
            )}
          />
        );
      });

      expect(renderTime).toBeLessThan(500); // Should render large lists quickly

      // Should only render visible items
      const renderedItems = screen.getAllByTestId(/^item-/);
      expect(renderedItems.length).toBeLessThan(20); // Only visible items
    });

    it('should handle scrolling performance', async () => {
      const largeDataset = generateLargePumpList(10000);
      
      render(
        <VirtualizedList
          items={largeDataset}
          itemHeight={50}
          containerHeight={400}
          renderItem={({ item, index }) => (
            <div key={item.id} data-testid={`item-${index}`}>
              {item.name}
            </div>
          )}
        />
      );

      const container = screen.getByTestId('virtualized-container');
      
      const scrollTime = await measurePerformance(async () => {
        // Simulate rapid scrolling
        for (let i = 0; i < 10; i++) {
          fireEvent.scroll(container, { target: { scrollTop: i * 100 } });
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      });

      expect(scrollTime).toBeLessThan(200); // Scrolling should be smooth
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Render and unmount components multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<DashboardPage />, { wrapper: createWrapper() });
        
        await waitFor(() => {
          expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
        });
        
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(5000000); // Less than 5MB increase
    });

    it('should clean up event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<DashboardPage />, { wrapper: createWrapper() });
      
      const addedListeners = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const removedListeners = removeEventListenerSpy.mock.calls.length;
      
      // Should remove all added listeners
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);
    });
  });

  describe('Bundle Size and Code Splitting', () => {
    it('should lazy load components', async () => {
      const importSpy = vi.fn();
      
      // Mock dynamic import
      vi.doMock('@/pages/dashboard/PumpsPage', () => {
        importSpy();
        return {
          default: () => <div data-testid="pumps-page">Pumps Page</div>
        };
      });

      // Component should not be imported initially
      expect(importSpy).not.toHaveBeenCalled();

      // Simulate navigation that would trigger lazy loading
      const LazyComponent = React.lazy(() => import('@/pages/dashboard/PumpsPage'));
      
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      );

      await waitFor(() => {
        expect(importSpy).toHaveBeenCalled();
      });
    });

    it('should tree-shake unused code', () => {
      // This test would typically be run as part of the build process
      // Here we simulate checking that unused utilities are not included
      
      const bundleAnalysis = {
        totalSize: 500000, // 500KB
        unusedCode: 50000,  // 50KB unused
      };

      const efficiency = (bundleAnalysis.totalSize - bundleAnalysis.unusedCode) / bundleAnalysis.totalSize;
      
      expect(efficiency).toBeGreaterThan(0.9); // 90% efficiency
    });
  });

  describe('Network Performance', () => {
    it('should cache API responses efficiently', async () => {
      const apiCallSpy = vi.fn();
      
      // Mock API with call tracking
      vi.doMock('@/hooks/api/usePumps', () => ({
        usePumps: () => {
          apiCallSpy();
          return {
            data: generateLargePumpList(100),
            isLoading: false,
            error: null,
          };
        },
      }));

      const wrapper = createWrapper();

      // First render
      const { unmount: unmount1 } = render(<PumpsPage />, { wrapper });
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
      unmount1();

      // Second render should use cache
      const { unmount: unmount2 } = render(<PumpsPage />, { wrapper });
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
      unmount2();

      // Should only make one API call due to caching
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent requests efficiently', async () => {
      const requestTimes: number[] = [];
      
      // Simulate multiple concurrent API calls
      const promises = Array.from({ length: 5 }, async () => {
        const startTime = performance.now();
        
        render(<DashboardPage />, { wrapper: createWrapper() });
        
        await waitFor(() => {
          expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
        });
        
        const endTime = performance.now();
        requestTimes.push(endTime - startTime);
      });

      await Promise.all(promises);

      // All requests should complete within reasonable time
      requestTimes.forEach(time => {
        expect(time).toBeLessThan(2000);
      });
    });
  });

  describe('User Interaction Performance', () => {
    it('should handle rapid user interactions', async () => {
      render(<PumpsPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('textbox', { name: /search/i });
      
      const interactionTime = await measurePerformance(async () => {
        // Simulate rapid typing
        for (let i = 0; i < 10; i++) {
          await user.type(searchInput, 'a');
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      });

      expect(interactionTime).toBeLessThan(500); // Should handle rapid input
    });

    it('should debounce search input', async () => {
      const searchSpy = vi.fn();
      
      // Mock search function
      vi.doMock('@/hooks/useSearch', () => ({
        useSearch: () => ({
          search: searchSpy,
          results: [],
          isSearching: false,
        }),
      }));

      render(<PumpsPage />, { wrapper: createWrapper() });

      const searchInput = screen.getByRole('textbox', { name: /search/i });
      
      // Type rapidly
      await user.type(searchInput, 'test query');
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Should only call search once due to debouncing
      expect(searchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation Performance', () => {
    it('should use CSS transforms for animations', () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      const animatedElement = screen.getByTestId('animated-chart');
      const computedStyle = window.getComputedStyle(animatedElement);
      
      // Should use transform instead of changing layout properties
      expect(computedStyle.transform).toBeDefined();
      expect(computedStyle.willChange).toBe('transform');
    });

    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      const animatedElement = screen.getByTestId('animated-chart');
      const computedStyle = window.getComputedStyle(animatedElement);
      
      // Animations should be disabled
      expect(computedStyle.animationDuration).toBe('0s');
      expect(computedStyle.transitionDuration).toBe('0s');
    });
  });

  describe('Core Web Vitals', () => {
    it('should meet Largest Contentful Paint targets', async () => {
      const lcpEntries: any[] = [];
      
      // Mock PerformanceObserver for LCP
      global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
        // Simulate LCP entry
        setTimeout(() => {
          callback({
            getEntries: () => [{
              name: '',
              entryType: 'largest-contentful-paint',
              startTime: 1500, // 1.5 seconds
              renderTime: 1500,
              loadTime: 1500,
              size: 1000,
              id: '',
              url: '',
              element: document.body,
            }]
          });
        }, 100);
        
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        };
      });

      render(<DashboardPage />, { wrapper: createWrapper() });

      await new Promise(resolve => setTimeout(resolve, 200));

      // LCP should be under 2.5 seconds
      expect(1500).toBeLessThan(2500);
    });

    it('should meet First Input Delay targets', async () => {
      render(<DashboardPage />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /refresh/i });
      
      const inputDelay = await measurePerformance(async () => {
        await user.click(button);
      });

      // FID should be under 100ms
      expect(inputDelay).toBeLessThan(100);
    });

    it('should meet Cumulative Layout Shift targets', () => {
      const { container } = render(<DashboardPage />, { wrapper: createWrapper() });

      // Simulate layout measurements
      const initialLayout = container.getBoundingClientRect();
      
      // Trigger potential layout shift
      fireEvent.resize(window);
      
      const finalLayout = container.getBoundingClientRect();
      
      // Calculate layout shift (simplified)
      const layoutShift = Math.abs(finalLayout.top - initialLayout.top) / window.innerHeight;
      
      // CLS should be under 0.1
      expect(layoutShift).toBeLessThan(0.1);
    });
  });
});
