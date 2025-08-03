/**
 * @file dateHelpers.ts
 * @description Helper functions for handling date formatting and validation
 */

/**
 * Safely format a date value that might be a string, Date object, or invalid
 */
export function safeDateFormat(dateValue: any): string {
  if (!dateValue) {
    return 'Invalid Date';
  }

  try {
    // If it's already a string that looks like a formatted date, return it
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      return dateValue;
    }

    // Try to create a Date object
    const date = new Date(dateValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Return formatted date
    return date.toLocaleDateString();
  } catch (error) {
    console.warn('Date formatting error:', error, 'for value:', dateValue);
    return 'Invalid Date';
  }
}

/**
 * Safely format a date and time value
 */
export function safeDateTimeFormat(dateValue: any): string {
  if (!dateValue) {
    return 'Invalid Date';
  }

  try {
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleString();
  } catch (error) {
    console.warn('DateTime formatting error:', error, 'for value:', dateValue);
    return 'Invalid Date';
  }
}

/**
 * Check if a value is a valid date
 */
export function isValidDate(dateValue: any): boolean {
  if (!dateValue) return false;
  
  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Safely convert any date value to ISO string
 */
export function safeToISOString(dateValue: any): string | null {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Format date for display in cards and components
 */
export function formatDisplayDate(dateValue: any): string {
  const formatted = safeDateFormat(dateValue);
  if (formatted === 'Invalid Date') {
    return 'Date not available';
  }
  return formatted;
}

/**
 * Format datetime for display in tables and detailed views
 */
export function formatDisplayDateTime(dateValue: any): string {
  const formatted = safeDateTimeFormat(dateValue);
  if (formatted === 'Invalid Date') {
    return 'Date not available';
  }
  return formatted;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateValue: any): string {
  if (!isValidDate(dateValue)) {
    return 'Unknown time';
  }

  try {
    const date = new Date(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return safeDateFormat(dateValue);
  } catch {
    return 'Unknown time';
  }
}

/**
 * Debug function to log date value and type
 */
export function debugDateValue(dateValue: any, context: string = ''): void {
  console.log(`[DATE DEBUG] ${context}:`, {
    value: dateValue,
    type: typeof dateValue,
    isValid: isValidDate(dateValue),
    formatted: safeDateFormat(dateValue),
    raw: JSON.stringify(dateValue)
  });
}
