/**
 * @file utils/security.ts
 * @description Security utilities for input sanitization, logging, and XSS prevention
 */

/**
 * Sanitizes user input for logging to prevent log injection attacks
 */
export function sanitizeForLogging(input: unknown): string {
  if (input === null || input === undefined) {
    return 'null';
  }
  
  const str = String(input);
  
  // Remove or encode dangerous characters that could break log integrity
  return str
    .replace(/\r\n/g, '\\r\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\0/g, '') // Remove null characters
    .replace(/[\u001b]/g, '') // Remove escape characters
    .slice(0, 1000); // Limit length to prevent log flooding
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes URL parameters to prevent injection
 */
export function sanitizeUrlParam(param: string): string {
  if (!param) return '';
  
  // Encode URI component and validate
  return encodeURIComponent(param.toString().slice(0, 200));
}

/**
 * Validates file paths to prevent path traversal attacks
 */
export function validateFilePath(filePath: string): boolean {
  if (!filePath) return false;
  
  // Check for path traversal sequences
  const dangerous = ['../', '..\\', '../', '..\\\\'];
  const normalizedPath = filePath.toLowerCase();
  
  return !dangerous.some(seq => normalizedPath.includes(seq));
}

/**
 * Sanitizes file paths by removing dangerous sequences
 */
export function sanitizeFilePath(filePath: string): string {
  if (!filePath) return '';
  
  // Use path.basename to strip directory components
  const path = require('path');
  return path.basename(filePath);
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates phone number (Indian format)
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;
  
  const cleanPhone = phone.replace(/\s+/g, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Validates and sanitizes database query parameters
 */
export function sanitizeDbParam(param: unknown): string {
  if (param === null || param === undefined) {
    return '';
  }
  
  const str = String(param);
  
  // Remove potentially dangerous SQL/NoSQL injection characters
  return str
    .replace(/['"`;\\]/g, '')
    .replace(/\$\{/g, '')
    .replace(/\$\(/g, '')
    .slice(0, 500);
}

/**
 * Secure logging function that sanitizes all inputs
 */
export const secureLog = {
  info: (message: string, ...args: unknown[]) => {
    const sanitizedMessage = sanitizeForLogging(message);
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.info(sanitizedMessage, ...sanitizedArgs);
  },
  
  warn: (message: string, ...args: unknown[]) => {
    const sanitizedMessage = sanitizeForLogging(message);
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.warn(sanitizedMessage, ...sanitizedArgs);
  },
  
  error: (message: string, ...args: unknown[]) => {
    const sanitizedMessage = sanitizeForLogging(message);
    const sanitizedArgs = args.map(sanitizeForLogging);
    console.error(sanitizedMessage, ...sanitizedArgs);
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitizedMessage = sanitizeForLogging(message);
      const sanitizedArgs = args.map(sanitizeForLogging);
      console.debug(sanitizedMessage, ...sanitizedArgs);
    }
  }
};

/**
 * Content Security Policy helpers
 */
export const CSP = {
  /**
   * Generates a nonce for inline scripts
   */
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  /**
   * Validates if content is safe for innerHTML
   */
  isSafeContent: (content: string): boolean => {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<link/i,
      /<meta/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(content));
  }
};

/**
 * Rate limiting helper for API calls
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

/**
 * Input validation schemas
 */
export const ValidationSchemas = {
  station: {
    name: (value: string) => value && value.trim().length >= 2 && value.length <= 100,
    address: (value: string) => value && value.trim().length >= 5 && value.length <= 200,
    city: (value: string) => value && value.trim().length >= 2 && value.length <= 50,
    state: (value: string) => value && value.trim().length >= 2 && value.length <= 50,
    zipCode: (value: string) => /^\d{6}$/.test(value?.trim() || '')
  },
  
  pump: {
    name: (value: string) => value && value.trim().length >= 2 && value.length <= 50,
    serialNumber: (value: string) => value && /^[A-Z0-9-]{3,20}$/.test(value.trim()),
    nozzleCount: (value: number) => Number.isInteger(value) && value >= 1 && value <= 12
  },
  
  user: {
    email: validateEmail,
    phone: validatePhoneNumber,
    name: (value: string) => value && value.trim().length >= 2 && value.length <= 100
  }
};

/**
 * Secure data transformation utilities
 */
export const SecureTransform = {
  /**
   * Safely converts snake_case to camelCase with validation
   */
  snakeToCamel: (obj: unknown): unknown => {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => SecureTransform.snakeToCamel(item));
    }
    
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Validate key to prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = SecureTransform.snakeToCamel(value);
    }
    return result;
  },
  
  /**
   * Safely converts camelCase to snake_case with validation
   */
  camelToSnake: (obj: unknown): unknown => {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => SecureTransform.camelToSnake(item));
    }
    
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Validate key to prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = SecureTransform.camelToSnake(value);
    }
    return result;
  }
};