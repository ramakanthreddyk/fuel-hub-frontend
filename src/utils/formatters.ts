
/**
 * @file utils/formatters.ts
 * @description Utility functions for formatting values
 */

export const formatCurrency = (
  amount: number | string | null | undefined,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useLakhsCrores?: boolean;
  } = {}
): string => {
  const numValue = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
  
  const {
    currency = 'INR',
    locale = 'en-IN',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    useLakhsCrores = false
  } = options;

  if (useLakhsCrores && numValue >= 100000) {
    if (numValue >= 10000000) {
      return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    } else if (numValue >= 100000) {
      return `₹${(numValue / 100000).toFixed(2)} L`;
    }
  }

  // Ensure maximumFractionDigits is within valid range (0-20)
  const safeMaxFractionDigits = Math.min(Math.max(0, maximumFractionDigits), 20);
  // Ensure minimumFractionDigits is within valid range and not greater than maximumFractionDigits
  const safeMinFractionDigits = Math.min(Math.max(0, minimumFractionDigits), safeMaxFractionDigits);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: safeMinFractionDigits,
    maximumFractionDigits: safeMaxFractionDigits
  }).format(numValue);
};

export const formatNumber = (
  value: number | string | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
  } = {}
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    useGrouping = true
  } = options;

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping
  }).format(numValue);
};

export const formatDate = (
  date: string | Date | null | undefined,
  options: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    format?: 'date' | 'time' | 'datetime';
    locale?: string;
  } = {}
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const {
    dateStyle = 'medium',
    timeStyle = 'short',
    format = 'date',
    locale = 'en-IN'
  } = options;

  if (format === 'date') {
    return new Intl.DateTimeFormat(locale, { dateStyle }).format(dateObj);
  } else if (format === 'time') {
    return new Intl.DateTimeFormat(locale, { timeStyle }).format(dateObj);
  } else {
    return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(dateObj);
  }
};

export const formatDateTime = (
  date: string | Date | null | undefined,
  options: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    locale?: string;
  } = {}
): string => {
  return formatDate(date, { ...options, format: 'datetime' });
};

export const formatPercentage = (
  value: number | string | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2
  } = options;

  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numValue / 100);
};

export const formatVolume = (
  volume: number | string | null | undefined,
  decimals: number = 2,
  showUnit: boolean = true,
  unit: string = 'L'
): string => {
  const numValue = typeof volume === 'string' ? parseFloat(volume) : (volume || 0);
  
  // Use compact notation for large volumes
  if (numValue >= 1000000) {
    const millions = (numValue / 1000000).toFixed(1);
    return showUnit ? `${millions}M ${unit}` : `${millions}M`;
  } else if (numValue >= 100000) {
    const lakhs = (numValue / 100000).toFixed(1);
    return showUnit ? `${lakhs}L ${unit}` : `${lakhs}L`;
  }
  
  const formatted = formatNumber(numValue, { maximumFractionDigits: decimals });
  return showUnit ? `${formatted} ${unit}` : formatted;
};

export const formatPrice = (
  price: number | string | null | undefined,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  return formatCurrency(price, options);
};

export const formatReading = (
  reading: number | string | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const numValue = typeof reading === 'string' ? parseFloat(reading) : (reading || 0);
  
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true
  }).format(numValue);
};

export const formatSafeNumber = (
  value: number | string | null | undefined,
  fallback: string = '0'
): string => {
  if (value === null || value === undefined) return fallback;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? fallback : formatNumber(numValue);
};

export const formatGrowth = (
  growth: number | string | null | undefined,
  options: {
    showSign?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const numValue = typeof growth === 'string' ? parseFloat(growth) : (growth || 0);
  
  const {
    showSign = true,
    minimumFractionDigits = 1,
    maximumFractionDigits = 2
  } = options;

  const formatted = formatNumber(numValue, { minimumFractionDigits, maximumFractionDigits });
  
  if (showSign && numValue > 0) {
    return `+${formatted}%`;
  }
  
  return `${formatted}%`;
};

export const formatCompactNumber = (
  value: number | string | null | undefined,
  options: {
    locale?: string;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  const {
    locale = 'en-IN',
    maximumFractionDigits = 1
  } = options;

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits
  }).format(numValue);
};

