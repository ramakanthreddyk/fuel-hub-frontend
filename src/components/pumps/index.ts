/**
 * @file components/pumps/index.ts
 * @description Pump components exports
 */

// New unified component (recommended)
export { UnifiedPumpCard } from './UnifiedPumpCard';
export type { 
  PumpData, 
  PumpCardVariant, 
  PumpCardActions, 
  UnifiedPumpCardProps 
} from './UnifiedPumpCard';

// Demo component for testing and showcasing
export { PumpCardDemo } from './PumpCardDemo';

// Legacy components (deprecated - use UnifiedPumpCard instead)
export { CompactPumpCard } from './CompactPumpCard';
export { FuelPumpCard } from './FuelPumpCard';
export { EnhancedFuelPumpCard } from './EnhancedFuelPumpCard';
export { PumpCard } from './PumpCard';
export { RealisticPumpCard } from './RealisticPumpCard';
