

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface DataMappingContextType {
  mapApiData: <T,>(data: any, mapping?: Record<string, string>) => T;
  mapArrayData: <T,>(data: any[], mapping?: Record<string, string>) => T[];
  getStationByNozzleId: (nozzleId: string) => string;
  getNozzleNumber: (nozzleId: string) => number;
  getNozzleFuelType: (nozzleId: string) => string;
  isReady: boolean;
  isLoading: boolean;
}

const DataMappingContext = createContext<DataMappingContextType | undefined>(undefined);

interface DataMappingProviderProps {
  children: ReactNode;
}

export function DataMappingProvider({ children }: DataMappingProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const mapApiData = <T,>(data: any, mapping?: Record<string, string>): T => {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (!mapping) {
      return data as T;
    }

    const mappedData: any = {};
    
    // Apply field mappings
    Object.entries(mapping).forEach(([apiField, localField]) => {
      if (data[apiField] !== undefined) {
        mappedData[localField] = data[apiField];
      }
    });

    // Keep unmapped fields
    Object.entries(data).forEach(([key, value]) => {
      if (!mapping[key] && !mappedData[key]) {
        mappedData[key] = value;
      }
    });

    return mappedData as T;
  };

  const mapArrayData = <T,>(data: any[], mapping?: Record<string, string>): T[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => mapApiData<T>(item, mapping));
  };

  // Simple placeholder implementations for nozzle/station mapping
  const getStationByNozzleId = (nozzleId: string): string => {
    // TODO: Implement actual station lookup logic
    return `Station-${nozzleId.slice(-2)}`;
  };

  const getNozzleNumber = (nozzleId: string): number => {
    // TODO: Implement actual nozzle number lookup
    const match = nozzleId.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 1;
  };

  const getNozzleFuelType = (nozzleId: string): string => {
    // TODO: Implement actual fuel type lookup
    return 'petrol'; // Default fuel type
  };

  const value: DataMappingContextType = {
    mapApiData,
    mapArrayData,
    getStationByNozzleId,
    getNozzleNumber,
    getNozzleFuelType,
    isReady: isAuthenticated && !authLoading,
    isLoading: authLoading,
  };

  return (
    <DataMappingContext.Provider value={value}>
      {children}
    </DataMappingContext.Provider>
  );
}

export function useDataMapping() {
  const context = useContext(DataMappingContext);
  if (context === undefined) {
    throw new Error('useDataMapping must be used within a DataMappingProvider');
  }
  return context;
}

