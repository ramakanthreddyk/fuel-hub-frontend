
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: process.env.VITE_BASE_URL || '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          'data-vendor': [
            '@tanstack/react-query',
            'axios',
            'zustand',
          ],
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          'chart-vendor': [
            'recharts',
            'd3-scale',
            'd3-shape',
          ],
          'utils-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'date-fns',
            'lodash',
          ],
          'icons-vendor': ['lucide-react'],
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '')
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
      },
    },
    // Enable source maps in development
    sourcemap: mode === 'development',
    // Optimize for production
    minify: mode === 'production' ? 'esbuild' : false,
    // Target modern browsers for better optimization
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
}));
