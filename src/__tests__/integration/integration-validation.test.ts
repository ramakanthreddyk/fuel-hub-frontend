/**
 * @file __tests__/integration/integration-validation.test.ts
 * @description Comprehensive tests to validate frontend-backend integration fixes
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  DataTransformer, 
  ApiResponseHandler, 
  ValidationHelper,
  DateFormatter,
  CurrencyFormatter,
  type BackendStation,
  type FrontendStation,
  type BackendPump,
  type FrontendPump 
} from '@/api/integration-fixes';

describe('Integration Fixes Validation', () => {
  describe('DataTransformer', () => {
    describe('snakeToCamel conversion', () => {
      it('should convert snake_case to camelCase', () => {
        const snakeCase = {
          user_id: '123',
          created_at: '2024-01-01',
          fuel_type: 'petrol',
          payment_method: 'card',
        };

        const camelCase = DataTransformer.snakeToCamel(snakeCase);

        expect(camelCase).toEqual({
          userId: '123',
          createdAt: '2024-01-01',
          fuelType: 'petrol',
          paymentMethod: 'card',
        });
      });

      it('should handle nested objects', () => {
        const nested = {
          user_info: {
            first_name: 'John',
            last_name: 'Doe',
            contact_details: {
              phone_number: '1234567890',
              email_address: 'john@example.com',
            },
          },
        };

        const result = DataTransformer.snakeToCamel(nested);

        expect(result).toEqual({
          userInfo: {
            firstName: 'John',
            lastName: 'Doe',
            contactDetails: {
              phoneNumber: '1234567890',
              emailAddress: 'john@example.com',
            },
          },
        });
      });

      it('should handle arrays', () => {
        const arrayData = [
          { user_id: '1', created_at: '2024-01-01' },
          { user_id: '2', created_at: '2024-01-02' },
        ];

        const result = DataTransformer.snakeToCamel(arrayData);

        expect(result).toEqual([
          { userId: '1', createdAt: '2024-01-01' },
          { userId: '2', createdAt: '2024-01-02' },
        ]);
      });

      it('should handle null and undefined values', () => {
        expect(DataTransformer.snakeToCamel(null)).toBeNull();
        expect(DataTransformer.snakeToCamel(undefined)).toBeUndefined();
        expect(DataTransformer.snakeToCamel('string')).toBe('string');
        expect(DataTransformer.snakeToCamel(123)).toBe(123);
      });
    });

    describe('camelToSnake conversion', () => {
      it('should convert camelCase to snake_case', () => {
        const camelCase = {
          userId: '123',
          createdAt: '2024-01-01',
          fuelType: 'petrol',
          paymentMethod: 'card',
        };

        const snakeCase = DataTransformer.camelToSnake(camelCase);

        expect(snakeCase).toEqual({
          user_id: '123',
          created_at: '2024-01-01',
          fuel_type: 'petrol',
          payment_method: 'card',
        });
      });

      it('should handle nested objects', () => {
        const nested = {
          userInfo: {
            firstName: 'John',
            lastName: 'Doe',
            contactDetails: {
              phoneNumber: '1234567890',
              emailAddress: 'john@example.com',
            },
          },
        };

        const result = DataTransformer.camelToSnake(nested);

        expect(result).toEqual({
          user_info: {
            first_name: 'John',
            last_name: 'Doe',
            contact_details: {
              phone_number: '1234567890',
              email_address: 'john@example.com',
            },
          },
        });
      });
    });

    describe('Station transformation', () => {
      it('should transform backend station to frontend format', () => {
        const backendStation: BackendStation = {
          id: 'station-1',
          name: 'Test Station',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip_code: '400001',
          status: 'active',
          pump_count: 8,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          tenant_id: 'tenant-1',
        };

        const frontendStation = DataTransformer.transformStation(backendStation);

        expect(frontendStation).toEqual({
          id: 'station-1',
          name: 'Test Station',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          status: 'active',
          pumpCount: 8,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tenantId: 'tenant-1',
        });
      });

      it('should transform frontend station to backend format', () => {
        const frontendStation: Partial<FrontendStation> = {
          name: 'Test Station',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          status: 'active',
        };

        const backendStation = DataTransformer.transformStationForBackend(frontendStation);

        expect(backendStation).toEqual({
          name: 'Test Station',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip_code: '400001',
          status: 'active',
        });
      });
    });

    describe('Pump transformation', () => {
      it('should transform backend pump to frontend format', () => {
        const backendPump: BackendPump = {
          id: 'pump-1',
          name: 'Pump 1',
          serial_number: 'SN001',
          station_id: 'station-1',
          status: 'active',
          nozzle_count: 4,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          tenant_id: 'tenant-1',
        };

        const frontendPump = DataTransformer.transformPump(backendPump);

        expect(frontendPump).toEqual({
          id: 'pump-1',
          name: 'Pump 1',
          serialNumber: 'SN001',
          stationId: 'station-1',
          status: 'active',
          nozzleCount: 4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tenantId: 'tenant-1',
        });
      });
    });
  });

  describe('ApiResponseHandler', () => {
    describe('handlePaginatedResponse', () => {
      it('should handle standard paginated response format', () => {
        const response = {
          data: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }],
          total: 10,
          page: 1,
          limit: 2,
          totalPages: 5,
        };

        const result = ApiResponseHandler.handlePaginatedResponse(response);

        expect(result).toEqual({
          data: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }],
          total: 10,
          page: 1,
          limit: 2,
          totalPages: 5,
        });
      });

      it('should handle direct array response', () => {
        const response = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];

        const result = ApiResponseHandler.handlePaginatedResponse(response);

        expect(result).toEqual({
          data: [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }],
          total: 2,
          page: 1,
          limit: 2,
          totalPages: 1,
        });
      });

      it('should handle response with transformer', () => {
        const response = {
          data: [{ user_id: '1', user_name: 'John' }],
          total: 1,
        };

        const transformer = (item: any) => ({
          id: item.user_id,
          name: item.user_name,
        });

        const result = ApiResponseHandler.handlePaginatedResponse(response, transformer);

        expect(result.data).toEqual([{ id: '1', name: 'John' }]);
      });

      it('should handle empty or invalid responses', () => {
        expect(ApiResponseHandler.handlePaginatedResponse(null)).toEqual({
          data: [],
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        });

        expect(ApiResponseHandler.handlePaginatedResponse({})).toEqual({
          data: [],
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        });
      });
    });

    describe('handleSingleResponse', () => {
      it('should handle wrapped single response', () => {
        const response = { data: { id: '1', name: 'Item 1' } };
        const result = ApiResponseHandler.handleSingleResponse(response);
        expect(result).toEqual({ id: '1', name: 'Item 1' });
      });

      it('should handle direct single response', () => {
        const response = { id: '1', name: 'Item 1' };
        const result = ApiResponseHandler.handleSingleResponse(response);
        expect(result).toEqual({ id: '1', name: 'Item 1' });
      });

      it('should handle null response', () => {
        const result = ApiResponseHandler.handleSingleResponse(null);
        expect(result).toBeNull();
      });
    });

    describe('handleErrorResponse', () => {
      it('should handle HTTP error response', () => {
        const error = {
          response: {
            status: 400,
            data: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: ['Name is required'],
            },
          },
        };

        const result = ApiResponseHandler.handleErrorResponse(error);

        expect(result).toEqual({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: ['Name is required'],
          status: 400,
        });
      });

      it('should handle network error', () => {
        const error = { request: {} };
        const result = ApiResponseHandler.handleErrorResponse(error);

        expect(result).toEqual({
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
          status: 0,
        });
      });

      it('should handle unknown error', () => {
        const error = new Error('Something went wrong');
        const result = ApiResponseHandler.handleErrorResponse(error);

        expect(result).toEqual({
          message: 'Something went wrong',
          code: 'UNKNOWN_ERROR',
        });
      });
    });
  });

  describe('ValidationHelper', () => {
    describe('validateStation', () => {
      it('should pass validation for valid station data', () => {
        const validStation = {
          name: 'Test Station',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
        };

        const errors = ValidationHelper.validateStation(validStation);
        expect(errors).toEqual([]);
      });

      it('should return errors for invalid station data', () => {
        const invalidStation = {
          name: '',
          address: '',
          city: '',
          state: '',
          zipCode: '12345', // Invalid ZIP code
        };

        const errors = ValidationHelper.validateStation(invalidStation);
        expect(errors).toContain('Station name is required');
        expect(errors).toContain('Address is required');
        expect(errors).toContain('City is required');
        expect(errors).toContain('State is required');
        expect(errors).toContain('ZIP code must be 6 digits');
      });
    });

    describe('validatePump', () => {
      it('should pass validation for valid pump data', () => {
        const validPump = {
          name: 'Pump 1',
          serialNumber: 'SN001',
          stationId: 'station-1',
          nozzleCount: 4,
        };

        const errors = ValidationHelper.validatePump(validPump);
        expect(errors).toEqual([]);
      });

      it('should return errors for invalid pump data', () => {
        const invalidPump = {
          name: '',
          serialNumber: '',
          stationId: '',
          nozzleCount: 0,
        };

        const errors = ValidationHelper.validatePump(invalidPump);
        expect(errors).toContain('Pump name is required');
        expect(errors).toContain('Serial number is required');
        expect(errors).toContain('Station is required');
        expect(errors).toContain('Nozzle count must be at least 1');
      });

      it('should validate nozzle count limits', () => {
        const pumpWithTooManyNozzles = {
          name: 'Pump 1',
          serialNumber: 'SN001',
          stationId: 'station-1',
          nozzleCount: 15,
        };

        const errors = ValidationHelper.validatePump(pumpWithTooManyNozzles);
        expect(errors).toContain('Nozzle count cannot exceed 12');
      });
    });

    describe('validateEmail', () => {
      it('should validate correct email formats', () => {
        expect(ValidationHelper.validateEmail('test@example.com')).toBe(true);
        expect(ValidationHelper.validateEmail('user.name@domain.co.in')).toBe(true);
        expect(ValidationHelper.validateEmail('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email formats', () => {
        expect(ValidationHelper.validateEmail('invalid-email')).toBe(false);
        expect(ValidationHelper.validateEmail('test@')).toBe(false);
        expect(ValidationHelper.validateEmail('@example.com')).toBe(false);
        expect(ValidationHelper.validateEmail('test.example.com')).toBe(false);
      });
    });

    describe('validatePhoneNumber', () => {
      it('should validate correct Indian phone numbers', () => {
        expect(ValidationHelper.validatePhoneNumber('9876543210')).toBe(true);
        expect(ValidationHelper.validatePhoneNumber('8123456789')).toBe(true);
        expect(ValidationHelper.validatePhoneNumber('7000000000')).toBe(true);
        expect(ValidationHelper.validatePhoneNumber('6999999999')).toBe(true);
      });

      it('should reject invalid phone numbers', () => {
        expect(ValidationHelper.validatePhoneNumber('1234567890')).toBe(false); // Starts with 1
        expect(ValidationHelper.validatePhoneNumber('98765432')).toBe(false); // Too short
        expect(ValidationHelper.validatePhoneNumber('98765432101')).toBe(false); // Too long
        expect(ValidationHelper.validatePhoneNumber('abcdefghij')).toBe(false); // Non-numeric
      });

      it('should handle phone numbers with spaces', () => {
        expect(ValidationHelper.validatePhoneNumber('9876 543 210')).toBe(true);
        expect(ValidationHelper.validatePhoneNumber(' 9876543210 ')).toBe(true);
      });
    });
  });

  describe('DateFormatter', () => {
    describe('formatBackendDate', () => {
      it('should format valid date strings', () => {
        const date = '2024-01-01T10:30:00Z';
        const result = DateFormatter.formatBackendDate(date);
        expect(result).toBe('2024-01-01T10:30:00.000Z');
      });

      it('should handle invalid date strings', () => {
        const invalidDate = 'invalid-date';
        const result = DateFormatter.formatBackendDate(invalidDate);
        expect(result).toBe(invalidDate); // Should return original
      });

      it('should handle empty strings', () => {
        expect(DateFormatter.formatBackendDate('')).toBe('');
      });
    });

    describe('formatDisplayDate', () => {
      it('should format dates for display', () => {
        const date = '2024-01-01T10:30:00Z';
        const result = DateFormatter.formatDisplayDate(date);
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // MM/DD/YYYY or similar
      });

      it('should handle invalid dates', () => {
        const result = DateFormatter.formatDisplayDate('invalid-date');
        expect(result).toBe('Invalid Date');
      });
    });
  });

  describe('CurrencyFormatter', () => {
    describe('formatINR', () => {
      it('should format numbers as Indian Rupees', () => {
        expect(CurrencyFormatter.formatINR(1000)).toBe('₹1,000.00');
        expect(CurrencyFormatter.formatINR(1234.56)).toBe('₹1,234.56');
        expect(CurrencyFormatter.formatINR(0)).toBe('₹0.00');
      });

      it('should handle invalid numbers', () => {
        expect(CurrencyFormatter.formatINR(NaN)).toBe('₹0.00');
        expect(CurrencyFormatter.formatINR(null as any)).toBe('₹0.00');
        expect(CurrencyFormatter.formatINR(undefined as any)).toBe('₹0.00');
      });
    });

    describe('parseINR', () => {
      it('should parse currency strings to numbers', () => {
        expect(CurrencyFormatter.parseINR('₹1,000.00')).toBe(1000);
        expect(CurrencyFormatter.parseINR('₹1,234.56')).toBe(1234.56);
        expect(CurrencyFormatter.parseINR('1000')).toBe(1000);
      });

      it('should handle invalid currency strings', () => {
        expect(CurrencyFormatter.parseINR('')).toBe(0);
        expect(CurrencyFormatter.parseINR('invalid')).toBe(0);
        expect(CurrencyFormatter.parseINR(null as any)).toBe(0);
      });
    });

    describe('formatVolume', () => {
      it('should format volume with liters unit', () => {
        expect(CurrencyFormatter.formatVolume(10.5)).toBe('10.50 L');
        expect(CurrencyFormatter.formatVolume(0)).toBe('0.00 L');
        expect(CurrencyFormatter.formatVolume(1234.567)).toBe('1234.57 L');
      });

      it('should handle invalid volumes', () => {
        expect(CurrencyFormatter.formatVolume(NaN)).toBe('0.00 L');
        expect(CurrencyFormatter.formatVolume(null as any)).toBe('0.00 L');
      });
    });
  });
});
