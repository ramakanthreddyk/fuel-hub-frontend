
/**
 * @file utils/formatters.ts
 * @description Utility functions for formatting data
 */

export const formatCurrency = (value: number, options?: { maximumFractionDigits?: number; useLakhsCrores?: boolean }) => {
  if (typeof value !== 'number' || isNaN(value)) return '₹0';
  
  const { maximumFractionDigits = 2, useLakhsCrores = false } = options || {};
  
  if (useLakhsCrores) {
    if (value >= 10000000) { // 1 crore
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) { // 1 lakh
      return `₹${(value / 100000).toFixed(2)}L`;
    }
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value);
};

export const formatNumber = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

export const formatVolume = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0L';
  return `${formatNumber(value)}L`;
};

export const formatPercentage = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

export const formatPrice = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '₹0.00';
  return `₹${value.toFixed(2)}`;
};

export const formatReading = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toFixed(2);
};

export const formatDate = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN');
};

export const formatDateTime = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN');
};

export const formatTime = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN');
};

// Legacy alias for backward compatibility
export const formatSafeNumber = formatNumber;
