/**
 * @file models/pump.ts
 * @description Pump domain models that extend the API contract
 */
import type { Pump, EntityStatus } from '@/api/api-contract';

/**
 * Extended pump model with computed properties for UI display
 */
export interface PumpModel extends Pump {
  /** Computed: Number of nozzles associated with this pump */
  readonly nozzleCount: number;
  /** Optional: Serial number for hardware identification */
  readonly serialNumber?: string;
  /** Optional: Station name for display when showing cross-station data */
  readonly stationName?: string;
  /** Computed: Whether this pump requires attention */
  readonly needsAttention: boolean;
}

/**
 * Pump status configuration for UI display
 */
export interface PumpStatusConfig {
  readonly badge: {
    readonly variant: 'default' | 'secondary' | 'outline';
    readonly className: string;
  };
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly iconColor: string;
  readonly bgColor: string;
  readonly borderColor: string;
  readonly gradient: string;
  readonly accentColor: string;
}

/**
 * Pump card display variant types
 */
export type PumpCardVariant = 'compact' | 'standard' | 'enhanced' | 'realistic' | 'creative';

/**
 * Creative card variant styling
 */
export interface CardVariantStyle {
  readonly bg: string;
  readonly border: string;
  readonly glow: string;
}

/**
 * Factory function to create PumpModel from API Pump
 */
export const createPumpModel = (
  pump: Pump, 
  serialNumber?: string, 
  stationName?: string
): PumpModel => ({
  ...pump,
  nozzleCount: pump.nozzles?.length ?? 0,
  serialNumber,
  stationName,
  needsAttention: pump.status === 'maintenance' || (pump.nozzles?.length ?? 0) === 0,
});

/**
 * Type guard to check if a pump needs attention
 */
export const pumpNeedsAttention = (pump: Pump, needsAttention = false): boolean => {
  return needsAttention || 
         pump.status === 'maintenance' || 
         (pump.nozzles?.length ?? 0) === 0;
};

/**
 * Get display label for pump status
 */
export const getPumpStatusLabel = (status: EntityStatus): string => {
  switch (status) {
    case 'active': return 'Ready';
    case 'maintenance': return 'Service';
    case 'inactive': return 'Offline';
    default: return 'Unknown';
  }
};

/**
 * Get emoji representation for pump status (realistic variant)
 */
export const getPumpStatusEmoji = (status: EntityStatus): string => {
  switch (status) {
    case 'active': return '⛽';
    case 'maintenance': return '🔧';
    case 'inactive': return '🚫';
    default: return '❓';
  }
};
