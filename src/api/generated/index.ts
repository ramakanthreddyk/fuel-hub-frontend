
// Generated API types - exports from existing api-contract
export * from '../api-contract';

// Re-export commonly used types
export type {
  ApiResponse,
  ApiErrorResponse,
  User,
  Station,
  Pump,
  Nozzle,
  FuelPrice,
  Creditor,
  Sale,
  Tenant,
  Plan,
  AdminUser,
  CreateUserRequest,
  CreateStationRequest,
  CreatePumpRequest,
  CreateNozzleRequest,
  CreateReadingRequest,
  CreateFuelPriceRequest,
  CreateCreditorRequest,
  CreateTenantRequest,
  CreatePlanRequest,
  CreateSuperAdminRequest,
  SalesSummary,
  PaymentMethodBreakdown,
  SystemAlert,
  AttendantStation,
  CashReport,
  CreateCashReportRequest,
  SuperAdminSummary
} from '../api-contract';

// Export contract services
export { authService } from '../contract/auth.service';
export { stationsService } from '../contract/stations.service';
export { attendantService } from '../contract/attendant.service';
export { superAdminService } from '../contract/superadmin.service';
export { ownerService } from '../contract/owner.service';
export { managerService } from '../contract/manager.service';
