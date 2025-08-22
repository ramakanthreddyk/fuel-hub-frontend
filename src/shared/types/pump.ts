/**
 * @file shared/types/pump.ts
 * @description Pump-related type definitions
 */

import { EntityStatus, ID, Timestamp } from './index';

export interface Pump {
  id: ID;
  stationId: ID;
  label: string;
  serialNumber?: string;
  status: EntityStatus;
  nozzleCount: number;
  position?: {
    x: number;
    y: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Optional expanded data
  nozzles?: Nozzle[];
}

export interface PumpWithMetrics extends Pump {
  dailyVolume?: number;
  dailyRevenue?: number;
  averageTransactionValue?: number;
  transactionCount?: number;
  lastTransactionTime?: Timestamp;
}

export interface CreatePumpRequest {
  stationId: ID;
  label: string;
  serialNumber?: string;
}

export interface UpdatePumpRequest {
  id: ID;
  label?: string;
  serialNumber?: string;
  status?: EntityStatus;
}

export interface PumpFilters {
  stationId?: ID | 'all';
  status?: EntityStatus | 'all';
  search?: string;
  sortBy?: 'label' | 'createdAt' | 'nozzleCount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export type PumpCardVariant = 
  | 'compact' 
  | 'detailed' 
  | 'realistic' 
  | 'fuel-focused' 
  | 'enhanced';

export interface PumpCardActions {
  onEdit?: (pump: Pump) => void;
  onDelete?: (pump: Pump) => void;
  onViewDetails?: (pump: Pump) => void;
  onManageNozzles?: (pump: Pump) => void;
  onViewReadings?: (pump: Pump) => void;
}
