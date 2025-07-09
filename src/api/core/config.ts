
/**
 * @file api/core/config.ts
 * @description API configuration and endpoint definitions
 */

const API_CONFIG = {
  endpoints: {
    stations: {
      base: '/stations',
      byId: (id: string) => `/stations/${id}`,
    },
    pumps: {
      base: '/pumps',
      byId: (id: string) => `/pumps/${id}`,
    },
    nozzles: {
      base: '/nozzles',
      byId: (id: string) => `/nozzles/${id}`,
      canCreate: (nozzleId: string) => `/nozzles/${nozzleId}/can-create-reading`,
    },
    readings: {
      base: '/nozzle-readings',
      byId: (id: string) => `/nozzle-readings/${id}`,
      canCreate: (nozzleId: string) => `/nozzle-readings/can-create/${nozzleId}`,
    },
    fuelPrices: {
      base: '/fuel-prices',
      byId: (id: string) => `/fuel-prices/${id}`,
      validate: (stationId: string) => `/fuel-prices/validate/${stationId}`,
      missing: '/fuel-prices/missing',
    },
    users: {
      base: '/users',
      byId: (id: string) => `/users/${id}`,
      changePassword: (userId: string) => `/users/${userId}/change-password`,
      resetPassword: (userId: string) => `/users/${userId}/reset-password`,
    },
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh-token',
      profile: '/auth/profile',
    },
  },
  
  // Default request timeout (30 seconds)
  timeout: 30000,
  
  // Default retry configuration
  retry: {
    attempts: 2,
    delay: 1000, // 1 second
  },
  
  // Cache configuration
  cache: {
    staleTime: 60000, // 1 minute
    cacheTime: 300000, // 5 minutes
  },
} as const;

export default API_CONFIG;
