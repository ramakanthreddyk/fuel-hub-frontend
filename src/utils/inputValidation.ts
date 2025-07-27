/**
 * Input validation and sanitization utilities
 */
import { z } from 'zod';

// XSS protection - basic HTML sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Validation schemas
export const reconciliationSchema = z.object({
  stationId: z.string().uuid('Invalid station ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reportedCashAmount: z.number().min(0, 'Cash amount cannot be negative').max(999999999, 'Cash amount too large'),
  varianceReason: z.string().max(500, 'Reason too long').optional()
});

export const stationSchema = z.object({
  name: z.string().min(1, 'Station name required').max(100, 'Name too long'),
  address: z.string().min(1, 'Address required').max(200, 'Address too long')
});

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  role: z.enum(['owner', 'manager', 'attendant', 'superadmin'])
});

// Validate and sanitize form data
export const validateAndSanitize = <T>(data: any, schema: z.ZodSchema<T>): T => {
  // First sanitize string fields
  const sanitized = Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    acc[key] = typeof value === 'string' ? sanitizeInput(value) : value;
    return acc;
  }, {} as any);

  // Then validate with schema
  return schema.parse(sanitized);
};