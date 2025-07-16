/**
 * @file api/diagnostic.ts
 * @description Diagnostic utilities for API troubleshooting
 */

import axios from 'axios';

// Get the backend URL from environment variables or use the default API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

export const diagnosticApi = {
  /**
   * Check API connectivity
   */
  checkConnectivity: async (): Promise<{ status: string; baseUrl: string; timestamp: string }> => {
    try {
      console.log('[DIAGNOSTIC] Checking API connectivity to:', API_BASE_URL);
      
      // Create a timestamp to prevent caching
      const timestamp = new Date().toISOString();
      
      // Make a simple HEAD request to check connectivity
      await axios.head(`${API_BASE_URL}/api/v1/health?t=${timestamp}`, {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      return {
        status: 'connected',
        baseUrl: API_BASE_URL,
        timestamp
      };
    } catch (error) {
      console.error('[DIAGNOSTIC] API connectivity check failed:', error);
      
      return {
        status: 'disconnected',
        baseUrl: API_BASE_URL,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  /**
   * Get browser network information
   */
  getBrowserNetworkInfo: (): { 
    userAgent: string;
    language: string;
    cookiesEnabled: boolean;
    doNotTrack: string | null;
    onLine: boolean;
  } => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine
    };
  },
  
  /**
   * Check for redirects
   */
  checkRedirects: async (url: string): Promise<{
    originalUrl: string;
    finalUrl: string;
    redirected: boolean;
    redirectCount: number;
  }> => {
    try {
      console.log('[DIAGNOSTIC] Checking redirects for:', url);
      
      // Make a request and track redirects
      const response = await axios.get(url, {
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      return {
        originalUrl: url,
        finalUrl: response.request?.responseURL || url,
        redirected: response.request?.responseURL !== url,
        redirectCount: response.request?.res?.responseUrl ? 1 : 0 // Basic count, may not be accurate
      };
    } catch (error) {
      console.error('[DIAGNOSTIC] Redirect check failed:', error);
      
      return {
        originalUrl: url,
        finalUrl: url,
        redirected: false,
        redirectCount: 0
      };
    }
  }
};