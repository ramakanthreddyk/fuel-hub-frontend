
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
      settings: (id: string) => `/nozzles/${id}/settings`,
    },
    readings: {
      base: '/nozzle-readings',
      byId: (id: string) => `/nozzle-readings/${id}`,
      canCreate: (nozzleId: string) => `/nozzle-readings/can-create/${nozzleId}`,
      void: (id: string) => `/nozzle-readings/${id}/void`,
    },
    fuelPrices: {
      base: '/fuel-prices',
      byId: (id: string) => `/fuel-prices/${id}`,
      validate: (stationId: string) => `/fuel-prices/validate/${stationId}`,
      missing: '/fuel-prices/missing',
    },
    creditors: {
      base: '/creditors',
      byId: (id: string) => `/creditors/${id}`,
      byStation: (stationId: string) => `/creditors?stationId=${stationId}`,
      payments: (creditorId: string) => `/creditors/${creditorId}/payments`,
      balance: (creditorId: string) => `/creditors/${creditorId}/balance`,
    },
    creditPayments: {
      base: '/credit-payments',
      byId: (id: string) => `/credit-payments/${id}`,
    },
    users: {
      base: '/users',
      byId: (id: string) => `/users/${id}`,
      changePassword: (userId: string) => `/users/${userId}/change-password`,
      resetPassword: (userId: string) => `/users/${userId}/reset-password`,
    },
    reports: {
      base: '/reports',
      sales: '/reports/sales',
      inventory: '/reports/inventory',
      financial: '/reports/financial',
      attendance: '/reports/attendance',
      export: '/reports/export',
      schedule: '/reports/schedule',
      download: (id: string) => `/reports/download/${id}`,
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
