/**
 * @file utils/performance.ts
 * @description Performance optimization utilities and monitoring
 */

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    // Monitor navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordMetric('navigation', entry.duration);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navObserver);
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }

    // Monitor resource loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordMetric('resource', entry.duration);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }

    // Monitor largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('lcp', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // Monitor first input delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.recordMetric('fid', fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Keep only last 100 measurements
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, count: values.length };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name);
    }
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// Memory monitoring
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    limitMB: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
  };
}

// Bundle analysis
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const jsResources = resources.filter(r => r.name.endsWith('.js'));
  const cssResources = resources.filter(r => r.name.endsWith('.css'));

  const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

  return {
    js: {
      count: jsResources.length,
      totalSize: totalJSSize,
      totalSizeMB: Math.round(totalJSSize / 1024 / 1024 * 100) / 100,
      resources: jsResources.map(r => ({
        name: r.name,
        size: r.transferSize || 0,
        duration: r.duration,
      })),
    },
    css: {
      count: cssResources.length,
      totalSize: totalCSSSize,
      totalSizeMB: Math.round(totalCSSSize / 1024 / 1024 * 100) / 100,
      resources: cssResources.map(r => ({
        name: r.name,
        size: r.transferSize || 0,
        duration: r.duration,
      })),
    },
  };
}

// Image optimization utilities
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Preload critical images
  const criticalImages = document.querySelectorAll('img[data-preload]');
  criticalImages.forEach((img) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = (img as HTMLImageElement).src;
    document.head.appendChild(link);
  });
}

// Code splitting utilities
export function preloadRoute(routeComponent: () => Promise<any>) {
  // Preload route component on hover or focus
  return {
    onMouseEnter: () => routeComponent(),
    onFocus: () => routeComponent(),
  };
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Virtual scrolling for large lists
export function createVirtualScroller(
  container: HTMLElement,
  itemHeight: number,
  items: any[],
  renderItem: (item: any, index: number) => HTMLElement
) {
  const visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
  let startIndex = 0;

  const scrollHandler = throttle(() => {
    const scrollTop = container.scrollTop;
    startIndex = Math.floor(scrollTop / itemHeight);
    render();
  }, 16);

  function render() {
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    const visibleItems = items.slice(startIndex, endIndex);

    container.innerHTML = '';
    
    // Add spacer for items before visible range
    if (startIndex > 0) {
      const spacer = document.createElement('div');
      spacer.style.height = `${startIndex * itemHeight}px`;
      container.appendChild(spacer);
    }

    // Render visible items
    visibleItems.forEach((item, index) => {
      const element = renderItem(item, startIndex + index);
      container.appendChild(element);
    });

    // Add spacer for items after visible range
    const remainingItems = items.length - endIndex;
    if (remainingItems > 0) {
      const spacer = document.createElement('div');
      spacer.style.height = `${remainingItems * itemHeight}px`;
      container.appendChild(spacer);
    }
  }

  container.addEventListener('scroll', scrollHandler);
  render();

  return {
    destroy: () => {
      container.removeEventListener('scroll', scrollHandler);
    },
    refresh: render,
  };
}

// Performance budget checker
export function checkPerformanceBudget() {
  const budget = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 800, // 800ms
  };

  const monitor = PerformanceMonitor.getInstance();
  const metrics = monitor.getAllMetrics();
  const violations: string[] = [];

  if (metrics.lcp && metrics.lcp.avg > budget.lcp) {
    violations.push(`LCP: ${metrics.lcp.avg}ms > ${budget.lcp}ms`);
  }

  if (metrics.fid && metrics.fid.avg > budget.fid) {
    violations.push(`FID: ${metrics.fid.avg}ms > ${budget.fid}ms`);
  }

  return {
    passed: violations.length === 0,
    violations,
    metrics,
  };
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();
  
  // Log performance metrics in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const metrics = monitor.getAllMetrics();
      const memory = getMemoryUsage();
      const budget = checkPerformanceBudget();
      
      console.group('Performance Metrics');
      console.table(metrics);
      if (memory) console.log('Memory:', memory);
      if (!budget.passed) console.warn('Budget violations:', budget.violations);
      console.groupEnd();
    }, 30000); // Every 30 seconds
  }

  return monitor;
}
