/**
 * @file hooks/usePerformanceOptimization.ts
 * @description React hooks for performance optimization
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce, throttle } from '@/utils/performance';

// Debounced value hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled callback hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );

  return throttledCallback as T;
}

// Debounced callback hook
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  immediate = false
): T {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay, immediate),
    [callback, delay, immediate]
  );

  return debouncedCallback as T;
}

// Intersection observer hook
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);

  const setRef = useCallback((element: Element | null) => {
    elementRef.current = element;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { isIntersecting, entry, ref: setRef };
}

// Virtual scrolling hook
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
}

// Lazy loading hook
export function useLazyLoading<T>(
  loadFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loadFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, load };
}

// Memory usage monitoring hook
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        setMemoryUsage({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
}

// Performance timing hook
export function usePerformanceTiming() {
  const [timing, setTiming] = useState<PerformanceNavigationTiming | null>(null);

  useEffect(() => {
    const updateTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setTiming(navigation);
      }
    };

    updateTiming();
    window.addEventListener('load', updateTiming);

    return () => {
      window.removeEventListener('load', updateTiming);
    };
  }, []);

  return timing;
}

// Render optimization hook
export function useRenderOptimization<T>(
  value: T,
  compareFn?: (prev: T, next: T) => boolean
): T {
  const ref = useRef<T>(value);

  if (compareFn ? !compareFn(ref.current, value) : ref.current !== value) {
    ref.current = value;
  }

  return ref.current;
}

// Batch updates hook
export function useBatchUpdates<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const pendingUpdates = useRef<((prev: T) => T)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchUpdate = useCallback((updateFn: (prev: T) => T) => {
    pendingUpdates.current.push(updateFn);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setValue(prev => {
        let result = prev;
        pendingUpdates.current.forEach(fn => {
          result = fn(result);
        });
        pendingUpdates.current = [];
        return result;
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, batchUpdate] as const;
}

// Preload hook
export function usePreload(preloadFn: () => Promise<any>) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const preloadedRef = useRef(false);

  const preload = useCallback(async () => {
    if (preloadedRef.current) return;
    
    preloadedRef.current = true;
    try {
      await preloadFn();
      setIsPreloaded(true);
    } catch (error) {
      preloadedRef.current = false;
      console.warn('Preload failed:', error);
    }
  }, [preloadFn]);

  return { isPreloaded, preload };
}

// Idle callback hook
export function useIdleCallback(
  callback: () => void,
  options: { timeout?: number } = {}
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.requestIdleCallback) {
      const timeout = setTimeout(callback, options.timeout || 0);
      return () => clearTimeout(timeout);
    }

    const id = window.requestIdleCallback(callback, options);
    return () => window.cancelIdleCallback(id);
  }, [callback, options.timeout]);
}

// Resource hints hook
export function useResourceHints() {
  const preload = useCallback((href: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  const prefetch = useCallback((href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  const preconnect = useCallback((href: string) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  return { preload, prefetch, preconnect };
}

// Component performance tracking hook
export function useComponentPerformance(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }
  });

  return {
    renderCount: renderCount.current,
  };
}

// Optimized state hook for large objects
export function useOptimizedState<T extends Record<string, any>>(
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback((updates: Partial<T>) => {
    setState(prev => {
      // Only update if there are actual changes
      const hasChanges = Object.keys(updates).some(
        key => prev[key] !== updates[key]
      );
      
      if (!hasChanges) return prev;
      
      return { ...prev, ...updates };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, updateState, resetState] as const;
}
