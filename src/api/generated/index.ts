
/**
 * Generated API Exports
 * 
 * This file exports all contract types and services.
 * It serves as the main entry point for all frontend API usage.
 */

// Export all types from the single contract file
export * from '../api-contract';

// Export contract services
export { authService } from '../contract/auth.service';
export { stationsService } from '../contract/stations.service';
export { attendantService } from '../contract/attendant.service';
export { superAdminService } from '../contract/superadmin.service';
export { setupService } from '../contract/setup.service';

// Export contract client
export { contractClient } from '../contract-client';

// Export hooks
export { useContractLogin, useContractLogout } from '../../hooks/useContractAuth';
export { useContractStations } from '../../hooks/useContractStations';
export { useSetupStatus } from '../../hooks/useSetupStatus';
