/**
 * @file shared/utils/index.ts
 * @description Centralized export of all shared utilities
 */

// Date utilities
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  isValidDate,
  parseDate,
  addDays,
  subtractDays,
  getDateRange
} from './date-helpers';

// Fuel utilities
export {
  formatFuelVolume,
  formatVolume,
  formatPrice,
  calculateTotalPrice,
  calculateFuelRevenue,
  convertVolume,
  validateFuelData,
  validateFuelType,
  getFuelTypeLabel,
  getFuelTypeColor,
  getFuelTypeIcon,
  getFuelTypeTailwindColor,
  isFuelType
} from './fuel-helpers';

// Validation utilities (new style)
export {
  validateEmail,
  validatePhone,
  validateRequired,
  validateNumeric,
  validateMinLength,
  validateMaxLength,
  combineValidators,
  type ValidationRule,
  type ValidationResult
} from './validation-helpers';

// Legacy validation utilities (for backward compatibility)
export {
  required,
  email,
  minLength,
  maxLength,
  numeric,
  positiveNumber,
  validFuelType,
  validEntityStatus,
  dateInPast,
  dateInFuture,
  compose
} from './validation-helpers';

// Usage example for barrel exports:
/*
// Instead of multiple imports:
import { formatDate } from './shared/utils/date-helpers';
import { formatVolume } from './shared/utils/fuel-helpers';
import { validateEmail } from './shared/utils/validation-helpers';

// Use single import:
import { formatDate, formatVolume, validateEmail } from '@/shared/utils';
*/
