
import { format } from 'date-fns';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatShortDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'dd/MM/yy HH:mm');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Safe date formatting with custom format pattern
export const formatSafeDate = (dateString: string | null | undefined, formatPattern: string = 'MMM dd, yyyy'): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, formatPattern);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number | string | null | undefined, currency: string = '₹'): string => {
  try {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (numAmount === null || numAmount === undefined || isNaN(numAmount)) {
      return `${currency}0`;
    }
    return `${currency}${numAmount.toLocaleString('en-IN')}`;
  } catch (error) {
    return `${currency}0`;
  }
};

export const formatNumber = (num: number | string | null | undefined): string => {
  try {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (numValue === null || numValue === undefined || isNaN(numValue)) {
      return '0';
    }
    return numValue.toLocaleString('en-IN');
  } catch (error) {
    return '0';
  }
};

// Format reading values with proper decimal places
export const formatReading = (reading: number | string | null | undefined, maxDecimals: number = 2): string => {
  try {
    const numReading = typeof reading === 'string' ? parseFloat(reading) : reading;
    if (numReading === null || numReading === undefined || isNaN(numReading)) {
      return '0';
    }
    
    // Remove unnecessary trailing zeros
    const formatted = numReading.toFixed(maxDecimals);
    return parseFloat(formatted).toString();
  } catch (error) {
    return '0';
  }
};

// Format volume with appropriate decimal places
export const formatVolume = (volume: number | string | null | undefined, unit: string = 'L'): string => {
  try {
    const numVolume = typeof volume === 'string' ? parseFloat(volume) : volume;
    if (numVolume === null || numVolume === undefined || isNaN(numVolume)) {
      return `0 ${unit}`;
    }
    
    // Use 3 decimal places for volumes, but remove trailing zeros
    const formatted = numVolume.toFixed(3);
    const clean = parseFloat(formatted).toString();
    return `${clean} ${unit}`;
  } catch (error) {
    return `0 ${unit}`;
  }
};

// Format price with consistent decimal places
export const formatPrice = (price: number | string | null | undefined, currency: string = '₹'): string => {
  try {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === null || numPrice === undefined || isNaN(numPrice)) {
      return `${currency}0.00`;
    }
    return `${currency}${numPrice.toFixed(2)}`;
  } catch (error) {
    return `${currency}0.00`;
  }
};

// Safe number formatting for any numeric value
export const formatSafeNumber = (value: any, decimals: number = 2): string => {
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    
    if (decimals === 0) {
      return Math.round(num).toString();
    }
    
    const formatted = num.toFixed(decimals);
    return parseFloat(formatted).toString();
  } catch (error) {
    return '0';
  }
};
