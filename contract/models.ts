// Canonical contract for shared types between backend and frontend
// Copy this file to both repos and keep in sync

export type StationStatus = 'active' | 'inactive' | 'maintenance';

export interface User {
  id: string;
  userId: string;
  email: string;
  name?: string;
  planName?: string;
  tenantId?: string | null;
  role: string;
}

export interface Nozzle {
  id: string;
  pumpId: string;
  stationId: string;
  name: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: StationStatus;
  currentReading: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  status: StationStatus;
  nozzles: Nozzle[];
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  tenantId: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  contactNumber: string;
  email: string;
  status: StationStatus;
  pumps: Pump[];
}

// Add more shared types as needed
