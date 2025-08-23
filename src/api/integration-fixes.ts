/**
 * @file api/integration-fixes.ts
 * @description Fixes for frontend-backend integration issues
 */

// Type definitions that match backend responses
export interface BackendStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string; // Backend uses snake_case
  status: 'active' | 'inactive' | 'maintenance';
  pump_count: number; // Backend uses snake_case
  created_at: string; // Backend uses snake_case
  updated_at: string; // Backend uses snake_case
  tenant_id: string;
}

export interface FrontendStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string; // Frontend uses camelCase
  status: 'active' | 'inactive' | 'maintenance';
  pumpCount: number; // Frontend uses camelCase
  createdAt: string; // Frontend uses camelCase
  updatedAt: string; // Frontend uses camelCase
  tenantId: string;
}

export interface BackendPump {
  id: string;
  name: string;
  serial_number: string; // Backend uses snake_case
  station_id: string; // Backend uses snake_case
  status: 'active' | 'inactive' | 'maintenance';
  nozzle_count: number; // Backend uses snake_case
  created_at: string;
  updated_at: string;
  tenant_id: string;
}

export interface FrontendPump {
  id: string;
  name: string;
  serialNumber: string; // Frontend uses camelCase
  stationId: string; // Frontend uses camelCase
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number; // Frontend uses camelCase
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface BackendSale {
  id: string;
  amount: number;
  volume: number;
  fuel_type: string;
  payment_method: string;
  pump_id: string;
  station_id: string;
  recorded_at: string;
  tenant_id: string;
  creditor_id?: string;
}

export interface FrontendSale {
  id: string;
  amount: number;
  volume: number;
  fuelType: string;
  paymentMethod: string;
  pumpId: string;
  stationId: string;
  recordedAt: string;
  tenantId: string;
  creditorId?: string;
}

// Data transformation utilities
export class DataTransformer {
  // Convert snake_case to camelCase
  static snakeToCamel(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.snakeToCamel(item));
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = this.snakeToCamel(value);
    }
    return result;
  }

  // Convert camelCase to snake_case
  static camelToSnake(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.camelToSnake(item));
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = this.camelToSnake(value);
    }
    return result;
  }

  // Transform backend station to frontend format
  static transformStation(backendStation: BackendStation): FrontendStation {
    return {
      id: backendStation.id,
      name: backendStation.name,
      address: backendStation.address,
      city: backendStation.city,
      state: backendStation.state,
      zipCode: backendStation.zip_code,
      status: backendStation.status,
      pumpCount: backendStation.pump_count,
      createdAt: backendStation.created_at,
      updatedAt: backendStation.updated_at,
      tenantId: backendStation.tenant_id,
    };
  }

  // Transform frontend station to backend format
  static transformStationForBackend(frontendStation: Partial<FrontendStation>): Partial<BackendStation> {
    const result: Partial<BackendStation> = {};
    
    if (frontendStation.id) result.id = frontendStation.id;
    if (frontendStation.name) result.name = frontendStation.name;
    if (frontendStation.address) result.address = frontendStation.address;
    if (frontendStation.city) result.city = frontendStation.city;
    if (frontendStation.state) result.state = frontendStation.state;
    if (frontendStation.zipCode) result.zip_code = frontendStation.zipCode;
    if (frontendStation.status) result.status = frontendStation.status;
    if (frontendStation.pumpCount !== undefined) result.pump_count = frontendStation.pumpCount;
    if (frontendStation.createdAt) result.created_at = frontendStation.createdAt;
    if (frontendStation.updatedAt) result.updated_at = frontendStation.updatedAt;
    if (frontendStation.tenantId) result.tenant_id = frontendStation.tenantId;

    return result;
  }

  // Transform backend pump to frontend format
  static transformPump(backendPump: BackendPump): FrontendPump {
    return {
      id: backendPump.id,
      name: backendPump.name,
      serialNumber: backendPump.serial_number,
      stationId: backendPump.station_id,
      status: backendPump.status,
      nozzleCount: backendPump.nozzle_count,
      createdAt: backendPump.created_at,
      updatedAt: backendPump.updated_at,
      tenantId: backendPump.tenant_id,
    };
  }

  // Transform frontend pump to backend format
  static transformPumpForBackend(frontendPump: Partial<FrontendPump>): Partial<BackendPump> {
    const result: Partial<BackendPump> = {};
    
    if (frontendPump.id) result.id = frontendPump.id;
    if (frontendPump.name) result.name = frontendPump.name;
    if (frontendPump.serialNumber) result.serial_number = frontendPump.serialNumber;
    if (frontendPump.stationId) result.station_id = frontendPump.stationId;
    if (frontendPump.status) result.status = frontendPump.status;
    if (frontendPump.nozzleCount !== undefined) result.nozzle_count = frontendPump.nozzleCount;
    if (frontendPump.createdAt) result.created_at = frontendPump.createdAt;
    if (frontendPump.updatedAt) result.updated_at = frontendPump.updatedAt;
    if (frontendPump.tenantId) result.tenant_id = frontendPump.tenantId;

    return result;
  }

  // Transform backend sale to frontend format
  static transformSale(backendSale: BackendSale): FrontendSale {
    return {
      id: backendSale.id,
      amount: backendSale.amount,
      volume: backendSale.volume,
      fuelType: backendSale.fuel_type,
      paymentMethod: backendSale.payment_method,
      pumpId: backendSale.pump_id,
      stationId: backendSale.station_id,
      recordedAt: backendSale.recorded_at,
      tenantId: backendSale.tenant_id,
      creditorId: backendSale.creditor_id,
    };
  }
}

