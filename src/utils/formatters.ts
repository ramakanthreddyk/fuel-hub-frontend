/**
 * Utility functions for formatting values consistently across the application
 */

/**
 * Format a number as Indian Rupees
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | undefined | null, options?: {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  useLakhsCrores?: boolean;
}): string {
  // Handle 'N/A' or other string values
  if (typeof value === 'string') {
    return value;
  }
  
  const amount = value ?? 0;
  
  // Use lakhs and crores format if specified
  if (options?.useLakhsCrores && amount >= 1000) {
    return '₹' + formatIndianLakhsCrores(amount);
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0
  }).format(amount);
}

/**
 * Format a number with thousands separators
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number | undefined | null): string {
  return new Intl.NumberFormat('en-IN').format(value ?? 0);
}

/**
 * Format a percentage value
 * @param value The number to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercent(value: number | undefined | null, decimals = 1): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format((value ?? 0) / 100);
}

/**
 * Format a volume value with appropriate units
 * @param value The volume to format in liters
 * @param decimals Number of decimal places
 * @param useLakhsCrores Whether to use lakhs and crores format for large volumes
 * @returns Formatted volume string with units
 */
export function formatVolume(value: number | undefined | null, decimals = 0, useLakhsCrores = true): string {
  const volume = value ?? 0;
  
  // Use lakhs and crores format for large volumes
  if (useLakhsCrores && volume >= 1000) {
    if (volume >= 10000000) { // 1 crore = 10,000,000
      const crores = volume / 10000000;
      return `${crores.toFixed(0)} Cr Liters`;
    } else if (volume >= 100000) { // 1 lakh = 100,000
      const lakhs = volume / 100000;
      return `${lakhs.toFixed(0)} Lakh Liters`;
    } else if (volume >= 1000) { // 1 thousand = 1,000
      const thousands = volume / 1000;
      return `${thousands.toFixed(0)}K Liters`;
    }
  }
  
  // Standard formatting for smaller volumes
  return `${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(volume)} Liters`;
}

/**
 * Format a number safely, handling undefined, null, NaN values
 * @param value The number to format
 * @param decimals Number of decimal places
 * @param useLakhsCrores Whether to use lakhs and crores format for large numbers
 * @returns Formatted number string
 */
export function formatSafeNumber(value: number | undefined | null | string, decimals = 2, useLakhsCrores = false): string {
  // Handle undefined, null, or NaN
  if (value === undefined || value === null) return '0';
  
  // Convert string to number if needed
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return '0';
  
  // Use lakhs and crores format if specified and number is large enough
  if (useLakhsCrores && Math.abs(num) >= 1000) {
    return formatIndianLakhsCrores(num);
  }
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format a number in Indian lakhs and crores format
 * @param value The number to format
 * @returns Formatted string with lakhs and crores
 */
export function formatIndianLakhsCrores(value: number): string {
  const num = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  // For extremely large numbers (above 1 billion/100 crore)
  if (num >= 1000000000) { 
    // For numbers above 1 billion, show in crores without decimal
    const crores = num / 10000000;
    if (crores >= 10000) { // More than 10,000 crores
      return sign + Math.round(crores).toLocaleString('en-IN') + ' Cr';
    } else {
      return sign + crores.toFixed(2) + ' Cr';
    }
  } 
  // 1 crore = 10,000,000
  else if (num >= 10000000) {
    const crores = num / 10000000;
    return sign + crores.toFixed(2) + ' Cr';
  } 
  // 1 lakh = 100,000
  else if (num >= 100000) {
    const lakhs = num / 100000;
    return sign + lakhs.toFixed(0) + ' Lakh';
  } 
  // 1 thousand = 1,000
  else if (num >= 1000) {
    const thousands = num / 1000;
    return sign + thousands.toFixed(0) + 'K';
  } 
  else {
    return sign + num.toFixed(0);
  }
}

/**
 * Format a date and time
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string | number | undefined | null, options?: {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if date is in the future (likely a timezone issue)
    const now = new Date();
    if (dateObj > now && dateObj.getFullYear() > now.getFullYear()) {
      // Adjust the year to current year if it's in the future
      dateObj.setFullYear(now.getFullYear());
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: options?.dateStyle || 'medium',
      timeStyle: options?.timeStyle || 'short'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date (without time)
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number | undefined | null, options?: {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
}): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: options?.dateStyle || 'medium'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}