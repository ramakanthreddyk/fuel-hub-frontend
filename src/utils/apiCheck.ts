
/**
 * Utility to check API connection and diagnose issues
 */
import axios from 'axios';

// Get the backend URL from environment variables or use the default API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';

interface ErrorDetails {
  message: string;
  code?: string;
  diagnosis?: string;
}

export async function checkApiConnection() {
  console.log('Checking API connection to:', API_BASE_URL);
  
  try {
    // First try the health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000
    });
    
    console.log('Health check successful:', healthResponse.status);
    console.log('API details:', healthResponse.data);
    
    return {
      success: true,
      status: healthResponse.status,
      data: healthResponse.data
    };
  } catch (healthError: any) {
    console.error('Health check failed:', healthError.message);
    
    // Try the test endpoint as fallback
    try {
      console.log('Testing fallback endpoint...');
      const testResponse = await axios.get(`${API_BASE_URL}/test`, {
        timeout: 10000
      });
      
      console.log('Test endpoint successful:', testResponse.status);
      return {
        success: true,
        status: testResponse.status,
        data: testResponse.data,
        note: 'Health check failed but test endpoint worked'
      };
    } catch (testError: any) {
      console.error('Test endpoint failed:', testError.message);
      
      // Try the API docs endpoint as last resort
      try {
        console.log('Testing API docs endpoint...');
        const docsResponse = await axios.get(`${API_BASE_URL}/api/docs`, {
          timeout: 10000
        });
        
        console.log('API docs endpoint successful:', docsResponse.status);
        return {
          success: true,
          status: docsResponse.status,
          note: 'Health and test endpoints failed but API docs endpoint worked'
        };
      } catch (docsError: any) {
        console.error('All endpoints failed');
        
        // Diagnose the error
        let errorDetails: ErrorDetails = {
          message: docsError.message,
          code: docsError.code
        };
        
        if (docsError.code === 'ECONNREFUSED') {
          errorDetails = {
            ...errorDetails,
            diagnosis: 'The server is not running or not accessible'
          };
        } else if (docsError.code === 'ENOTFOUND') {
          errorDetails = {
            ...errorDetails,
            diagnosis: 'The domain name could not be resolved'
          };
        } else if (docsError.code === 'ETIMEDOUT') {
          errorDetails = {
            ...errorDetails,
            diagnosis: 'The connection timed out'
          };
        } else if (docsError.response?.status === 403) {
          errorDetails = {
            ...errorDetails,
            diagnosis: 'Access forbidden - check CORS settings'
          };
        } else if (docsError.response?.status === 404) {
          errorDetails = {
            ...errorDetails,
            diagnosis: 'Endpoint not found - check API URL'
          };
        }
        
        return {
          success: false,
          error: errorDetails
        };
      }
    }
  }
}

// Export a function to check a specific endpoint
export async function checkEndpoint(endpoint: string) {
  console.log(`Checking endpoint: ${endpoint}`);
  
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Full URL:', fullUrl);
    
    const response = await axios.get(fullUrl, {
      timeout: 10000
    });
    
    console.log('Endpoint check successful:', response.status);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    console.error('Endpoint check failed:', error.message);
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
}

// Add this to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).checkApiConnection = checkApiConnection;
  (window as any).checkEndpoint = checkEndpoint;
}
