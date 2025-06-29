
/**
 * Contract-Driven API Client
 * 
 * This client wraps the generated OpenAPI client and adds FuelSync-specific logic
 * while maintaining strict contract compliance.
 */

import { apiClient } from './client';

// Contract-compliant response wrapper
export interface ContractResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ContractErrorResponse {
  success: false;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// Contract-compliant data extraction
export const extractContractData = <T>(response: any): T => {
  // OpenAPI spec defines responses with { success: true, data: T }
  if (response.data && typeof response.data === 'object') {
    if ('data' in response.data) {
      return response.data.data;
    }
    // Fallback for direct data responses
    return response.data;
  }
  
  return response.data;
};

export const extractContractArray = <T>(response: any, arrayKey: string): T[] => {
  const data = extractContractData(response);
  
  if (data && typeof data === 'object' && arrayKey in data) {
    const arrayData = (data as any)[arrayKey];
    return Array.isArray(arrayData) ? arrayData : [];
  }
  
  return Array.isArray(data) ? data : [];
};

// Error handling aligned with OpenAPI error schema
export const handleContractError = (error: any): never => {
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Contract-compliant error format
    if ('success' in errorData && !errorData.success) {
      throw new Error(errorData.message || 'API error occurred');
    }
    
    // Transform non-contract errors to contract format
    throw new Error(errorData.message || 'API request failed');
  }
  
  // Network or unknown errors
  throw new Error(error.message || 'Network error occurred');
};

// Contract-compliant API client wrapper
export class ContractApiClient {
  private client = apiClient;

  // Generic GET method with contract compliance
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get(endpoint, { params });
      return extractContractData<T>(response);
    } catch (error) {
      handleContractError(error);
    }
  }

  // Generic POST method with contract compliance
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      handleContractError(error);
    }
  }

  // Generic PUT method with contract compliance
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      handleContractError(error);
    }
  }

  // Generic PATCH method with contract compliance
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.patch(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      handleContractError(error);
    }
  }

  // Generic DELETE method with contract compliance
  async delete(endpoint: string): Promise<void> {
    try {
      await this.client.delete(endpoint);
    } catch (error) {
      handleContractError(error);
    }
  }

  // Array-specific GET method with contract compliance
  async getArray<T>(endpoint: string, arrayKey: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const response = await this.client.get(endpoint, { params });
      return extractContractArray<T>(response, arrayKey);
    } catch (error) {
      handleContractError(error);
    }
  }
}

// Export singleton instance
export const contractClient = new ContractApiClient();
