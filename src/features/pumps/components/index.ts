/**
 * @file features/pumps/components/index.ts  
 * @description Pump components exports (updated for new architecture)
 */

// Re-export all pump components
export * from './CompactPumpCard';
export * from './EnhancedFuelPumpCard';
export * from './FuelPumpCard';
export * from './PumpActions';
export * from './PumpCard';
export * from './PumpCardDemo';
export * from './RealisticPumpCard';
export * from './UnifiedPumpCard';

// Legacy components (deprecated - use UnifiedPumpCard instead)
export { CompactPumpCard } from './CompactPumpCard';
export { FuelPumpCard } from './FuelPumpCard';
export { EnhancedFuelPumpCard } from './EnhancedFuelPumpCard';
export { PumpCard } from './PumpCard';
export { RealisticPumpCard } from './RealisticPumpCard';
