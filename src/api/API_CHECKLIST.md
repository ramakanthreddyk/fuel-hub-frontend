
# API Endpoints Checklist - Aligned with OpenAPI Spec

## ✅ FIXED ENDPOINTS

### Authentication
- ✅ POST `/auth/login` - Login regular user
- ✅ POST `/admin/auth/login` - Login SuperAdmin user  
- ✅ POST `/auth/logout` - Logout user
- ✅ POST `/auth/refresh` - Refresh token

### Stations (Tenant-scoped)
- ✅ GET `/stations` - Get all stations
- ✅ GET `/stations?includeMetrics=true` - Get stations with metrics
- ✅ POST `/stations` - Create new station
- ✅ GET `/stations/{id}` - Get station by ID
- ✅ PUT `/stations/{id}` - Update station
- ✅ DELETE `/stations/{id}` - Delete station

### SuperAdmin Routes
- ✅ GET `/admin/dashboard` - Get admin dashboard summary
- ✅ GET `/admin/tenants` - Get all tenants
- ✅ GET `/admin/tenants/{id}` - Get tenant details
- ✅ POST `/admin/tenants` - Create tenant
- ✅ PATCH `/admin/tenants/{id}/status` - Update tenant status
- ✅ DELETE `/admin/tenants/{id}` - Delete tenant
- ✅ GET `/admin/plans` - Get all plans
- ✅ POST `/admin/plans` - Create plan
- ✅ PUT `/admin/plans/{id}` - Update plan
- ✅ DELETE `/admin/plans/{id}` - Delete plan
- ✅ GET `/admin/users` - Get admin users
- ✅ POST `/admin/users` - Create admin user
- ✅ PUT `/admin/users/{id}` - Update admin user
- ✅ DELETE `/admin/users/{id}` - Delete admin user
- ✅ POST `/admin/users/{id}/reset-password` - Reset admin password

### Fuel Prices
- ✅ GET `/fuel-prices` - Get all fuel prices
- ✅ POST `/fuel-prices` - Create fuel price
- ✅ PUT `/fuel-prices/{id}` - Update fuel price (using generic object)

## 🔧 RECENT FIXES

### Admin Login Route Detection:
- ✅ Added `/login/admin` route for explicit SuperAdmin login
- ✅ Updated LoginPage to detect admin route via URL path
- ✅ Removed unreliable email-based admin detection
- ✅ Added route switching functionality in login UI

### SuperAdmin User Management:
- ✅ Fixed UsersPage to use `/admin/users` endpoint
- ✅ Added missing CRUD operations for admin users
- ✅ Updated API client to use correct SuperAdmin routes
- ✅ Added proper error handling and user feedback

### Authentication Flow:
- ✅ Added `forceAdminRoute` parameter to login function
- ✅ Improved admin/regular user route detection
- ✅ Enhanced login UI to show current login mode
- ✅ Fixed tenant header logic for admin routes

## 🔍 ENDPOINTS TO VERIFY

### Pumps
- 🔍 GET `/pumps` - Get all pumps
- 🔍 GET `/pumps?stationId={id}` - Get pumps by station
- 🔍 POST `/pumps` - Create pump
- 🔍 GET `/pumps/{id}` - Get pump details
- 🔍 PUT `/pumps/{id}` - Update pump
- 🔍 DELETE `/pumps/{id}` - Delete pump

### Nozzles
- 🔍 GET `/nozzles` - Get all nozzles
- 🔍 GET `/nozzles?pumpId={id}` - Get nozzles by pump
- 🔍 POST `/nozzles` - Create nozzle
- 🔍 PUT `/nozzles/{id}` - Update nozzle
- 🔍 DELETE `/nozzles/{id}` - Delete nozzle

### Readings
- 🔍 GET `/readings` - Get all readings
- 🔍 POST `/readings` - Create reading
- 🔍 GET `/readings/{id}` - Get reading details
- 🔍 PUT `/readings/{id}` - Update reading
- 🔍 DELETE `/readings/{id}` - Delete reading

### Sales
- 🔍 GET `/sales` - Get all sales
- 🔍 GET `/sales?stationId={id}` - Filter by station
- 🔍 GET `/sales?startDate={date}&endDate={date}` - Filter by date range

### Dashboard
- 🔍 GET `/dashboard/sales-summary` - Sales summary
- 🔍 GET `/dashboard/payment-methods` - Payment breakdown
- 🔍 GET `/dashboard/fuel-breakdown` - Fuel type breakdown
- 🔍 GET `/dashboard/top-creditors` - Top creditors
- 🔍 GET `/dashboard/sales-trend` - Sales trend data

### Users (Tenant-scoped)
- 🔍 GET `/users` - Get tenant users
- 🔍 POST `/users` - Create tenant user
- 🔍 GET `/users/{id}` - Get user details
- 🔍 PUT `/users/{id}` - Update user
- 🔍 DELETE `/users/{id}` - Delete user
- 🔍 POST `/users/{id}/change-password` - Change password
- 🔍 POST `/users/{id}/reset-password` - Reset password

### Creditors
- 🔍 GET `/creditors` - Get all creditors
- 🔍 POST `/creditors` - Create creditor
- 🔍 GET `/creditors/{id}` - Get creditor details
- 🔍 PUT `/creditors/{id}` - Update creditor
- 🔍 DELETE `/creditors/{id}` - Delete creditor
- 🔍 GET `/creditors/{id}/payments` - Get payments
- 🔍 POST `/creditors/{id}/payments` - Create payment

## 📋 IMPLEMENTATION NOTES

### Login Flow Architecture:
1. **Route Detection**: `/login` = regular, `/login/admin` = admin
2. **API Selection**: Admin route uses `/admin/auth/login` exclusively
3. **Fallback Logic**: Regular route tries admin first, then user
4. **UI Indicators**: Clear visual feedback for login type
5. **Navigation**: Role-based redirect after successful login

### SuperAdmin Context:
- **No Tenant Headers**: Admin routes never include `x-tenant-id`
- **Separate Endpoints**: All admin operations use `/admin/*` routes
- **User Management**: Uses `/admin/users` for admin user CRUD
- **Data Isolation**: SuperAdmin can access cross-tenant data

### Security Considerations:
- **Route-based Auth**: Login type determined by URL, not email pattern
- **Token Validation**: JWT payload indicates user type and permissions
- **Header Logic**: Conditional tenant headers based on route type
- **Error Handling**: Graceful fallback and clear error messages

## NEXT STEPS
1. ✅ Test admin login via `/login/admin` route
2. ✅ Verify SuperAdmin user management functionality  
3. ✅ Test station creation and management
4. 🔍 Verify remaining dashboard and operational endpoints

---
**Last Updated**: Fixed admin login detection and SuperAdmin user management APIs
