export interface ExportRequest {
  reportType: string;
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
}

export interface ExportResponse {
  success: boolean;
  url: string;
  message?: string;
}
// Canonical contract for sales report filters and data (sync with DB schema)
// Copy this file to both repos and keep in sync

export interface SalesReportFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  fuelType?: string;
  paymentMethod?: string;
  attendantId?: string;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SalesReportData {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  volume: number;
  amount: number;
  paymentMethod: string;
  date: string;
  attendantId?: string;
  attendantName?: string;
}

// Add more shared types as needed
