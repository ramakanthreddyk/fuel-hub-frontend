
/**
 * API Services Index
 * 
 * Centralized export of all API services
 */

// Export existing services
export { fuelPricesService } from './fuel-prices.service';
export { creditorsService } from './creditors.service';
export { dashboardService } from './dashboardService';
export { alertsService } from './alerts.service';
export { reportsService } from './reportsService';
export { dailySalesService } from './dailySalesService';
export { salesService } from './salesService';
export { inventoryService } from './inventoryService';
export type { FuelInventory, FuelInventorySummary } from './inventoryService';

// Export contract services (these exist)
export { authService } from '../contract/auth.service';
export { stationsService } from '../contract/stations.service';
export { attendantService } from '../contract/attendant.service';
export { superAdminService } from '../contract/superadmin.service';

// Re-export types
export * from '../api-contract';
