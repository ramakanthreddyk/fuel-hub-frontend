export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "owner" | "manager" | "attendant";
  tenantId?: string;
  tenantName?: string;
  stationId?: string;
  stationName?: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
}

export interface Pump {
  id: string;
  label: string;
  serialNumber: string;
  status: "active" | "inactive" | "maintenance";
  stationId: string;
}

export interface CreatePumpRequest {
  label: string;
  serialNumber: string;
  status: "active" | "inactive" | "maintenance";
  stationId: string;
}

export interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
  status: "active" | "inactive" | "maintenance";
  pumpId: string;
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
}

export interface UpdateNozzleRequest {
  status?: "active" | "inactive" | "maintenance";
}

export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
  nozzleNumber?: number;
  fuelType?: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleNumber: number;
  fuelType: string;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod: string;
  cashDeclared: number;
}

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: "petrol" | "diesel" | "premium";
  price: number;
  validFrom: string;
  createdAt: string;
  station?: {
    name: string;
  };
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: "petrol" | "diesel" | "premium";
  price: number;
  validFrom: string;
}

export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: string;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  creditorId?: string;
  status: 'posted' | 'draft';
  recordedAt: string;
  createdAt: string;
  station?: {
    name: string;
  };
  nozzle?: {
    nozzleNumber: number;
  };
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface Creditor {
  id: string;
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  outstandingAmount?: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCreditorRequest {
  partyName: string;
  contactPerson?: string;
  phoneNumber?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  creditorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  reference?: string;
  notes?: string;
}

// Add attendant-specific types
export interface AttendantStation {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedAt: string;
}

export interface AttendantPump {
  id: string;
  label: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  stationId: string;
  stationName: string;
}

export interface AttendantNozzle {
  id: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  pumpId: string;
  pumpLabel: string;
  stationName: string;
}

export interface CashReport {
  id: string;
  stationId: string;
  reportedBy: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
  createdAt: string;
}

export interface CreateCashReportRequest {
  stationId: string;
  cashAmount: number;
  reportDate: string;
  shift: 'morning' | 'afternoon' | 'night';
  notes?: string;
}

// Add alert/warning types
export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  stationId?: string;
  nozzleId?: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unacknowledged: number;
}

// Update existing types to include fuel price validation
export interface FuelPriceValidation {
  stationId: string;
  missingFuelTypes: ('petrol' | 'diesel' | 'premium')[];
  outdatedPrices: FuelPrice[];
  hasActivePrices: boolean;
}

/*
BACKEND API REQUIREMENTS - Please implement these endpoints:

1. ATTENDANT ENDPOINTS:
   GET /api/v1/attendant/stations - Get stations assigned to current attendant
   GET /api/v1/attendant/pumps?stationId={id} - Get pumps for assigned stations
   GET /api/v1/attendant/nozzles?pumpId={id} - Get nozzles for assigned pumps
   GET /api/v1/attendant/creditors?stationId={id} - Get creditors for assigned stations
   POST /api/v1/attendant/cash-reports - Submit cash report
   GET /api/v1/attendant/cash-reports - Get cash reports with filters
   GET /api/v1/attendant/alerts - Get system alerts for attendant
   PUT /api/v1/attendant/alerts/{id}/acknowledge - Acknowledge alert

2. FUEL PRICE VALIDATION ENDPOINTS:
   GET /api/v1/fuel-prices/validate/{stationId} - Check missing fuel prices for station
   GET /api/v1/fuel-prices/missing - Get all stations with missing prices
   GET /api/v1/nozzle-readings/can-create/{nozzleId} - Check if reading can be created

3. SYSTEM ALERTS ENDPOINTS:
   GET /api/v1/alerts/summary - Get alert counts by priority
   POST /api/v1/alerts - Create system alert
   
4. ALERT SCENARIOS TO IMPLEMENT:
   - No reading recorded for nozzle in 24+ hours (priority: medium)
   - No fuel price set for active nozzle (priority: high)
   - Creditor exceeding 90% of credit limit (priority: high)
   - Station inactive for 24+ hours (priority: medium)
   - Pump maintenance overdue (priority: low)
   - Large volume discrepancy in readings (priority: critical)
   - Cash report not submitted for shift (priority: medium)

5. VALIDATION RULES:
   - Prevent reading creation if no fuel price exists for nozzle fuel type
   - Prevent sale calculation if fuel price is older than 7 days
   - Warn if creditor approaching credit limit
*/
