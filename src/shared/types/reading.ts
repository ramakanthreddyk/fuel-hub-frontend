/**
 * @file shared/types/reading.ts
 * @description Reading-related type definitions
 */

import { ID, Timestamp, Currency } from './index';
import { FuelType } from './fuel';

export interface Reading {
  id: ID;
  nozzleId: ID;
  reading: number;
  previousReading?: number;
  volume?: number;
  pricePerLiter?: Currency;
  totalAmount?: Currency;
  recordedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Optional expanded/calculated fields for UI
  nozzleNumber?: number;
  pumpId?: ID;
  pumpName?: string;
  stationId?: ID;
  stationName?: string;
  fuelType?: FuelType;
}

export interface CreateReadingRequest {
  nozzleId: ID;
  reading: number;
  recordedAt: Timestamp;
  pricePerLiter?: Currency;
}

export interface UpdateReadingRequest {
  id: ID;
  reading?: number;
  recordedAt?: Timestamp;
  pricePerLiter?: Currency;
}

export interface ReadingFilters {
  nozzleId?: ID | 'all';
  pumpId?: ID | 'all'; 
  stationId?: ID | 'all';
  fuelType?: FuelType | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'recordedAt' | 'reading' | 'volume' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface ReadingsSummary {
  totalReadings: number;
  totalVolume: number;
  totalRevenue: Currency;
  averageTransactionValue: Currency;
  periodStart: Timestamp;
  periodEnd: Timestamp;
  byFuelType: Record<FuelType, {
    count: number;
    volume: number;
    revenue: Currency;
  }>;
}

export type ReadingFormData = Pick<Reading, 'nozzleId' | 'reading' | 'recordedAt' | 'pricePerLiter'>;
