
/**
 * API Services Index
 * 
 * Centralized export of all API services
 */

export { authService } from './auth.service';
export { stationsService } from './stations.service';
export { pumpsService } from './pumps.service';
export { nozzlesService } from './nozzles.service';
export { readingsService } from './readings.service';
export { salesService } from './sales.service';
export { fuelPricesService } from './fuel-prices.service';
export { creditorsService } from './creditors.service';
export { usersService } from './users.service';
export { dashboardService } from './dashboard.service';
export { attendantService } from './attendant.service';
export { superAdminService } from './superadmin.service';
export { alertsService } from './alerts.service';
export { reportsService } from './reports.service';

// Re-export types
export * from '../api-contract';
