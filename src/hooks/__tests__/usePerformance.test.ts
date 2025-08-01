/**
 * @file hooks/__tests__/usePerformance.test.ts
 * @description Tests for performance monitoring hooks
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  usePerformanceMonitor, 
  useDebounce, 
  useThrottle,
  useIntersectionObserver,
  useVirtualScrolling,
  useMemoryMonitor
} from '../usePerformance';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => 100),
  memory: {
    usedJSHeapSize: 10 * 1024 * 1024, // 10MB
    totalJSHeapSize: 50 * 1024 * 1024, // 50MB
    jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe('Performance Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('usePerformanceMonitor', () => {
    it('tracks render count', () => {
      const { result, rerender } = renderHook(() => 
        usePerformanceMonitor('TestComponent')
      );

      expect(result.current.renderCount).toBe(1);

      rerender();
      expect(result.current.renderCount).toBe(2);

      rerender();
      expect(result.current.renderCount).toBe(3);
    });

    it('returns component name', () => {
      const { result } = renderHook(() => 
        usePerformanceMonitor('TestComponent')
      );

      expect(result.current.componentName).toBe('TestComponent');
    });

    it('warns about slow renders in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const consoleSpy = vi.spyOn(console, 'warn');
      
      // Mock slow render (>16ms)
      mockPerformance.now
        .mockReturnValueOnce(0)  // Start time
        .mockReturnValueOnce(20); // End time (20ms render)

      renderHook(() => usePerformanceMonitor('SlowComponent'));

      expect(consoleSpy).toHaveBeenCalledWith(
        '🐌 Slow render detected in SlowComponent:',
        expect.objectContaining({
          renderTime: '20.00ms',
          renderCount: 1,
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('logs performance metrics in production for very slow renders', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const consoleSpy = vi.spyOn(console, 'log');
      
      // Mock very slow render (>100ms)
      mockPerformance.now
        .mockReturnValueOnce(0)   // Start time
        .mockReturnValueOnce(150); // End time (150ms render)

      renderHook(() => usePerformanceMonitor('VerySlowComponent'));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Performance metrics:',
        expect.objectContaining({
          renderTime: 150,
          componentName: 'VerySlowComponent',
          timestamp: expect.any(Number),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('includes props information when provided', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const consoleSpy = vi.spyOn(console, 'warn');
      
      // Mock slow render
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);

      const props = { id: 'test', name: 'Test Component' };
      renderHook(() => usePerformanceMonitor('TestComponent', props));

      expect(consoleSpy).toHaveBeenCalledWith(
        '🐌 Slow render detected in TestComponent:',
        expect.objectContaining({
          props: ['id', 'name'],
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('useDebounce', () => {
    it('debounces value changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      expect(result.current).toBe('initial');

      // Change value multiple times quickly
      rerender({ value: 'change1', delay: 100 });
      expect(result.current).toBe('initial'); // Still old value

      rerender({ value: 'change2', delay: 100 });
      expect(result.current).toBe('initial'); // Still old value

      rerender({ value: 'final', delay: 100 });
      expect(result.current).toBe('initial'); // Still old value

      // Wait for debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current).toBe('final');
    });

    it('updates immediately when delay is 0', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'changed', delay: 0 });
      expect(result.current).toBe('changed');
    });
  });

  describe('useThrottle', () => {
    it('throttles value changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, limit }) => useThrottle(value, limit),
        { initialProps: { value: 'initial', limit: 100 } }
      );

      expect(result.current).toBe('initial');

      // Change value quickly
      rerender({ value: 'change1', limit: 100 });
      
      // Should not update immediately due to throttling
      expect(result.current).toBe('initial');

      // Wait for throttle limit
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      expect(result.current).toBe('change1');
    });
  });

  describe('useIntersectionObserver', () => {
    it('sets up intersection observer', () => {
      const ref = { current: document.createElement('div') };
      
      renderHook(() => useIntersectionObserver(ref));

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
        })
      );
    });

    it('returns initial intersection state', () => {
      const ref = { current: document.createElement('div') };
      
      const { result } = renderHook(() => useIntersectionObserver(ref));

      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.hasIntersected).toBe(false);
    });

    it('handles null ref', () => {
      const ref = { current: null };
      
      expect(() => {
        renderHook(() => useIntersectionObserver(ref));
      }).not.toThrow();
    });

    it('accepts custom options', () => {
      const ref = { current: document.createElement('div') };
      const options = { threshold: 0.5, rootMargin: '10px' };
      
      renderHook(() => useIntersectionObserver(ref, options));

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.5,
          rootMargin: '10px',
        })
      );
    });
  });

  describe('useVirtualScrolling', () => {
    const mockItems = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
    const itemHeight = 50;
    const containerHeight = 400;

    it('calculates visible range correctly', () => {
      const { result } = renderHook(() => 
        useVirtualScrolling(mockItems, itemHeight, containerHeight)
      );

      expect(result.current.visibleItems).toHaveLength(13); // 8 visible + 5 overscan
      expect(result.current.totalHeight).toBe(50000); // 1000 * 50
      expect(result.current.offsetY).toBe(0);
    });

    it('updates visible range on scroll', () => {
      const { result } = renderHook(() => 
        useVirtualScrolling(mockItems, itemHeight, containerHeight)
      );

      // Simulate scroll
      const mockEvent = {
        currentTarget: { scrollTop: 500 }
      } as React.UIEvent<HTMLDivElement>;

      act(() => {
        result.current.handleScroll(mockEvent);
      });

      expect(result.current.offsetY).toBe(250); // (10 - 5) * 50
      expect(result.current.visibleItems[0].index).toBe(5); // startIndex - overscan
    });

    it('handles custom overscan', () => {
      const { result } = renderHook(() => 
        useVirtualScrolling(mockItems, itemHeight, containerHeight, 10)
      );

      expect(result.current.visibleItems).toHaveLength(28); // 8 visible + 20 overscan
    });

    it('handles empty items array', () => {
      const { result } = renderHook(() => 
        useVirtualScrolling([], itemHeight, containerHeight)
      );

      expect(result.current.visibleItems).toHaveLength(0);
      expect(result.current.totalHeight).toBe(0);
      expect(result.current.offsetY).toBe(0);
    });
  });

  describe('useMemoryMonitor', () => {
    it('returns memory usage function', () => {
      const { result } = renderHook(() => useMemoryMonitor('TestComponent'));

      const memoryUsage = result.current.getCurrentMemoryUsage();
      
      expect(memoryUsage).toEqual({
        used: 10 * 1024 * 1024,
        total: 50 * 1024 * 1024,
        limit: 100 * 1024 * 1024,
      });
    });

    it('returns null when memory API is not available', () => {
      const originalPerformance = global.performance;
      global.performance = { ...mockPerformance, memory: undefined };

      const { result } = renderHook(() => useMemoryMonitor('TestComponent'));

      const memoryUsage = result.current.getCurrentMemoryUsage();
      expect(memoryUsage).toBeNull();

      global.performance = originalPerformance;
    });

    it('warns about memory increases', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      
      // Mock increasing memory usage
      const mockMemoryIncrease = {
        ...mockPerformance.memory,
        usedJSHeapSize: 25 * 1024 * 1024, // 25MB (15MB increase)
      };

      global.performance = {
        ...mockPerformance,
        memory: mockMemoryIncrease,
      };

      renderHook(() => useMemoryMonitor('MemoryHeavyComponent'));

      expect(consoleSpy).toHaveBeenCalledWith(
        '📈 Memory usage increased in MemoryHeavyComponent:',
        expect.objectContaining({
          current: '25.00MB',
          increase: expect.stringContaining('MB'),
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles performance.now not available', () => {
      const originalNow = global.performance.now;
      delete (global.performance as any).now;

      expect(() => {
        renderHook(() => usePerformanceMonitor('TestComponent'));
      }).not.toThrow();

      global.performance.now = originalNow;
    });

    it('handles component unmounting during debounce', () => {
      const { result, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      expect(result.current).toBe('initial');

      // Unmount before debounce completes
      unmount();

      // Should not throw or cause memory leaks
      expect(() => {
        // Trigger any pending timeouts
        vi.runAllTimers();
      }).not.toThrow();
    });

    it('handles performance API completely unavailable', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      expect(() => {
        renderHook(() => usePerformanceMonitor('TestComponent'));
      }).not.toThrow();

      global.performance = originalPerformance;
    });

    it('handles negative performance values', () => {
      mockPerformance.now
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(50); // Negative duration

      const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

      expect(result.current.componentName).toBe('TestComponent');
    });

    it('handles extremely large performance values', () => {
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(Number.MAX_SAFE_INTEGER);

      const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

      expect(result.current.componentName).toBe('TestComponent');
    });

    it('handles NaN performance values', () => {
      mockPerformance.now
        .mockReturnValueOnce(NaN)
        .mockReturnValueOnce(100);

      const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

      expect(result.current.componentName).toBe('TestComponent');
    });

    it('handles Infinity performance values', () => {
      mockPerformance.now
        .mockReturnValueOnce(Infinity)
        .mockReturnValueOnce(100);

      const { result } = renderHook(() => usePerformanceMonitor('TestComponent'));

      expect(result.current.componentName).toBe('TestComponent');
    });

    it('handles debounce with zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'changed', delay: 0 });
      expect(result.current).toBe('changed');
    });

    it('handles debounce with negative delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: -100 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'changed', delay: -100 });
      // Should behave like zero delay
      expect(result.current).toBe('changed');
    });

    it('handles throttle with zero limit', () => {
      const { result, rerender } = renderHook(
        ({ value, limit }) => useThrottle(value, limit),
        { initialProps: { value: 'initial', limit: 0 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'changed', limit: 0 });
      expect(result.current).toBe('changed');
    });

    it('handles throttle with negative limit', () => {
      const { result, rerender } = renderHook(
        ({ value, limit }) => useThrottle(value, limit),
        { initialProps: { value: 'initial', limit: -100 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'changed', limit: -100 });
      expect(result.current).toBe('changed');
    });

    it('handles intersection observer not available', () => {
      const originalIntersectionObserver = global.IntersectionObserver;
      delete (global as any).IntersectionObserver;

      const ref = { current: document.createElement('div') };

      expect(() => {
        renderHook(() => useIntersectionObserver(ref));
      }).toThrow();

      global.IntersectionObserver = originalIntersectionObserver;
    });

    it('handles intersection observer constructor throwing', () => {
      const originalIntersectionObserver = global.IntersectionObserver;
      global.IntersectionObserver = vi.fn(() => {
        throw new Error('IntersectionObserver error');
      });

      const ref = { current: document.createElement('div') };

      expect(() => {
        renderHook(() => useIntersectionObserver(ref));
      }).toThrow();

      global.IntersectionObserver = originalIntersectionObserver;
    });

    it('handles virtual scrolling with negative item height', () => {
      const mockItems = ['item1', 'item2', 'item3'];
      const { result } = renderHook(() =>
        useVirtualScrolling(mockItems, -50, 400)
      );

      expect(result.current.totalHeight).toBe(-150);
      expect(result.current.visibleItems).toHaveLength(0);
    });

    it('handles virtual scrolling with zero container height', () => {
      const mockItems = ['item1', 'item2', 'item3'];
      const { result } = renderHook(() =>
        useVirtualScrolling(mockItems, 50, 0)
      );

      expect(result.current.visibleItems).toHaveLength(5); // Just overscan
    });

    it('handles virtual scrolling with extremely large overscan', () => {
      const mockItems = ['item1', 'item2', 'item3'];
      const { result } = renderHook(() =>
        useVirtualScrolling(mockItems, 50, 400, 1000)
      );

      expect(result.current.visibleItems).toHaveLength(3); // Limited by items length
    });

    it('handles virtual scrolling with negative overscan', () => {
      const mockItems = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const { result } = renderHook(() =>
        useVirtualScrolling(mockItems, 50, 400, -5)
      );

      expect(result.current.visibleItems.length).toBeGreaterThan(0);
    });

    it('handles memory monitor with corrupted memory object', () => {
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 'invalid' as any,
        totalJSHeapSize: null as any,
        jsHeapSizeLimit: undefined as any,
      };

      const { result } = renderHook(() => useMemoryMonitor('TestComponent'));

      const memoryUsage = result.current.getCurrentMemoryUsage();
      expect(memoryUsage).toEqual({
        used: 'invalid',
        total: null,
        limit: undefined,
      });

      (global.performance as any).memory = originalMemory;
    });

    it('handles memory monitor with memory object throwing', () => {
      const originalMemory = (global.performance as any).memory;
      Object.defineProperty(global.performance, 'memory', {
        get: () => {
          throw new Error('Memory access denied');
        },
        configurable: true,
      });

      expect(() => {
        renderHook(() => useMemoryMonitor('TestComponent'));
      }).not.toThrow();

      Object.defineProperty(global.performance, 'memory', {
        value: originalMemory,
        configurable: true,
      });
    });

    it('handles Date.now throwing in performance monitor', () => {
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => {
        throw new Error('Date.now error');
      });

      expect(() => {
        renderHook(() => usePerformanceMonitor('TestComponent'));
      }).not.toThrow();

      Date.now = originalDateNow;
    });

    it('handles setTimeout not available in debounce', () => {
      const originalSetTimeout = global.setTimeout;
      delete (global as any).setTimeout;

      expect(() => {
        renderHook(() => useDebounce('test', 100));
      }).toThrow();

      global.setTimeout = originalSetTimeout;
    });

    it('handles clearTimeout not available in debounce', () => {
      const originalClearTimeout = global.clearTimeout;
      delete (global as any).clearTimeout;

      const { unmount } = renderHook(() => useDebounce('test', 100));

      expect(() => {
        unmount();
      }).toThrow();

      global.clearTimeout = originalClearTimeout;
    });

    it('handles extremely rapid value changes in debounce', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      // Change value 1000 times rapidly
      for (let i = 0; i < 1000; i++) {
        rerender({ value: `value-${i}`, delay: 100 });
      }

      expect(result.current).toBe('initial'); // Should still be initial due to debouncing
    });

    it('handles memory pressure during performance monitoring', () => {
      // Simulate memory pressure
      const originalMemory = (global.performance as any).memory;
      (global.performance as any).memory = {
        usedJSHeapSize: 1024 * 1024 * 1024, // 1GB
        totalJSHeapSize: 1024 * 1024 * 1024,
        jsHeapSizeLimit: 1024 * 1024 * 1024,
      };

      const consoleSpy = vi.spyOn(console, 'warn');

      renderHook(() => useMemoryMonitor('MemoryIntensiveComponent'));

      expect(consoleSpy).toHaveBeenCalled();

      (global.performance as any).memory = originalMemory;
    });

    it('handles component with null or undefined name', () => {
      expect(() => {
        renderHook(() => usePerformanceMonitor(null as any));
      }).not.toThrow();

      expect(() => {
        renderHook(() => usePerformanceMonitor(undefined as any));
      }).not.toThrow();
    });

    it('handles props with circular references', () => {
      const circularProps: any = { name: 'test' };
      circularProps.self = circularProps;

      expect(() => {
        renderHook(() => usePerformanceMonitor('TestComponent', circularProps));
      }).not.toThrow();
    });

    it('handles props with very deep nesting', () => {
      let deepProps: any = {};
      let current = deepProps;

      // Create 1000 levels of nesting
      for (let i = 0; i < 1000; i++) {
        current.nested = {};
        current = current.nested;
      }

      expect(() => {
        renderHook(() => usePerformanceMonitor('TestComponent', deepProps));
      }).not.toThrow();
    });

    it('handles intersection observer with invalid options', () => {
      const ref = { current: document.createElement('div') };
      const invalidOptions = {
        threshold: 'invalid' as any,
        rootMargin: 123 as any,
        root: 'not-an-element' as any,
      };

      expect(() => {
        renderHook(() => useIntersectionObserver(ref, invalidOptions));
      }).not.toThrow();
    });

    it('handles virtual scrolling with non-array items', () => {
      expect(() => {
        renderHook(() => useVirtualScrolling(null as any, 50, 400));
      }).not.toThrow(); // Should handle gracefully

      expect(() => {
        renderHook(() => useVirtualScrolling(undefined as any, 50, 400));
      }).not.toThrow(); // Should handle gracefully

      expect(() => {
        renderHook(() => useVirtualScrolling('not-an-array' as any, 50, 400));
      }).not.toThrow(); // Should handle gracefully
    });
  });
});
