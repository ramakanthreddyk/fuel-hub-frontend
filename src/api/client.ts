
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fuelsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant ID header if available
    const user = localStorage.getItem('fuelsync_user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.tenantId) {
        config.headers['x-tenant-id'] = userData.tenantId;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('fuelsync_token');
      localStorage.removeItem('fuelsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
