
/**
 * @file reading.ts
 * @description Reading type definitions
 */

export interface Reading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check';
  creditorId?: string;
  nozzleNumber?: number;
  previousReading?: number;
  volume?: number;
  amount?: number;
  pricePerLitre?: number;
  fuelType?: string;
  stationName?: string;
  stationId?: string;
  pumpId?: string;
  pumpName?: string;
  attendantName?: string;
  createdAt: string;
  updatedAt?: string;
}
