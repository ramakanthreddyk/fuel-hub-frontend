/**
 * Utility functions for transforming API responses
 */

/**
 * Normalizes property names from snake_case to camelCase
 */
export function normalizePropertyNames<T>(obj: any): T {
  if (!obj || typeof obj !== 'object') return obj as T;
  
  if (Array.isArray(obj)) {
    return obj.map(item => normalizePropertyNames(item)) as unknown as T;
  }
  
  const normalized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    normalized[camelKey] = typeof value === 'object' && value !== null
      ? normalizePropertyNames(value)
      : value;
    
    if (camelKey !== key) {
      normalized[key] = value;
    }
  }
  
  return normalized as T;
}

/**
 * Ensures an object has both camelCase and snake_case versions of properties
 */
export function ensurePropertyAccess<T>(obj: any): T {
  if (!obj || typeof obj !== 'object') return obj as T;
  
  if (Array.isArray(obj)) {
    return obj.map(item => ensurePropertyAccess(item)) as unknown as T;
  }
  
  const result: Record<string, any> = { ...obj };
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.includes('_')) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      if (!(camelKey in result)) {
        result[camelKey] = value;
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      result[key] = ensurePropertyAccess(value);
    }
  }
  
  return result as T;
}