// API response wrapper to handle backend inconsistencies
export class ApiResponseHandler {
  // Handle paginated responses
  static handlePaginatedResponse<T>(response: any, transformer?: (item: any) => T): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    // Handle null or undefined response
    if (!response) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      };
    }

    // Backend might return different pagination formats
    if (response.data && Array.isArray(response.data)) {
      // Format 1: { data: [], total: number, page: number, ... }
      return {
        data: transformer ? response.data.map(transformer) : response.data,
        total: response.total || response.count || response.data.length,
        page: response.page || response.currentPage || 1,
        limit: response.limit || response.pageSize || response.data.length,
        totalPages: response.totalPages || response.pages || Math.ceil((response.total || response.data.length) / Math.max(1, response.limit || response.data.length)),
      };
    } else if (Array.isArray(response)) {
      // Format 2: Direct array response
      return {
        data: transformer ? response.map(transformer) : response,
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1,
      };
    } else {
      // Fallback for unexpected formats
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      };
    }
  }

  // Handle single item responses
  static handleSingleResponse<T>(response: any, transformer?: (item: any) => T): T | null {
    if (!response) return null;
    
    // Backend might wrap single items in a data property
    const item = response.data || response;
    return transformer ? transformer(item) : item;
  }

  // Handle error responses
  static handleErrorResponse(error: any): {
    message: string;
    code?: string;
    details?: any;
    status?: number;
  } {
    if (error.response) {
      // HTTP error response
      const data = error.response.data;
      return {
        message: data?.message || data?.error || 'An error occurred',
        code: data?.code,
        details: data?.details || data?.errors,
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }
}

// Date formatting utilities to handle backend date inconsistencies
export class DateFormatter {
  // Convert backend date to frontend format
  static formatBackendDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string provided');
        return dateString; // Return original if invalid
      }
      return date.toISOString();
    } catch (error) {
      console.warn('Error formatting date:', error instanceof Error ? error.message : 'Unknown error');
      return dateString;
    }
  }

  // Convert frontend date to backend format
  static formatFrontendDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string provided');
        return dateString;
      }
      // Backend expects ISO string
      return date.toISOString();
    } catch (error) {
      console.warn('Error formatting date:', error instanceof Error ? error.message : 'Unknown error');
      return dateString;
    }
  }

  // Format date for display
  static formatDisplayDate(dateString: string, locale: string = 'en-US'): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(locale);
    } catch (error) {
      console.warn('Error formatting display date:', error instanceof Error ? error.message : 'Unknown error');
      return 'Invalid Date';
    }
  }

  // Format datetime for display
  static formatDisplayDateTime(dateString: string, locale: string = 'en-US'): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString(locale);
    } catch (error) {
      console.warn('Error formatting display datetime:', error instanceof Error ? error.message : 'Unknown error');
      return 'Invalid Date';
    }
  }
}

// Currency formatting utilities
export class CurrencyFormatter {
  // Format amount for display (Indian Rupees)
  static formatINR(amount: number): string {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '₹0.00';
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Parse currency string to number
  static parseINR(currencyString: string): number {
    if (!currencyString) return 0;
    
    // Remove currency symbol and commas, then parse
    const cleaned = currencyString.replace(/[₹,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Format volume (liters)
  static formatVolume(volume: number): string {
    if (typeof volume !== 'number' || isNaN(volume)) {
      return '0.00 L';
    }
    
    return `${volume.toFixed(2)} L`;
  }
}

// Validation utilities for form data
export class ValidationHelper {
  // Validate station data before sending to backend
  static validateStation(station: Partial<FrontendStation>): string[] {
    const errors: string[] = [];
    
    if (!station.name?.trim()) {
      errors.push('Station name is required');
    }
    
    if (!station.address?.trim()) {
      errors.push('Address is required');
    }
    
    if (!station.city?.trim()) {
      errors.push('City is required');
    }
    
    if (!station.state?.trim()) {
      errors.push('State is required');
    }
    
    if (!station.zipCode?.trim()) {
      errors.push('ZIP code is required');
    } else if (!/^\d{6}$/.test(station.zipCode.trim())) {
      errors.push('ZIP code must be 6 digits');
    }
    
    return errors;
  }

  // Validate pump data before sending to backend
  static validatePump(pump: Partial<FrontendPump>): string[] {
    const errors: string[] = [];
    
    if (!pump.name?.trim()) {
      errors.push('Pump name is required');
    }
    
    if (!pump.serialNumber?.trim()) {
      errors.push('Serial number is required');
    }
    
    if (!pump.stationId) {
      errors.push('Station is required');
    }
    
    if (!pump.nozzleCount || pump.nozzleCount < 1) {
      errors.push('Nozzle count must be at least 1');
    } else if (pump.nozzleCount > 12) {
      errors.push('Nozzle count cannot exceed 12');
    }
    
    return errors;
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number (Indian format)
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
}
