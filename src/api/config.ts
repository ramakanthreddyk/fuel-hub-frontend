// This file contains the API URL configuration
// It's used to ensure all API calls use the correct URL

// The API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://fuelsync-cjerbvabbsf8bsgu.eastasia-01.azurewebsites.net';

// If we're on the custom domain, make sure we're using the correct API URL
if (typeof window !== 'undefined' && window.localStorage.getItem('fuelsync_custom_domain') === 'true') {
  console.log('Using API URL for custom domain');
}

// The API version
export const API_VERSION = 'v1';

// The full API URL
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;