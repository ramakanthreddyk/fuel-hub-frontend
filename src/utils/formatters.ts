
/**
 * @file utils/formatters.ts
 * @description Utility functions for formatting data
 */

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
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
