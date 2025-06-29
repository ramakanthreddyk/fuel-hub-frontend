
/**
 * Contract-Driven API Client
 * 
 * This client is designed to be 1:1 aligned with the OpenAPI specification.
 * All types and endpoints are derived from the contract, not assumptions.
 */

import { apiClient, extractApiData, extractApiArray } from './client';

// Re-export contract types for consistency
export * from './api-contract';

// Contract-compliant request/response interfaces
export interface ContractApiResponse<T> {
  data: T;
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
  // OpenAPI spec defines responses as { data: T }
  if (response.data && 'data' in response.data) {
    return response.data.data;
  }
  
  // Fallback for direct data responses
  return response.data;
};

export const extractContractArray = <T>(response: any, arrayKey?: string): T[] => {
  const data = extractContractData(response);
  
  if (arrayKey && data && typeof data === 'object' && arrayKey in data) {
    const arrayData = data[arrayKey];
    return Array.isArray(arrayData) ? arrayData : [];
  }
  
  return Array.isArray(data) ? data : [];
};

// Contract validation helpers
export const validateContractResponse = <T>(
  response: any,
  expectedShape: Record<string, string>
): T => {
  const data = extractContractData<T>(response);
  
  // TODO: Add runtime schema validation against OpenAPI spec
  // This would catch contract drift at runtime
  
  return data;
};

// Error handling aligned with OpenAPI error schema
export const handleContractError = (error: any): ContractErrorResponse => {
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Contract-compliant error format
    if ('success' in errorData && errorData.success === false) {
      return errorData as ContractErrorResponse;
    }
    
    // Transform non-contract errors to contract format
    return {
      success: false,
      message: errorData.message || 'An error occurred',
      details: errorData.details || undefined
    };
  }
  
  // Network or unknown errors
  return {
    success: false,
    message: error.message || 'Network error occurred'
  };
};

// Contract-compliant API client wrapper
export class ContractApiClient {
  private client = apiClient;

  // Generic GET method
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get(endpoint, { params });
      return extractContractData<T>(response);
    } catch (error) {
      throw handleContractError(error);
    }
  }

  // Generic POST method
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      throw handleContractError(error);
    }
  }

  // Generic PUT method
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      throw handleContractError(error);
    }
  }

  // Generic PATCH method
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.patch(endpoint, data);
      return extractContractData<T>(response);
    } catch (error) {
      throw handleContractError(error);
    }
  }

  // Generic DELETE method
  async delete(endpoint: string): Promise<void> {
    try {
      await this.client.delete(endpoint);
    } catch (error) {
      throw handleContractError(error);
    }
  }

  // Array-specific GET method
  async getArray<T>(endpoint: string, arrayKey: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const response = await this.client.get(endpoint, { params });
      return extractContractArray<T>(response, arrayKey);
    } catch (error) {
      throw handleContractError(error);
    }
  }
}

export const contractClient = new ContractApiClient();
