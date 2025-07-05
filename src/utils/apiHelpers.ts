
/**
 * API Helper Utilities
 * 
 * Note: snake_case to camelCase conversion is now handled globally
 * by the response interceptor in src/api/client.ts
 */

/**
 * Ensures the input is an array, even if it's not
 * @deprecated Use extractApiArray from src/api/client.ts instead
 */
export const ensureArray = <T>(data: any): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    // Try common array property names
    const arrayKeys = ['items', 'results', 'data', 'list'];
    for (const key of arrayKeys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }
  return [];
};

/**
 * Validates that required fields are present in an object
 */
export const validateRequiredFields = (obj: any, requiredFields: string[]): boolean => {
  return requiredFields.every(field =>
    obj && Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== undefined,
  );
};

/**
 * Safely extracts nested object properties
 */
export const safeGet = (obj: any, path: string, defaultValue: any = null): any => {
  return path.split('.').reduce((current, key) => {
    return (current && current[key] !== undefined) ? current[key] : defaultValue;
  }, obj);
};
