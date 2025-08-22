/**
 * @file shared/types/nozzle.ts
 * @description Nozzle-related type definitions
 */

import { EntityStatus, ID, Timestamp } from './index';
import { FuelType } from './fuel';

export interface Nozzle {
  id: ID;
  pumpId: ID;
  nozzleNumber: number;
  fuelType: FuelType;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NozzleWithMetrics extends Nozzle {
  dailyVolume?: number;
  dailyRevenue?: number;
  transactionCount?: number;
  lastReadingValue?: number;
  lastReadingTime?: Timestamp;
}

export interface CreateNozzleRequest {
  pumpId: ID;
  nozzleNumber: number;
  fuelType: FuelType;
}

export interface UpdateNozzleRequest {
  id: ID;
  nozzleNumber?: number;
  fuelType?: FuelType;
  status?: EntityStatus;
}

export interface NozzleFilters {
  pumpId?: ID | 'all';
  stationId?: ID | 'all';
  fuelType?: FuelType | 'all';
  status?: EntityStatus | 'all';
  search?: string;
  sortBy?: 'nozzleNumber' | 'fuelType' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}
