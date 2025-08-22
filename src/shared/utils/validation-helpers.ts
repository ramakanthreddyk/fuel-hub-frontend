/**
 * @file shared/utils/validation-helpers.ts
 * @description Centralized validation functions
 */

import { FuelType } from '@/shared/types/fuel';
import { EntityStatus } from '@/shared/types';

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validation rule type
export type ValidationRule<T = any> = (value: T) => ValidationResult;

// Legacy validation functions (existing)
export const required = (value: any): string | undefined => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (!value) return undefined;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

// New validation functions with ValidationResult
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true };
}

export function validateRequired(value: any, fieldName: string = 'This field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true };
}

export function validateNumeric(value: string | number, fieldName: string = 'Value'): ValidationResult {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  
  return { isValid: true };
}

export function validateMinLength(value: string, minLength: number, fieldName: string = 'Value'): ValidationResult {
  if (!value || value.length < minLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${minLength} characters long` 
    };
  }
  
  return { isValid: true };
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string = 'Value'): ValidationResult {
  if (value && value.length > maxLength) {
    return { 
      isValid: false, 
      message: `${fieldName} cannot exceed ${maxLength} characters` 
    };
  }
  
  return { isValid: true };
}

export function combineValidators<T>(
  ...validators: ValidationRule<T>[]
): ValidationRule<T> {
  return (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
}

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (value.length < min) {
    return `Must be at least ${min} characters long`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (value.length > max) {
    return `Must be no more than ${max} characters long`;
  }
  return undefined;
};

export const numeric = (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (isNaN(Number(value))) {
    return 'Must be a valid number';
  }
  return undefined;
};

export const positiveNumber = (value: string | number): string | undefined => {
  const num = typeof value === 'string' ? Number(value) : value;
  
  if (isNaN(num)) {
    return 'Must be a valid number';
  }
  
  if (num <= 0) {
    return 'Must be a positive number';
  }
  
  return undefined;
};

export const validFuelType = (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (!Object.values(FuelType).includes(value as FuelType)) {
    return 'Please select a valid fuel type';
  }
  return undefined;
};

export const validEntityStatus = (value: string): string | undefined => {
  if (!value) return undefined;
  
  const validStatuses: EntityStatus[] = ['active', 'inactive', 'maintenance'];
  if (!validStatuses.includes(value as EntityStatus)) {
    return 'Please select a valid status';
  }
  return undefined;
};

export const dateInPast = (value: string): string | undefined => {
  if (!value) return undefined;
  
  const date = new Date(value);
  const now = new Date();
  
  if (date > now) {
    return 'Date cannot be in the future';
  }
  return undefined;
};

export const dateInFuture = (value: string): string | undefined => {
  if (!value) return undefined;
  
  const date = new Date(value);
  const now = new Date();
  
  if (date < now) {
    return 'Date cannot be in the past';
  }
  return undefined;
};

// Compose multiple validators
export const compose = (...validators: Array<(value: any) => string | undefined>) => 
  (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };

// Example usage:
// const validateStationName = compose(required, minLength(3), maxLength(50));
// const validateEmail = compose(required, email);
// const validatePrice = compose(required, numeric, positiveNumber);
