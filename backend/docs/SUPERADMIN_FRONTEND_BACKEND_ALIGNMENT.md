# SuperAdmin Frontend-Backend Alignment

## ✅ Backend Endpoints

### 1. Dashboard Metrics
```
GET /api/v1/admin/dashboard
```
**Response:**
```json
{
  "tenantCount": 3,
  "activeTenantCount": 2,
  "planCount": 3,
  "adminCount": 3
}
```

### 2. Tenant Management
```
POST /api/v1/admin/tenants
GET /api/v1/admin/tenants
GET /api/v1/admin/tenants/:id
PUT /api/v1/admin/tenants/:id/status
DELETE /api/v1/admin/tenants/:id
```

### 3. Plan Management
```
POST /api/v1/admin/plans
GET /api/v1/admin/plans
GET /api/v1/admin/plans/:id
PUT /api/v1/admin/plans/:id
DELETE /api/v1/admin/plans/:id
```

### 4. Admin User Management
```
POST /api/v1/admin/users
GET /api/v1/admin/users
GET /api/v1/admin/users/:id
PUT /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
POST /api/v1/admin/users/:id/reset-password
```

## 📋 Frontend Requirements

### 1. API Client
```typescript
// src/api/admin.ts
export const adminApi = {
  // Dashboard
  getDashboardMetrics: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
  
  // Tenant Management
  createTenant: async (data: { name: string; planId: string }) => {
    const response = await apiClient.post('/admin/tenants', data);
    return response.data;
  },
  
  // ... other methods
};
```

### 2. React Query Hooks
```typescript
// src/hooks/useAdmin.ts
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboardMetrics
  });
}

export function useTenants() {
  return useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: adminApi.listTenants
  });
}

// ... other hooks
```

### 3. Pages
- Dashboard Page
- Tenants Page
- Plans Page
- Admin Users Page

### 4. Components
- TenantForm
- PlanForm
- AdminUserForm
- StatusBadge
- MetricsCard

## 🔄 Data Models Alignment

### Tenant
```typescript
// Backend
export interface TenantOutput {
  id: string;
  name: string;
  planId: string;
  planName?: string;
  status: string;
  createdAt: Date;
}

// Frontend
interface Tenant {
  id: string;
  name: string;
  planId: string;
  planName: string;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: string;
}
```

### Plan
```typescript
// Backend
export interface PlanOutput {
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  features: string[];
  createdAt: Date;
}

// Frontend
interface Plan {
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  features: string[];
  createdAt: string;
}
```

### Admin User
```typescript
// Backend
export interface AdminUserOutput {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Frontend
interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}
```

## 🔍 Alignment Check

### 1. Tenant Management
- ✅ Backend provides all required endpoints
- ✅ Data models are aligned
- ✅ Frontend components match backend requirements

### 2. Plan Management
- ✅ Backend provides all required endpoints
- ✅ Data models are aligned
- ✅ Frontend components match backend requirements

### 3. Admin User Management
- ✅ Backend provides all required endpoints
- ✅ Data models are aligned
- ✅ Frontend components match backend requirements

### 4. Dashboard Metrics
- ✅ Backend provides required metrics
- ✅ Frontend components display metrics correctly

## 🚀 Implementation Steps

1. **Backend (Completed)**
   - ✅ Tenant service with schema creation
   - ✅ Plan service
   - ✅ Admin user service
   - ✅ Admin controller
   - ✅ Admin API router

2. **Frontend**
   - ⬜ Create API client for admin endpoints
   - ⬜ Create React Query hooks
   - ⬜ Implement UI components
   - ⬜ Create pages for SuperAdmin
   - ⬜ Add navigation for SuperAdmin role

## 🧪 Testing

### Backend Testing
```bash
# Create plan
curl -X POST http://localhost:3003/api/v1/admin/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Premium Plan", "maxStations": 20, "priceMonthly": 199.99, "features": ["Advanced Analytics", "API Access"]}'

# Create tenant
curl -X POST http://localhost:3003/api/v1/admin/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test Tenant", "planId": "PLAN_ID"}'
```

### Frontend Testing
1. Login as SuperAdmin
2. Navigate to Tenants page
3. Create a new tenant
4. Verify tenant schema is created
5. Verify tenant appears in list