/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose'],
    outputFile: {
      html: './coverage/test-results.html',
      json: './coverage/test-results.json',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/vite.config.ts',
        '**/vitest.config.ts',
        'dist/',
        'build/',
        'coverage/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'src/components/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        'src/utils/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'src/hooks/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
    ],
    watchExclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    logHeapUsage: true,
    allowOnly: process.env.NODE_ENV !== 'production',
    passWithNoTests: false,
    bail: process.env.CI ? 1 : 0,
    retry: process.env.CI ? 2 : 0,
    sequence: {
      shuffle: true,
      concurrent: true,
    },
    typecheck: {
      enabled: true,
      checker: 'tsc',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', 'dist'],
    },
    benchmark: {
      include: ['src/**/*.{bench,benchmark}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      reporters: ['verbose'],
      outputFile: './coverage/benchmark-results.json',
    },
    open: false,
    browser: {
      enabled: false,
      name: 'chrome',
      provider: 'playwright',
      headless: true,
      api: {
        port: 63315,
        strictPort: true,
      },
    },
    deps: {
      inline: [
        '@testing-library/jest-dom',
        '@testing-library/react',
        '@testing-library/user-event',
      ],
    },
    env: {
      NODE_ENV: 'test',
      VITE_API_BASE_URL: 'http://localhost:3001',
      VITE_ENABLE_MOCK_API: 'true',
    },
    define: {
      __TEST__: true,
    },
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
  esbuild: {
    target: 'node14',
  },
});
