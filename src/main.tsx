/**
 * @file main.tsx
 * @description Main application entry point
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { secureLog } from '@/utils/security';

// Clear old localStorage data from when stores were persisted
import './utils/clearOldStorage';

// Check if we're on the custom domain
if (window.location.hostname === 'aspirereach.com') {
  // Instead of redirecting to the backend, continue loading the frontend app
  secureLog.debug('Running on custom domain: aspirereach.com');
  
  // Set a flag to indicate we're on the custom domain
  window.localStorage.setItem('fuelsync_custom_domain', 'true');
}

// Create a simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Use the base URL from the environment or default to '/'
const baseUrl = import.meta.env.VITE_BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
