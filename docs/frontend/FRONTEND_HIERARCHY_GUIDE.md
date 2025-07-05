---
title: Frontend Hierarchy Components Guide
lastUpdated: 2025-07-05
category: frontend
---

# Frontend Hierarchy Components Guide

## Overview
Complete guide for hierarchical organization visualization components in FuelSync Hub frontend.

## Component Architecture

### 1. TenantHierarchy Component
**Purpose**: SuperAdmin view of complete tenant organizational structure
**Location**: `src/components/admin/TenantHierarchy.tsx`

#### Features:
- **Complete Structure**: Tenant → Users → Stations → Pumps → Nozzles
- **User Management**: Role-based icons and information
- **Collapsible Tree**: Expandable station and pump sections
- **Status Indicators**: Color-coded badges for all entities
- **Metrics Overview**: Performance statistics

#### Usage:
```tsx
import { TenantHierarchy } from '@/components/admin/TenantHierarchy';

<TenantHierarchy tenant={tenantWithHierarchy} />
```

#### Props:
```typescript
interface TenantHierarchyProps {
  tenant: Tenant; // Complete tenant object with users and stations
}
```

### 2. OrganizationHierarchy Component
**Purpose**: Owner/Manager view of their own organization
**Location**: `src/components/dashboard/OrganizationHierarchy.tsx`

#### Features:
- **Station Focus**: Emphasizes station performance
- **Live Metrics**: Real-time sales, volume, transactions
- **Quick Actions**: Navigation to management pages
- **Role-Appropriate**: Shows data based on user permissions

#### Usage:
```tsx
import { OrganizationHierarchy } from '@/components/dashboard/OrganizationHierarchy';

<OrganizationHierarchy />
```

## Data Structure

### Hierarchical Interfaces:
```typescript
interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'cancelled';
  users?: User[];
  stations?: Station[];
  userCount?: number;
  stationCount?: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'attendant';
  createdAt: string;
}

interface Station {
  id: string;
  name: string;
  address?: string;
  status: string;
  pumpCount: number;
  pumps?: Pump[];
}

interface Pump {
  id: string;
  label: string;
  serialNumber?: string;
  status: string;
  nozzleCount: number;
  nozzles?: Nozzle[];
}

interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  status: string;
}
```

## API Integration

### Tenant Details Hook:
```typescript
import { useTenantDetails } from '@/hooks/useTenantDetails';

const { data: tenant, isLoading, error } = useTenantDetails(tenantId);
```

### API Methods:
```typescript
// Get tenant with complete hierarchy
const tenant = await tenantsApi.getTenantDetails(tenantId);

// Returns full structure with users, stations, pumps, nozzles
```

## Visual Design

### Role Icons:
- **Owner**: 👑 Crown (yellow)
- **Manager**: 🛡️ Shield (blue)
- **Attendant**: 🔧 Wrench (green)

### Status Colors:
- **Active**: Green background
- **Maintenance**: Yellow background
- **Inactive**: Red background

### Tree Structure:
```
📊 Tenant Overview
├── 👥 Users (3)
│   ├── 👑 Owner
│   ├── 🛡️ Manager
│   └── 🔧 Attendant
└── 🏢 Stations (2)
    ├── 🏢 Station 1
    │   ├── ⛽ Pump 1
    │   │   ├── ⚡ Nozzle 1 (Petrol)
    │   │   └── ⚡ Nozzle 2 (Diesel)
    │   └── ⛽ Pump 2
    └── 🏢 Station 2
```

## Navigation Flow

### SuperAdmin Path:
1. **Tenants Page** → View all tenants
2. **Click "View Details"** → Navigate to tenant details
3. **Tenant Details Page** → Complete hierarchy view
4. **Expand/Collapse** → Explore structure

### Owner/Manager Path:
1. **Dashboard** → Organization overview
2. **Organization Card** → Hierarchical view
3. **Station Links** → Navigate to management
4. **Quick Actions** → Add/manage entities

## Responsive Design

### Mobile Adaptations:
- **Collapsible Sections**: Prevent overwhelming small screens
- **Touch-Friendly**: Large tap targets for expand/collapse
- **Simplified Metrics**: Essential data only on mobile
- **Horizontal Scroll**: For wide metric cards

### Breakpoints:
- **Mobile**: Single column, collapsed by default
- **Tablet**: Two columns for metrics
- **Desktop**: Full hierarchy with all details

## Performance Considerations

### Data Loading:
- **Lazy Loading**: Expand sections load pump/nozzle data
- **Caching**: React Query caches hierarchy data
- **Optimistic Updates**: Status changes update immediately

### Rendering:
- **Virtualization**: For tenants with many stations
- **Memoization**: Prevent unnecessary re-renders
- **Skeleton Loading**: Smooth loading experience

## Error Handling

### Error States:
- **Network Errors**: Retry mechanism with error boundary
- **Permission Errors**: Clear messaging for unauthorized access
- **Empty States**: Helpful guidance for setup

### Fallbacks:
- **Partial Data**: Show available information
- **Loading States**: Skeleton components
- **Error Recovery**: Retry buttons and navigation

## Testing Strategy

### Component Tests:
- **Hierarchy Rendering**: Correct tree structure
- **Expand/Collapse**: Interactive functionality
- **Role Filtering**: Appropriate data display
- **Status Updates**: Real-time changes

### Integration Tests:
- **API Integration**: Data fetching and display
- **Navigation**: Routing between components
- **Responsive**: Mobile and desktop layouts

## Future Enhancements

### Planned Features:
- **Drag & Drop**: Reorganize hierarchy
- **Bulk Actions**: Multi-select operations
- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Search and filter options
- **Export Options**: PDF/Excel hierarchy reports

This guide ensures consistent implementation and usage of hierarchical components across the FuelSync Hub frontend.