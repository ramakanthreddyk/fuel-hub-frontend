/**
 * @file utils/caseConversion.ts
 * @description Utility functions for converting between snake_case and camelCase
 */

/**
 * Convert a snake_case string to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert an object with snake_case keys to camelCase keys
 * @param obj The object with snake_case keys
 * @returns A new object with camelCase keys
 */
export function convertKeysToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as unknown as T;
  }

  const camelCaseObj: any = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    camelCaseObj[camelKey] = convertKeysToCamelCase(obj[key]);
  });
  
  return camelCaseObj as T;
}

/**
 * Convert an object with camelCase keys to snake_case keys
 * @param obj The object with camelCase keys
 * @returns A new object with snake_case keys
 */
export function convertKeysToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase) as unknown as T;
  }

  const snakeCaseObj: any = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = camelToSnake(key);
    snakeCaseObj[snakeKey] = convertKeysToSnakeCase(obj[key]);
  });
  
  return snakeCaseObj as T;
}