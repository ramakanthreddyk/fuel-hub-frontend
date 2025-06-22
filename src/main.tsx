import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  alert(`Global error: ${event.error?.message || 'Unknown error'}`);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  alert(`Unhandled promise rejection: ${event.reason?.message || 'Unknown error'}`);
});

// Log environment variables (without sensitive data)
console.log('Environment:', {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
});

createRoot(document.getElementById("root")!).render(<App />);
