/**
 * @file utils/lazyLoad.tsx
 * @description Utility for lazy loading components with loading states and error boundaries
 */
import React, { Suspense, ComponentType, lazy } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Loading component
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Page loading component
export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg text-gray-600">Loading page...</p>
      </div>
    </div>
  );
}

// Error fallback for lazy loaded components
function LazyLoadErrorFallback({ 
  error, 
  resetError,
  componentName 
}: {
  error: Error;
  resetError: () => void;
  componentName: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load {componentName}
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading this component. Please try again.
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="block w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reload Page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Lazy load wrapper with error boundary and loading state
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ComponentType;
    errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    componentName?: string;
  } = {}
) {
  const {
    fallback: Fallback = LoadingSpinner,
    componentName = 'Component',
  } = options;

  const LazyComponent = lazy(importFunc);

  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary
        fallback={
          <LazyLoadErrorFallback 
            error={new Error('Component failed to load')} 
            resetError={() => window.location.reload()}
            componentName={componentName}
          />
        }
      >
        <Suspense fallback={<Fallback />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Lazy load for pages (with page-specific loading)
export function lazyLoadPage<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  pageName: string
) {
  return lazyLoad(importFunc, {
    fallback: PageLoadingSpinner,
    componentName: `${pageName} Page`,
  });
}

// Lazy load for components (with component-specific loading)
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
) {
  return lazyLoad(importFunc, {
    fallback: () => <LoadingSpinner message={`Loading ${componentName}...`} />,
    componentName,
  });
}

// Preload utility for better UX
export function preloadComponent(importFunc: () => Promise<any>) {
  // Preload on hover or focus for better perceived performance
  return {
    onMouseEnter: () => importFunc(),
    onFocus: () => importFunc(),
  };
}

// Hook for dynamic imports with loading state
export function useDynamicImport<T>(
  importFunc: () => Promise<{ default: T }>,
  deps: React.DependencyList = []
) {
  const [component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    setError(null);
    
    importFunc()
      .then((module) => {
        if (!cancelled) {
          setComponent(module.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  const retry = React.useCallback(() => {
    setError(null);
    setComponent(null);
    // Trigger re-import by updating a dependency
  }, []);

  return { component, loading, error, retry };
}

// Utility for route-based code splitting
export const createLazyRoute = (
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  routeName: string
) => {
  return lazyLoadPage(importFunc, routeName);
};
