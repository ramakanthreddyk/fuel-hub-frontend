
/**
 * @file formatters.ts
 * @description Utility functions for formatting data
 */

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format a price value
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Format a reading value
 */
export const formatReading = (reading: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reading);
};

/**
 * Format a percentage
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * Format a number with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format a volume value
 */
export const formatVolume = (volume: number): string => {
  return `${formatNumber(volume)} L`;
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN');
};

/**
 * Format a date and time string
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN');
};
