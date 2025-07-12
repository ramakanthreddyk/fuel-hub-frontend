
/**
 * @file utils/formatters.ts
 * @description Utility functions for formatting data
 */

export const formatCurrency = (amount: number | undefined | null, currency: string = 'INR'): string => {
  // Handle undefined, null, or NaN values
  if (amount == null || isNaN(amount)) {
    if (currency === 'INR') {
      return '₹0';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(0);
  }

  if (currency === 'INR') {
    return `₹${amount.toLocaleString()}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString();
};

export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};

export const formatReading = (reading: number): string => {
  return reading.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatVolume = (volume: number): string => {
  return `${volume.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
};

export const formatSafeNumber = (num: number | undefined | null, fallback: number = 0): string => {
  const safeNum = typeof num === 'number' && !isNaN(num) ? num : fallback;
  return safeNum.toLocaleString();
};