export const formatDuration = (
  milliseconds: number | string | null | undefined,
  options: {
    format?: 'short' | 'long';
    includeSeconds?: boolean;
  } = {}
): string => {
  const ms = typeof milliseconds === 'string' ? parseFloat(milliseconds) : (milliseconds || 0);
  
  const {
    format = 'short',
    includeSeconds = true
  } = options;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return format === 'short' ? `${days}d ${hours % 24}h` : `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return format === 'short' ? `${hours}h ${minutes % 60}m` : `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return format === 'short' ? `${minutes}m ${includeSeconds ? `${seconds % 60}s` : ''}` : `${minutes} minute${minutes > 1 ? 's' : ''} ${includeSeconds ? `${seconds % 60} second${seconds % 60 > 1 ? 's' : ''}` : ''}`;
  } else {
    return format === 'short' ? `${seconds}s` : `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
};

export const formatFileSize = (
  bytes: number | string | null | undefined,
  options: {
    decimals?: number;
    binary?: boolean;
  } = {}
): string => {
  const numBytes = typeof bytes === 'string' ? parseFloat(bytes) : (bytes || 0);
  
  const {
    decimals = 2,
    binary = false
  } = options;

  if (numBytes === 0) return '0 Bytes';

  const k = binary ? 1024 : 1000;
  const sizes = binary 
    ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatPhoneNumber = (
  phone: string | null | undefined,
  options: {
    countryCode?: string;
    format?: 'international' | 'national' | 'compact';
  } = {}
): string => {
  if (!phone) return '';
  
  const {
    countryCode = '+91',
    format = 'national'
  } = options;

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Indian phone numbers (10 digits)
  if (cleaned.length === 10) {
    switch (format) {
      case 'international':
        return `${countryCode} ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      case 'national':
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      case 'compact':
        return cleaned;
      default:
        return cleaned;
    }
  }
  
  return phone;
};

export const formatAddress = (
  address: string | null | undefined,
  options: {
    maxLength?: number;
    includeEllipsis?: boolean;
  } = {}
): string => {
  if (!address) return '';
  
  const {
    maxLength = 100,
    includeEllipsis = true
  } = options;

  if (address.length <= maxLength) return address;
  
  return includeEllipsis 
    ? `${address.substring(0, maxLength)}...`
    : address.substring(0, maxLength);
};

export const formatInitials = (
  name: string | null | undefined,
  options: {
    maxInitials?: number;
    separator?: string;
  } = {}
): string => {
  if (!name) return '';
  
  const {
    maxInitials = 2,
    separator = ''
  } = options;

  return name
    .split(' ')
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join(separator);
};

export const formatTimeAgo = (
  date: string | Date | null | undefined,
  options: {
    locale?: string;
    numeric?: 'always' | 'auto';
  } = {}
): string => {
  if (!date) return '';
  
  const {
    locale = 'en-IN',
    numeric = 'auto'
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric });

  if (diffInDays > 0) {
    return rtf.format(-diffInDays, 'day');
  } else if (diffInHours > 0) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInMinutes > 0) {
    return rtf.format(-diffInMinutes, 'minute');
  } else {
    return rtf.format(-diffInSeconds, 'second');
  }
};

export const formatRange = (
  min: number | string | null | undefined,
  max: number | string | null | undefined,
  options: {
    separator?: string;
    formatter?: (value: number) => string;
  } = {}
): string => {
  const {
    separator = ' - ',
    formatter = (value) => formatNumber(value)
  } = options;

  const minValue = typeof min === 'string' ? parseFloat(min) : (min || 0);
  const maxValue = typeof max === 'string' ? parseFloat(max) : (max || 0);

  if (minValue === maxValue) {
    return formatter(minValue);
  }

  return `${formatter(minValue)}${separator}${formatter(maxValue)}`;
};

export const formatStatus = (
  status: string | null | undefined,
  options: {
    capitalize?: boolean;
    replace?: { [key: string]: string };
  } = {}
): string => {
  if (!status) return '';
  
  const {
    capitalize = true,
    replace = {}
  } = options;

  let formatted = replace[status] || status;
  
  if (capitalize) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  }
  
  return formatted;
};
