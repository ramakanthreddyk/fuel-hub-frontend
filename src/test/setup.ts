
/**
 * @file test/setup.ts
 * @description Enhanced test setup and configuration
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

// Mock Node.js process object for browser environment
Object.defineProperty(globalThis, 'process', {
  value: {
    env: {},
    nextTick: vi.fn((cb) => setTimeout(cb, 0)),
    cwd: vi.fn(() => '/'),
    platform: 'browser',
    version: 'v18.0.0',
    versions: { node: '18.0.0' },
    emit: vi.fn(),
    on: vi.fn(),
    once: vi.fn(),
    off: vi.fn(),
    removeListener: vi.fn(),
    removeAllListeners: vi.fn(),
    listeners: vi.fn(() => []),
    listenerCount: vi.fn(() => 0),
    stdout: { write: vi.fn() },
    stderr: { write: vi.fn() },
    stdin: { read: vi.fn() },
    uptime: vi.fn(() => 100),
    memoryUsage: vi.fn(() => ({
      rss: 1000000,
      heapTotal: 1000000,
      heapUsed: 500000,
      external: 100000,
      arrayBuffers: 50000
    }))
  },
  writable: true,
  configurable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock crypto for security utilities
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn().mockImplementation((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    subtle: {
      generateKey: vi.fn().mockResolvedValue({}),
      exportKey: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      importKey: vi.fn().mockResolvedValue({}),
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
      decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(16)),
    },
  },
});

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    ...performance,
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
    getEntriesByType: vi.fn().mockReturnValue([]),
    getEntriesByName: vi.fn().mockReturnValue([]),
    mark: vi.fn(),
    measure: vi.fn(),
    now: vi.fn().mockReturnValue(Date.now()),
  },
});

// Mock PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

beforeAll(() => {
  // Suppress console errors/warnings in tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Clear the document body to ensure clean state
  document.body.innerHTML = '';
});
