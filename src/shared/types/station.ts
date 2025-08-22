/**
 * @file shared/types/station.ts
 * @description Station-related type definitions
 */

import { FuelPrice } from './fuel';

export type EntityStatus = 'active' | 'inactive' | 'maintenance';
export type ID = string;
export type Timestamp = string;

export interface Pump {
  id: ID;
  stationId: ID;
  label: string;
  serialNumber?: string;
  status: EntityStatus;
  nozzleCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Station {
  id: ID;
  name: string;
  address?: string;
  status: EntityStatus;
  pumpCount: number;
  nozzleCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Optional expanded data
  pumps?: Pump[];
  fuelPrices?: FuelPrice[];
}

export interface StationWithMetrics extends Station {
  dailySales?: number;
  monthlyRevenue?: number;
  averageTransactionValue?: number;
  popularFuelType?: string;
  lastReadingTime?: Timestamp;
}

export interface CreateStationRequest {
  name: string;
  address?: string;
}

export interface UpdateStationRequest {
  id: ID;
  name?: string;
  address?: string;
  status?: EntityStatus;
}

export interface StationFilters {
  status?: EntityStatus | 'all';
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'pumpCount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface StationStats {
  totalStations: number;
  activeStations: number;
  inactiveStations: number;
  maintenanceStations: number;
  totalPumps: number;
  totalNozzles: number;
}
