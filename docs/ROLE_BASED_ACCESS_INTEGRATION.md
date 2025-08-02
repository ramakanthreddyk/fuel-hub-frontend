# Role-Based Access Control Integration Guide

This guide explains how to implement and use the comprehensive role-based access control system in the FuelSync Hub frontend.

## Overview

The role-based access control system provides:
- **Plan-based feature restrictions** (Starter, Pro, Enterprise)
- **Role-based permissions** (SuperAdmin, Owner, Manager, Attendant)
- **Action-level controls** (view, create, edit, delete, etc.)
- **Automatic upgrade prompts** for restricted features
- **Type-safe permission checking**

## Quick Start

### 1. Basic Permission Checking

```tsx
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

function MyComponent() {
  const { canView, canCreate, canEdit, canDelete } = useRoleBasedAccess();

  return (
    <div>
      {canView('stations') && <StationsList />}
      {canCreate('stations') && <CreateStationButton />}
      {canEdit('users') && <EditUserButton />}
      {canDelete('stations') && <DeleteStationButton />}
    </div>
  );
}
```

### 2. Conditional Rendering with Gates

```tsx
import { ViewGate, CreateGate, EditGate, DeleteGate } from '@/components/auth/PermissionGate';

function StationsPage() {
  return (
    <div>
      <ViewGate feature="stations">
        <StationsList />
      </ViewGate>

      <CreateGate 
        feature="stations"
        showUpgradePrompt={true}
      >
        <CreateStationButton />
      </CreateGate>

      <EditGate feature="stations">
        <EditStationForm />
      </EditGate>

      <DeleteGate 
        feature="stations"
        fallback={<div>Delete not available in your plan</div>}
      >
        <DeleteStationButton />
      </DeleteGate>
    </div>
  );
}
```

### 3. Role-Based Navigation

```tsx
import { RoleGate } from '@/components/auth/PermissionGate';

function Navigation() {
  return (
    <nav>
      <RoleGate allowedRoles={['owner', 'manager', 'superadmin']}>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </RoleGate>

      <RoleGate allowedRoles={['attendant']}>
        <NavLink to="/attendant/dashboard">My Dashboard</NavLink>
      </RoleGate>

      <RoleGate allowedRoles={['superadmin']}>
        <NavLink to="/superadmin">Admin Panel</NavLink>
      </RoleGate>
    </nav>
  );
}
```

### 4. Plan-Based Feature Gates

```tsx
import { PlanGate } from '@/components/auth/PermissionGate';

function AdvancedFeatures() {
  return (
    <div>
      <PlanGate 
        requiredPlan="pro"
        showUpgradePrompt={true}
      >
        <ReportsSection />
      </PlanGate>

      <PlanGate 
        requiredPlan="enterprise"
        showUpgradePrompt={true}
      >
        <AdvancedAnalytics />
      </PlanGate>
    </div>
  );
}
```

## Permission Matrix

### Features Available by Plan

| Feature | Starter | Pro | Enterprise |
|---------|---------|-----|------------|
| Dashboard | ✅ | ✅ | ✅ |
| Stations | ✅ | ✅ | ✅ |
| Pumps/Nozzles | ✅ | ✅ | ✅ |
| Readings | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ |
| Cash Reports | ✅ | ✅ | ✅ |
| Reconciliation | ✅ | ✅ | ✅ |
| Users | ✅ | ✅ | ✅ |
| Fuel Prices | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ |
| **Creditors** | ❌ | ✅ | ✅ |
| **Reports** | ❌ | ✅ | ✅ |
| **Analytics** | ❌ | ✅ (Basic) | ✅ (Advanced) |
| Settings | ✅ | ✅ | ✅ |

### Actions Available by Role

| Action | SuperAdmin | Owner | Manager | Attendant |
|--------|------------|-------|---------|-----------|
| **View** | All | Most | Most | Limited |
| **Create** | All | Most | Limited | Very Limited |
| **Edit** | All | Most | Limited | Very Limited |
| **Delete** | All | Plan-dependent | No | No |
| **View All Data** | Yes | Yes | Yes | Own data only |

## Advanced Usage

### 1. Multiple Permission Checks

