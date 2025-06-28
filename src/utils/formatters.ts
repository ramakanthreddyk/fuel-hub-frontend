
import { format } from 'date-fns';

export const formatDate = (dateString: string): string => {
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

export const formatDateTime = (dateString: string): string => {
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

export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  try {
    return `${currency}${amount.toLocaleString('en-IN')}`;
  } catch (error) {
    return `${currency}${amount}`;
  }
};

export const formatNumber = (num: number): string => {
  try {
    return num.toLocaleString('en-IN');
  } catch (error) {
    return num.toString();
  }
};

// Format reading values with proper decimal places
export const formatReading = (reading: number | string, maxDecimals: number = 2): string => {
  try {
    const numReading = typeof reading === 'string' ? parseFloat(reading) : reading;
    if (isNaN(numReading)) {
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
export const formatVolume = (volume: number | string, unit: string = 'L'): string => {
  try {
    const numVolume = typeof volume === 'string' ? parseFloat(volume) : volume;
    if (isNaN(numVolume)) {
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
