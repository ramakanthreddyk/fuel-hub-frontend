/**
 * Ensures that API responses are always arrays
 * @param data The data from the API response
 * @returns An array, either the original data if it was an array, or an empty array
 */
export function ensureArray<T>(data: any): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [];
}