```tsx
import { useMultiplePermissions } from '@/components/auth/PermissionGate';

function ComplexComponent() {
  const permissions = useMultiplePermissions([
    { feature: 'stations', action: 'create' },
    { feature: 'users', action: 'edit' },
    { feature: 'reports', action: 'generate' }
  ]);

  const canCreateStations = permissions[0].hasAccess;
  const canEditUsers = permissions[1].hasAccess;
  const canGenerateReports = permissions[2].hasAccess;

  return (
    <div>
      {canCreateStations && <CreateStationButton />}
      {canEditUsers && <UserManagement />}
      {canGenerateReports && <ReportGenerator />}
    </div>
  );
}
```

### 2. Combined Permission and Role Gates

```tsx
import { PermissionRoleGate } from '@/components/auth/PermissionGate';

function AdminSection() {
  return (
    <PermissionRoleGate
      feature="users"
      action="delete"
      allowedRoles={['owner', 'superadmin']}
      showUpgradePrompt={true}
    >
      <DeleteUserButton />
    </PermissionRoleGate>
  );
}
```

### 3. Custom Permission Logic

```tsx
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

function CustomPermissionComponent() {
  const { hasAccess, planTier, role, getUpgradeMessage } = useRoleBasedAccess();

  const canAccessAdvancedFeature = () => {
    // Custom logic combining multiple permissions
    return hasAccess('analytics', 'view') && 
           hasAccess('reports', 'generate') &&
           (role === 'owner' || role === 'superadmin');
  };

  if (!canAccessAdvancedFeature()) {
    const upgradeMsg = getUpgradeMessage('analytics');
    return <div>Access denied: {upgradeMsg}</div>;
  }

  return <AdvancedFeatureComponent />;
}
```

### 4. Permission Summary Display

```tsx
import { PermissionSummary } from '@/components/auth/PermissionGate';

function UserProfile() {
  return (
    <div>
      <h2>User Profile</h2>
      <PermissionSummary />
      {/* Other profile content */}
    </div>
  );
}
```

## Integration with Existing Components

### 1. Update Navigation Components

```tsx
// Before
<NavLink to="/reports">Reports</NavLink>

// After
<ViewGate feature="reports">
  <NavLink to="/reports">Reports</NavLink>
</ViewGate>
```

### 2. Update Action Buttons

```tsx
// Before
<Button onClick={handleDelete}>Delete</Button>

// After
<DeleteGate feature="stations">
  <Button onClick={handleDelete}>Delete</Button>
</DeleteGate>
```

### 3. Update Page Components

```tsx
// Before
function ReportsPage() {
  return <ReportsContent />;
}

// After
function ReportsPage() {
  return (
    <ViewGate 
      feature="reports"
      showUpgradePrompt={true}
      fallback={<AccessDeniedPage />}
    >
      <ReportsContent />
    </ViewGate>
  );
}
```

## Testing

### 1. Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Mock the auth context for testing
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'owner', planName: 'Premium' }
  })
}));

test('should show create button for owner', () => {
  render(
    <CreateGate feature="stations">
      <button>Create Station</button>
    </CreateGate>
  );
  
  expect(screen.getByText('Create Station')).toBeInTheDocument();
});
```

### 2. Integration Tests

```tsx
test('complete user journey for attendant role', () => {
  // Mock attendant user
  mockUser({ role: 'attendant', planName: 'Regular' });
  
  render(<App />);
  
  // Should see attendant dashboard
  expect(screen.getByText('Attendant Dashboard')).toBeInTheDocument();
  
  // Should not see admin features
  expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  expect(screen.queryByText('Reports')).not.toBeInTheDocument();
});
```

## Best Practices

1. **Always use permission gates** for sensitive UI elements
2. **Show upgrade prompts** for plan-restricted features
3. **Provide meaningful fallbacks** for denied access
4. **Test all role and plan combinations**
5. **Keep permission logic in sync** with backend
6. **Use TypeScript** for type safety
7. **Cache permission results** when possible
8. **Log permission violations** for debugging

## Troubleshooting

### Common Issues

1. **Permission not working**: Check if user object has correct `planName` field
2. **Upgrade prompts not showing**: Ensure `showUpgradePrompt={true}` is set
3. **TypeScript errors**: Import types from the hook file
4. **Tests failing**: Mock the auth context properly

### Debug Tools

```tsx
// Add this to any component for debugging
const { permissions } = useRoleBasedAccess();
console.log('Current permissions:', permissions);
```

## Migration Guide

To migrate existing components to use role-based access:

1. **Identify permission-sensitive components**
2. **Wrap with appropriate gates**
3. **Add upgrade prompts for plan features**
4. **Update tests to mock auth context**
5. **Test all user roles and plans**

This system provides a robust, type-safe way to implement role-based access control that scales with your application's needs.
