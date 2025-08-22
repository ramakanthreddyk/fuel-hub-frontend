/**
 * @file components/pumps/UnifiedPumpCard.tsx
 * @description Unified pump card component - refactored for maintainability and contract compliance
 */
import React, { memo, useMemo } from 'react';
import type { Pump } from '@/api/api-contract';
import type { PumpCardVariant } from '@/models/pump';
import type { PumpCardActions } from '@/models/pump-actions';
import { createPumpModel } from '@/models/pump';
import { getPumpStatusConfig, getCardVariantStyle } from '@/utils/pump-config';
import {
  CompactPumpCard,
  EnhancedPumpCard,
  CreativePumpCard,
  StandardPumpCard,
} from './PumpCardVariants';

/**
 * Main component props interface
 */
export interface UnifiedPumpCardProps {
  /** Pump data from API contract */
  readonly pump: Pump;
  /** Display variant */
  readonly variant?: PumpCardVariant;
  /** Action handlers */
  readonly actions?: PumpCardActions;
  /** External attention flag */
  readonly needsAttention?: boolean;
  /** Whether to show station name */
  readonly showStationName?: boolean;
  /** Optional serial number for hardware identification */
  readonly serialNumber?: string;
  /** Optional station name for cross-station display */
  readonly stationName?: string;
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Unified pump card component with multiple display variants
 * Supports: compact, standard, enhanced, realistic, creative
 */
export const UnifiedPumpCard = memo(function UnifiedPumpCard({
  pump,
  variant = 'standard',
  actions = {},
  needsAttention = false,
  showStationName = false,
  serialNumber,
  stationName,
  className,
}: UnifiedPumpCardProps) {
  // Transform API contract data to domain model
  const pumpModel = useMemo(
    () => createPumpModel(pump, serialNumber, stationName),
    [pump, serialNumber, stationName]
  );

  // Determine if pump needs attention (external flag OR model logic)
  const finalNeedsAttention = useMemo(
    () => needsAttention || pumpModel.needsAttention,
    [needsAttention, pumpModel.needsAttention]
  );

  // Get status configuration
  const statusConfig = useMemo(
    () => getPumpStatusConfig(pump.status),
    [pump.status]
  );

  // Get card variant styling for creative mode
  const cardVariant = useMemo(
    () => getCardVariantStyle(pump.id),
    [pump.id]
  );

  // Create enhanced model with final attention state
  const enhancedPumpModel = useMemo(
    () => ({ ...pumpModel, needsAttention: finalNeedsAttention }),
    [pumpModel, finalNeedsAttention]
  );

  // Render appropriate variant
  const commonProps = {
    pump: enhancedPumpModel,
    statusConfig,
    actions,
    showStationName,
    className,
  };

  switch (variant) {
    case 'compact':
      return <CompactPumpCard {...commonProps} />;
    
    case 'enhanced':
      return <EnhancedPumpCard {...commonProps} />;
    
    case 'creative':
      return <CreativePumpCard {...commonProps} cardVariant={cardVariant} />;
    
    case 'realistic':
      return <StandardPumpCard {...commonProps} variant="realistic" />;
    
    case 'standard':
    default:
      return <StandardPumpCard {...commonProps} variant="standard" />;
  }
});

// Legacy type exports for backward compatibility
export type { PumpCardVariant, PumpCardActions };
export type PumpData = Pump & { 
  nozzleCount: number; 
  serialNumber?: string; 
  stationName?: string; 
};

// Re-export for convenience
export { createPumpModel, getPumpStatusConfig, getCardVariantStyle };
