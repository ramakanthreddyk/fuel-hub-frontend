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

// Check if we're on the wrong domain and redirect if needed
if (window.location.hostname === 'aspirereach.com') {
  const currentPath = window.location.pathname;
  const targetUrl = import.meta.env.VITE_REDIRECT_URL || 'https://fuelsync-app.azurewebsites.net';
  window.location.href = `${targetUrl}${currentPath}`;
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