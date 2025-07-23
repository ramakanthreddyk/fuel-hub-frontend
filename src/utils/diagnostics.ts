
export const diagnosticsService = {
  checkConnectivity: async () => {
    try {
      const response = await fetch('/api/health');
      return {
        status: response.ok ? 'connected' : 'error',
        baseUrl: window.location.origin,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        baseUrl: window.location.origin,
        timestamp: new Date().toISOString(),
      };
    }
  },

  getBrowserNetworkInfo: () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unspecified',
      onLine: navigator.onLine,
    };
  },

  checkRedirects: async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        url,
        status: response.status,
        redirected: response.redirected,
        finalUrl: response.url,
      };
    } catch (error) {
      return {
        url,
        status: 0,
        redirected: false,
        finalUrl: url,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  checkBackendHealth: async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
