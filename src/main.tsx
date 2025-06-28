
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { DataMappingProvider } from './contexts/DataMappingContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <AuthProvider>
          <DataMappingProvider>
            <App />
            <Toaster />
          </DataMappingProvider>
        </AuthProvider>
      </ErrorProvider>
    </QueryClientProvider>
  </StrictMode>
);
