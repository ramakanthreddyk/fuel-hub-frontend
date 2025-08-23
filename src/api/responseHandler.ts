/**
 * Standardized API Response Handler
 * Handles the backend's { success: true, data: {...} } response pattern
 */

import { secureLog } from '@/utils/security';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Extracts data from standardized API response
 * @param response - The API response object
 * @returns The data portion of the response
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
  if (response.success && response.data) {
    return response.data;
  }
  
  const errorMessage = response.error || response.message || 'API request failed';
  secureLog.error('API response error:', errorMessage);
  throw new Error(errorMessage);
}

/**
 * Handles API response and extracts data
 * @param apiCall - Function that returns API response
 * @returns Promise with extracted data
 */
export async function handleApiResponse<T>(apiCall: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const response = await apiCall();
    return extractApiData(response.data);
  } catch (error) {
    secureLog.error('API call failed:', error);
    throw error;
  }
}