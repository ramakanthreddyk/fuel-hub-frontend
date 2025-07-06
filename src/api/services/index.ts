
/**
 * API Services Index
 * 
 * Centralized export of all API services
 */

// Export existing services
export { fuelPricesService } from './fuel-prices.service';
export { creditorsService } from './creditors.service';
export { dashboardService } from './dashboard.service';
export { alertsService } from './alerts.service';
export { reportsService } from './reports.service';
export { dailySalesService } from './dailySalesService';

// Export contract services (these exist)
export { authService } from '../contract/auth.service';
export { stationsService } from '../contract/stations.service';
export { attendantService } from '../contract/attendant.service';
export { superAdminService } from '../contract/superadmin.service';

// Re-export types
export * from '../api-contract';
