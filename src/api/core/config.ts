/**
 * @file config.ts
 * @description API configuration
 */

const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net',
  apiPath: '/api/v1',
  endpoints: {
    auth: {
      login: '/auth/login',
      adminLogin: '/admin/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    stations: {
      base: '/stations',
      metrics: (id: string) => `/stations/${id}/metrics`,
      performance: (id: string) => `/stations/${id}/performance`,
      efficiency: (id: string) => `/stations/${id}/efficiency`
    },
    pumps: {
      base: '/pumps',
      byId: (id: string) => `/pumps/${id}`
    },
    nozzles: {
      base: '/nozzles',
      byId: (id: string) => `/nozzles/${id}`,
      canCreate: (id: string) => `/nozzle-readings/can-create/${id}`
    },
    readings: {
      base: '/nozzle-readings'
    },
    fuelPrices: {
      base: '/fuel-prices',
      validate: (stationId: string) => `/fuel-prices/validate/${stationId}`,
      missing: '/fuel-prices/missing'
    },
    users: {
      base: '/users',
      byId: (id: string) => `/users/${id}`,
      changePassword: (id: string) => `/users/${id}/change-password`,
      resetPassword: (id: string) => `/users/${id}/reset-password`
    },
    creditors: {
      base: '/creditors',
      byId: (id: string) => `/creditors/${id}`
    }
  }
};

export default API_CONFIG;