/**
 * Utility functions for handling API data transformations
 */

/**
 * Transforms snake_case object keys to camelCase
 * @param obj The object to transform
 * @returns A new object with camelCase keys
 */
export function snakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {} as any);
}

/**
 * Transforms a nozzle object from backend format to frontend format
 * @param backendNozzle The nozzle object from the backend
 * @returns A transformed nozzle object for the frontend
 */
export function transformNozzle(backendNozzle: any): any {
  return {
    id: backendNozzle.id,
    pumpId: backendNozzle.pump_id,
    nozzleNumber: backendNozzle.nozzle_number,
    fuelType: backendNozzle.fuel_type,
    status: backendNozzle.status,
    createdAt: backendNozzle.created_at
  };
}

/**
 * Transforms a pump object from backend format to frontend format
 * @param backendPump The pump object from the backend
 * @returns A transformed pump object for the frontend
 */
export function transformPump(backendPump: any): any {
  return {
    id: backendPump.id,
    label: backendPump.label,
    serialNumber: backendPump.serial_number,
    status: backendPump.status,
    stationId: backendPump.station_id,
    nozzleCount: backendPump.nozzle_count || 0,
    createdAt: backendPump.created_at
  };
}

/**
 * Safely extracts data from an API response
 * @param response The API response object
 * @param dataPath Optional path to the data within the response
 * @returns The extracted data or null if not found
 */
export function safeExtractData(response: any, dataPath?: string): any {
  if (!response) return null;
  
  // Handle success: true, data: {...} format
  if (response.success && response.data) {
    if (dataPath) {
      return response.data[dataPath] || null;
    }
    return response.data;
  }
  
  // Handle direct data format
  if (dataPath && response[dataPath]) {
    return response[dataPath];
  }
  
  return response;
}