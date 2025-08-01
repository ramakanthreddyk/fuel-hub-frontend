/**
 * @file components/performance/LazyComponents.tsx
 * @description Lazy-loaded components for better performance
 */
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-destructive mb-4">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 className="text-lg font-semibold">Failed to load component</h3>
    </div>
    <p className="text-muted-foreground mb-4">
      {error.message || 'An error occurred while loading this component.'}
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Try Again
    </button>
  </div>
);

// HOC for lazy loading with error boundary
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.forwardRef<any, T>((props, ref) => (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
        <Component {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  ));

  LazyComponent.displayName = `LazyLoaded(${Component.displayName || Component.name})`;
  return LazyComponent;
}

// Lazy-loaded dashboard components
export const LazyDashboardStats = lazy(() => 
  import('@/components/dashboard/DashboardStats').then(module => ({
    default: module.DashboardStats
  }))
);

export const LazySalesChart = lazy(() => 
  import('@/components/dashboard/SalesChart').then(module => ({
    default: module.SalesChart
  }))
);

export const LazyRecentTransactions = lazy(() => 
  import('@/components/dashboard/RecentTransactions').then(module => ({
    default: module.RecentTransactions
  }))
);

export const LazyAlertsPanel = lazy(() => 
  import('@/components/dashboard/AlertsPanel').then(module => ({
    default: module.AlertsPanel
  }))
);

// Lazy-loaded pump components
export const LazyPumpCard = lazy(() => 
  import('@/components/pumps/PumpCard').then(module => ({
    default: module.PumpCard
  }))
);

export const LazyPumpForm = lazy(() => 
  import('@/components/pumps/PumpForm').then(module => ({
    default: module.PumpForm
  }))
);

export const LazyPumpDetails = lazy(() => 
  import('@/components/pumps/PumpDetails').then(module => ({
    default: module.PumpDetails
  }))
);

// Lazy-loaded station components
export const LazyStationCard = lazy(() => 
  import('@/components/stations/StationCard').then(module => ({
    default: module.StationCard
  }))
);

export const LazyStationForm = lazy(() => 
  import('@/components/stations/StationForm').then(module => ({
    default: module.StationForm
  }))
);

// Lazy-loaded report components
export const LazyReportChart = lazy(() => 
  import('@/components/reports/ReportChart').then(module => ({
    default: module.ReportChart
  }))
);

export const LazyReportTable = lazy(() => 
  import('@/components/reports/ReportTable').then(module => ({
    default: module.ReportTable
  }))
);

// Lazy-loaded settings components
export const LazySettingsForm = lazy(() => 
  import('@/components/settings/SettingsForm').then(module => ({
    default: module.SettingsForm
  }))
);

export const LazyUserManagement = lazy(() => 
  import('@/components/settings/UserManagement').then(module => ({
    default: module.UserManagement
  }))
);

// Preload utilities
export const preloadDashboardComponents = () => {
  import('@/components/dashboard/DashboardStats');
  import('@/components/dashboard/SalesChart');
  import('@/components/dashboard/RecentTransactions');
  import('@/components/dashboard/AlertsPanel');
};

export const preloadPumpComponents = () => {
  import('@/components/pumps/PumpCard');
  import('@/components/pumps/PumpForm');
  import('@/components/pumps/PumpDetails');
};

export const preloadStationComponents = () => {
  import('@/components/stations/StationCard');
  import('@/components/stations/StationForm');
};

export const preloadReportComponents = () => {
  import('@/components/reports/ReportChart');
  import('@/components/reports/ReportTable');
};

export const preloadSettingsComponents = () => {
  import('@/components/settings/SettingsForm');
  import('@/components/settings/UserManagement');
};

// Component for preloading on route hover
interface PreloadOnHoverProps {
  preloadFn: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PreloadOnHover: React.FC<PreloadOnHoverProps> = ({
  preloadFn,
  children,
  className,
}) => {
  const [hasPreloaded, setHasPreloaded] = React.useState(false);

  const handlePreload = React.useCallback(() => {
    if (!hasPreloaded) {
      preloadFn();
      setHasPreloaded(true);
    }
  }, [preloadFn, hasPreloaded]);

  return (
    <div
      className={className}
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
    >
      {children}
    </div>
  );
};

// Virtual list component for large datasets
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// Lazy image component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  ...props
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      
      {(!isIntersecting || !isLoaded) && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img src={placeholder} alt="" className="opacity-50" />
          ) : (
            <div className="w-8 h-8 bg-muted-foreground/20 rounded" />
          )}
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  );
};

// Memoized wrapper for expensive components
export function withMemoization<T extends object>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return React.memo(Component, areEqual);
}
