/**
 * @file test/utils.tsx
 * @description Testing utilities and helpers for consistent test setup
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock data generators
export const createMockPump = (overrides = {}) => ({
  id: 'pump-001',
  name: 'Test Pump',
  serialNumber: 'SN-001',
  status: 'active' as const,
  nozzleCount: 4,
  stationName: 'Test Station',
  stationId: 'station-001',
  ...overrides,
});

export const createMockStation = (overrides = {}) => ({
  id: 'station-001',
  name: 'Test Station',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  ...overrides,
});

export const createMockNozzle = (overrides = {}) => ({
  id: 'nozzle-001',
  pumpId: 'pump-001',
  fuelType: 'Regular',
  status: 'active' as const,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-001',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
  ...overrides,
});

// Test providers wrapper
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
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

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// Mock implementations for common hooks
export const mockUseToast = () => ({
  toast: vi.fn(),
});

export const mockUseNavigate = () => vi.fn();

export const mockUseParams = (params = {}) => () => params;

export const mockUseLocation = (location = { pathname: '/', search: '', hash: '', state: null }) => () => location;

// Mock API responses
export const createMockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

export const createMockApiError = (message = 'API Error', status = 500) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { message },
    statusText: status === 500 ? 'Internal Server Error' : 'Error',
  };
  error.isAxiosError = true;
  return error;
};

// Mock query results
export const createMockQueryResult = <T>(data: T, options = {}) => ({
  data,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  ...options,
});

export const createMockLoadingQuery = () => ({
  data: undefined,
  isLoading: true,
  isError: false,
  error: null,
  refetch: vi.fn(),
});

export const createMockErrorQuery = (error = new Error('Query error')) => ({
  data: undefined,
  isLoading: false,
  isError: true,
  error,
  refetch: vi.fn(),
});

// Mock mutation results
export const createMockMutation = (options = {}) => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isError: false,
  error: null,
  data: undefined,
  reset: vi.fn(),
  ...options,
});

// Test helpers for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

export const flushPromises = () => 
  new Promise(resolve => setImmediate(resolve));

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => mockLocalStorage();

// Mock window methods
export const mockWindow = () => ({
  location: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
  },
  history: {
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
  alert: vi.fn(),
  confirm: vi.fn(() => true),
  prompt: vi.fn(() => 'test'),
});

// Mock intersection observer
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  global.IntersectionObserver = vi.fn(() => mockObserver);
  return mockObserver;
};

// Mock resize observer
export const mockResizeObserver = () => {
  const mockObserver = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  global.ResizeObserver = vi.fn(() => mockObserver);
  return mockObserver;
};

// Mock performance API
export const mockPerformance = () => {
  const mockPerf = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    memory: {
      usedJSHeapSize: 10 * 1024 * 1024,
      totalJSHeapSize: 50 * 1024 * 1024,
      jsHeapSizeLimit: 100 * 1024 * 1024,
    },
  };

  Object.defineProperty(global, 'performance', {
    value: mockPerf,
    writable: true,
  });

  return mockPerf;
};

// Test data builders
export class TestDataBuilder {
  static pump(overrides = {}) {
    return createMockPump(overrides);
  }

  static station(overrides = {}) {
    return createMockStation(overrides);
  }

  static nozzle(overrides = {}) {
    return createMockNozzle(overrides);
  }

  static user(overrides = {}) {
    return createMockUser(overrides);
  }

  static pumps(count = 3, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      createMockPump({ 
        id: `pump-${i + 1}`, 
        name: `Pump ${i + 1}`,
        ...overrides 
      })
    );
  }

  static stations(count = 2, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      createMockStation({ 
        id: `station-${i + 1}`, 
        name: `Station ${i + 1}`,
        ...overrides 
      })
    );
  }
}

// Assertion helpers
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectNotToBeInDocument = (element: HTMLElement | null) => {
  expect(element).not.toBeInTheDocument();
};

export const expectToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectToHaveBeenCalledWith = (mockFn: any, ...args: any[]) => {
  expect(mockFn).toHaveBeenCalledWith(...args);
};

// Custom matchers (if needed)
export const customMatchers = {
  toBeVisible: (element: HTMLElement) => {
    const pass = element.style.display !== 'none' && 
                 element.style.visibility !== 'hidden' &&
                 element.style.opacity !== '0';
    
    return {
      pass,
      message: () => `Expected element to ${pass ? 'not ' : ''}be visible`,
    };
  },
};

// Setup function for common test scenarios
export const setupTest = (options: {
  mockLocalStorage?: boolean;
  mockIntersectionObserver?: boolean;
  mockPerformance?: boolean;
} = {}) => {
  const mocks: any = {};

  if (options.mockLocalStorage) {
    mocks.localStorage = mockLocalStorage();
    Object.defineProperty(global, 'localStorage', {
      value: mocks.localStorage,
      writable: true,
    });
  }

  if (options.mockIntersectionObserver) {
    mocks.intersectionObserver = mockIntersectionObserver();
  }

  if (options.mockPerformance) {
    mocks.performance = mockPerformance();
  }

  return mocks;
};
