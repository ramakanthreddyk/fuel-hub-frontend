/**
 * @file utils/mobileFormatters.ts
 * @description Mobile-responsive formatters for numbers, currency, and text
 */

import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Format currency for mobile and desktop views
 */
export const formatCurrencyMobile = (amount: number, isMobile?: boolean): string => {
  if (amount === 0) return isMobile ? '₹0' : '₹0.00';
  
  if (isMobile) {
    // Mobile: Use compact notation for large numbers
    if (Math.abs(amount) >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (Math.abs(amount) >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (Math.abs(amount) >= 1000) { // 1 thousand
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${Math.round(amount)}`;
    }
  } else {
    // Desktop: Full format with commas
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

/**
 * Format volume for mobile and desktop views
 */
export const formatVolumeMobile = (volume: number, isMobile?: boolean): string => {
  if (volume === 0) return isMobile ? '0L' : '0.00L';
  
  if (isMobile) {
    // Mobile: Compact format
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}KL`;
    } else {
      return `${Math.round(volume)}L`;
    }
  } else {
    // Desktop: Full format
    return `${volume.toLocaleString()}L`;
  }
};

/**
 * Format percentage for mobile and desktop views
 */
export const formatPercentageMobile = (percentage: number, isMobile?: boolean): string => {
  if (isMobile) {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  } else {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}% from yesterday`;
  }
};

/**
 * Format count/number for mobile and desktop views
 */
export const formatCountMobile = (count: number, isMobile?: boolean): string => {
  if (isMobile) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  } else {
    return count.toLocaleString();
  }
};

/**
 * Get responsive text size classes
 */
export const getResponsiveTextSize = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'): string => {
  const sizeMap = {
    'xs': 'text-xs',
    'sm': 'text-xs sm:text-sm',
    'base': 'text-sm sm:text-base',
    'lg': 'text-base sm:text-lg',
    'xl': 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl',
    '3xl': 'text-2xl sm:text-3xl'
  };
  return sizeMap[size];
};

/**
 * Get responsive icon size classes
 */
export const getResponsiveIconSize = (size: 'xs' | 'sm' | 'base' | 'lg'): string => {
  const sizeMap = {
    'xs': 'h-3 w-3 sm:h-4 sm:w-4',
    'sm': 'h-4 w-4 sm:h-5 sm:w-5',
    'base': 'h-5 w-5 sm:h-6 sm:w-6',
    'lg': 'h-6 w-6 sm:h-8 sm:w-8'
  };
  return sizeMap[size];
};

/**
 * Get responsive padding classes
 */
export const getResponsivePadding = (size: 'xs' | 'sm' | 'base' | 'lg'): string => {
  const sizeMap = {
    'xs': 'p-1 sm:p-2',
    'sm': 'p-2 sm:p-3',
    'base': 'p-3 sm:p-4',
    'lg': 'p-4 sm:p-6'
  };
  return sizeMap[size];
};

/**
 * Get responsive gap classes
 */
export const getResponsiveGap = (size: 'xs' | 'sm' | 'base' | 'lg'): string => {
  const sizeMap = {
    'xs': 'gap-1 sm:gap-2',
    'sm': 'gap-2 sm:gap-3',
    'base': 'gap-3 sm:gap-4',
    'lg': 'gap-4 sm:gap-6'
  };
  return sizeMap[size];
};

/**
 * Truncate text for mobile display
 */
export const truncateTextMobile = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Hook to get mobile-formatted values
 */
export const useMobileFormatters = () => {
  const isMobile = useIsMobile();
  
  return {
    formatCurrency: (amount: number) => formatCurrencyMobile(amount, isMobile),
    formatVolume: (volume: number) => formatVolumeMobile(volume, isMobile),
    formatPercentage: (percentage: number) => formatPercentageMobile(percentage, isMobile),
    formatCount: (count: number) => formatCountMobile(count, isMobile),
    truncateText: (text: string, maxLength?: number) => 
      isMobile ? truncateTextMobile(text, maxLength) : text,
    isMobile
  };
};

/**
 * Get responsive card classes
 */
export const getResponsiveCardClasses = (): string => {
  return 'p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl';
};

/**
 * Get responsive button classes
 */
export const getResponsiveButtonClasses = (size: 'sm' | 'base' | 'lg' = 'base'): string => {
  const sizeMap = {
    'sm': 'px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm',
    'base': 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    'lg': 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg'
  };
  return sizeMap[size];
};
