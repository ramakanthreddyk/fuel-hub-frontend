/**
 * @file hooks/usePerformance.ts
 * @description Performance monitoring and optimization hooks
 */
import React, { useEffect, useRef, useCallback, useMemo } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  props?: Record<string, any>;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string, props?: Record<string, any>) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`🐌 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        props: props ? Object.keys(props) : undefined,
      });
    }

    // In production, you might want to send this to an analytics service
    if (process.env.NODE_ENV === 'production' && renderTime > 100) {
      // TODO: Send to analytics service
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now(),
        props: props ? Object.keys(props).reduce((acc, key) => {
          acc[key] = typeof props[key];
          return acc;
        }, {} as Record<string, any>) : undefined,
      };
      
      console.log('Performance metrics:', metrics);
    }
  });

  return {
    renderCount: renderCount.current,
    componentName,
  };
}

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

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

// Throttle hook for performance optimization
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  // Handle edge cases
  const safeItems = Array.isArray(items) ? items : [];
  const safeItemHeight = Math.max(1, itemHeight || 1);
  const safeContainerHeight = Math.max(0, containerHeight || 0);
  const safeOverscan = Math.max(0, overscan || 0);

  const visibleRange = useMemo(() => {
    if (safeItems.length === 0) {
      return { startIndex: 0, endIndex: -1 };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / safeItemHeight) - safeOverscan);
    const endIndex = Math.min(
      safeItems.length - 1,
      Math.ceil((scrollTop + safeContainerHeight) / safeItemHeight) + safeOverscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, safeItemHeight, safeContainerHeight, safeItems.length, safeOverscan]);

  const visibleItems = useMemo(() => {
    if (visibleRange.endIndex < visibleRange.startIndex) {
      return [];
    }

    return safeItems.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
    }));
  }, [safeItems, visibleRange]);

  const totalHeight = safeItems.length * safeItemHeight;
  const offsetY = visibleRange.startIndex * safeItemHeight;

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

// Memory usage monitoring hook
export function useMemoryMonitor(componentName: string) {
  const memoryRef = useRef<number>(0);

  useEffect(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const currentMemory = memory.usedJSHeapSize;
      
      if (currentMemory > memoryRef.current + 10 * 1024 * 1024) { // 10MB threshold
        console.warn(`📈 Memory usage increased in ${componentName}:`, {
          current: `${(currentMemory / 1024 / 1024).toFixed(2)}MB`,
          previous: `${(memoryRef.current / 1024 / 1024).toFixed(2)}MB`,
          increase: `${((currentMemory - memoryRef.current) / 1024 / 1024).toFixed(2)}MB`,
        });
      }
      
      memoryRef.current = currentMemory;
    }
  });

  return {
    getCurrentMemoryUsage: () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        };
      }
      return null;
    },
  };
}

// Bundle size analyzer (development only)
export function useBundleAnalyzer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Analyze loaded modules
      const modules = Object.keys(window as any).filter(key => 
        key.startsWith('__vite') || key.includes('module')
      );
      
      console.log('📦 Loaded modules:', modules.length);
      
      // Check for large dependencies
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes('vendor')) {
          console.log('📦 Vendor script:', src);
        }
      });
    }
  }, []);
}

// Performance optimization recommendations
export function usePerformanceRecommendations(componentName: string) {
  const recommendations = useMemo(() => {
    const tips: string[] = [];
    
    // Check for common performance issues
    if (componentName.includes('List') || componentName.includes('Table')) {
      tips.push('Consider using React.memo for list items');
      tips.push('Implement virtual scrolling for large datasets');
    }
    
    if (componentName.includes('Form')) {
      tips.push('Use useCallback for form handlers');
      tips.push('Consider debouncing input validation');
    }
    
    if (componentName.includes('Chart') || componentName.includes('Graph')) {
      tips.push('Memoize chart data calculations');
      tips.push('Consider lazy loading chart libraries');
    }
    
    return tips;
  }, [componentName]);

  return recommendations;
}
