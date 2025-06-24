# Frontend Immediate Fixes

## 1. Fix Base URL (Critical - 2 minutes)

```typescript
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1'; // Remove /api
```

## 2. Add Error Boundaries for Dashboard (10 minutes)

```typescript
// src/components/dashboard/DashboardErrorBoundary.tsx
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function DashboardErrorBoundary({ children, error }: { children: React.ReactNode, error?: any }) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Dashboard data unavailable. Backend endpoint missing.
          </p>
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
```

## 3. Fix Dashboard Components (15 minutes)

```typescript
// src/components/dashboard/SalesSummaryCard.tsx
import { DashboardErrorBoundary } from './DashboardErrorBoundary';

export function SalesSummaryCard() {
  const { data: summary, isLoading, error } = useSalesSummary('monthly');

  return (
    <DashboardErrorBoundary error={error}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">₹{summary?.totalSales?.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {summary?.transactionCount || 0} transactions • {summary?.totalVolume?.toLocaleString() || 0}L sold
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardErrorBoundary>
  );
}
```

## 4. Fix SuperAdmin API (5 minutes)

```typescript
// src/api/superadmin.ts
export const superAdminApi = {
  getSummary: async (): Promise<SuperAdminSummary> => {
    const response = await apiClient.get('/admin/summary'); // Fix endpoint
    return response.data;
  },
  // ... rest unchanged
};
```

## 5. Add Unauthorized Page (5 minutes)

```typescript
// src/pages/UnauthorizedPage.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardContent className="p-6 text-center">
          <ShieldX className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 6. Update App Routes (2 minutes)

```typescript
// src/App.tsx - Add unauthorized route
<Route path="/unauthorized" element={<UnauthorizedPage />} />
<Route path="/superadmin" element={...}>
  <Route path="analytics" element={<AnalyticsPage />} />
</Route>
```

## 7. Improve Landing Page Logic (3 minutes)

```typescript
// src/contexts/AuthContext.tsx
switch (response.user.role) {
  case 'superadmin':
    navigate('/superadmin/overview');
    break;
  case 'attendant':
    navigate('/dashboard/readings/new');
    break;
  case 'owner':
  case 'manager':
    navigate('/dashboard/summary'); // Better than /dashboard
    break;
  default:
    navigate('/dashboard');
}
```

## 8. Add Dashboard Default Route (1 minute)

```typescript
// src/App.tsx
<Route path="/dashboard" element={...}>
  <Route index element={<Navigate to="/dashboard/summary" replace />} />
  // ... other routes
</Route>
```

## Total Time: ~45 minutes

These fixes will:
1. ✅ Resolve API connection issues
2. ✅ Prevent dashboard crashes when backend endpoints are missing  
3. ✅ Improve user experience with proper error handling
4. ✅ Fix role-based navigation
5. ✅ Add missing routes and pages

After these fixes, the frontend will work even with missing backend endpoints, showing appropriate error messages instead of crashing.
