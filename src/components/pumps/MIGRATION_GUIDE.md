# Pump Card Component Migration Guide

## Overview

This guide helps you migrate from the old pump card components to the new `UnifiedPumpCard` component. The unified component consolidates all 5 previous pump card variants into a single, configurable component.

## Migration Benefits

- ✅ **Reduced Code Duplication**: Single component instead of 5 separate ones
- ✅ **Consistent API**: Unified props interface across all variants
- ✅ **Better Type Safety**: Strict TypeScript interfaces
- ✅ **Easier Maintenance**: Changes in one place affect all variants
- ✅ **Performance**: Smaller bundle size due to code reuse

## Component Mapping

### Old Components → New Variants

| Old Component | New Variant | Description |
|---------------|-------------|-------------|
| `CompactPumpCard` | `variant="compact"` | Space-efficient with dropdown actions |
| `FuelPumpCard` | `variant="creative"` | Animated with gradients and effects |
| `EnhancedFuelPumpCard` | `variant="enhanced"` | Rich metrics and visual indicators |
| `PumpCard` | `variant="realistic"` | Fuel station themed design |
| `RealisticPumpCard` | `variant="standard"` | Balanced layout with clear information |

## Migration Examples

### 1. CompactPumpCard → UnifiedPumpCard (compact)

**Before:**
```tsx
<CompactPumpCard
  pump={pump}
  onViewNozzles={handleViewNozzles}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**After:**
```tsx
<UnifiedPumpCard
  pump={pump}
  variant="compact"
  actions={{
    onViewNozzles: handleViewNozzles,
    onEdit: handleEdit,
    onDelete: handleDelete
  }}
/>
```

### 2. FuelPumpCard → UnifiedPumpCard (creative)

**Before:**
```tsx
<FuelPumpCard
  pump={pump}
  onViewNozzles={handleViewNozzles}
  onDelete={handleDelete}
  needsAttention={needsAttention}
/>
```

**After:**
```tsx
<UnifiedPumpCard
  pump={pump}
  variant="creative"
  actions={{
    onViewNozzles: handleViewNozzles,
    onDelete: handleDelete
  }}
  needsAttention={needsAttention}
/>
```

### 3. EnhancedFuelPumpCard → UnifiedPumpCard (enhanced)

**Before:**
```tsx
<EnhancedFuelPumpCard
  pump={pump}
  onViewNozzles={handleViewNozzles}
  onSettings={handleSettings}
/>
```

**After:**
```tsx
<UnifiedPumpCard
  pump={pump}
  variant="enhanced"
  actions={{
    onViewNozzles: handleViewNozzles,
    onSettings: handleSettings
  }}
/>
```

## Props Interface Changes

### Unified Pump Data Interface

```tsx
interface PumpData {
  id: string;
  name: string;
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number;
  stationName?: string;
}
```

### Actions Interface

```tsx
interface PumpCardActions {
  onViewNozzles?: (pumpId: string) => void;
  onEdit?: (pumpId: string) => void;
  onDelete?: (pumpId: string) => void;
  onSettings?: (pumpId: string) => void;
  onPowerToggle?: (pumpId: string) => void;
}
```

### Main Component Props

```tsx
interface UnifiedPumpCardProps {
  pump: PumpData;
  variant?: 'compact' | 'standard' | 'enhanced' | 'realistic' | 'creative';
  actions?: PumpCardActions;
  needsAttention?: boolean;
  showStationName?: boolean;
  className?: string;
}
```

## Step-by-Step Migration

### Step 1: Update Imports

Replace old component imports:
```tsx
// Remove these
import { CompactPumpCard } from '@/components/pumps/CompactPumpCard';
import { FuelPumpCard } from '@/components/pumps/FuelPumpCard';
import { EnhancedFuelPumpCard } from '@/components/pumps/EnhancedFuelPumpCard';
import { PumpCard } from '@/components/pumps/PumpCard';
import { RealisticPumpCard } from '@/components/pumps/RealisticPumpCard';

// Add this
import { UnifiedPumpCard } from '@/components/pumps/UnifiedPumpCard';
```

### Step 2: Update Component Usage

1. Choose the appropriate variant based on your use case
2. Restructure action props into the `actions` object
3. Add any new optional props as needed

### Step 3: Test and Verify

1. Check that all functionality works as expected
2. Verify visual appearance matches requirements
3. Test responsive behavior across screen sizes
4. Ensure accessibility features are maintained

## Advanced Features

### Custom Styling

```tsx
<UnifiedPumpCard
  pump={pump}
  variant="standard"
  className="custom-pump-card"
  actions={actions}
/>
```

### Conditional Variants

```tsx
const getVariantForContext = (context: string) => {
  switch (context) {
    case 'dashboard': return 'enhanced';
    case 'mobile': return 'compact';
    case 'kiosk': return 'creative';
    default: return 'standard';
  }
};

<UnifiedPumpCard
  pump={pump}
  variant={getVariantForContext(currentContext)}
  actions={actions}
/>
```

## Cleanup Checklist

After migration, you can safely:

- [ ] Remove old component files
- [ ] Update any remaining imports
- [ ] Remove unused dependencies
- [ ] Update tests to use the new component
- [ ] Update documentation and examples

## Files to Remove After Migration

```
src/components/pumps/CompactPumpCard.tsx
src/components/pumps/FuelPumpCard.tsx
src/components/pumps/EnhancedFuelPumpCard.tsx
src/components/pumps/PumpCard.tsx
src/components/pumps/RealisticPumpCard.tsx
```

## Support

If you encounter any issues during migration:

1. Check the demo component (`PumpCardDemo.tsx`) for examples
2. Verify prop types match the new interface
3. Ensure all required actions are provided
4. Test with different pump statuses and configurations

The unified component is designed to be backward-compatible while providing enhanced functionality and better maintainability.
