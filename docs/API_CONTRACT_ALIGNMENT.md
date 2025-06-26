
# API Contract Alignment Documentation

This document tracks the alignment between the frontend API client and the backend OpenAPI specification.

## ✅ Completed Alignments

### 1. Standardized Response Handling
- ✅ Implemented global response interceptor for snake_case to camelCase conversion
- ✅ Standardized data extraction using `extractApiData()` and `extractApiArray()` helpers
- ✅ All responses now follow consistent pattern: `response.data.data` or `response.data`

### 2. Updated API Clients
- ✅ **Stations API** - Aligned with OpenAPI spec
- ✅ **Pumps API** - Aligned with OpenAPI spec  
- ✅ **Nozzles API** - Aligned with OpenAPI spec
- ✅ **Readings API** - Aligned with OpenAPI spec
- ✅ **Auth API** - Aligned with OpenAPI spec
- ✅ **Creditors API** - Aligned with OpenAPI spec

### 3. Type Safety
- ✅ Created comprehensive `api-contract.ts` with TypeScript interfaces
- ✅ All API methods now use typed interfaces from the contract
- ✅ Backward compatibility maintained with type exports

## 🔄 In Progress / Pending

### API Clients to Update
- 🔄 **Sales API** - Needs alignment
- 🔄 **Fuel Prices API** - Needs alignment  
- 🔄 **Fuel Deliveries API** - Needs alignment
- 🔄 **Fuel Inventory API** - Needs alignment
- 🔄 **Users API** - Needs alignment
- 🔄 **Tenants API** - Needs alignment
- 🔄 **Dashboard API** - Needs alignment
- 🔄 **Reports API** - Needs alignment
- 🔄 **Analytics API** - Needs alignment
- 🔄 **Alerts API** - Needs alignment
- 🔄 **Reconciliation API** - Needs alignment
- 🔄 **SuperAdmin API** - Needs alignment

## ❌ Contract Drift Issues Found

### Response Format Inconsistencies
1. **Mixed Response Wrappers**: Some endpoints return data directly, others wrap in `{ data: ... }`
   - **Impact**: Frontend needs to handle both formats
   - **Status**: Handled with standardized extractors
   - **Recommendation**: Backend should standardize on one format

2. **Array Response Variations**: Arrays returned as:
   - Direct arrays: `[...]` 
   - Wrapped: `{ data: [...] }`
   - Named keys: `{ users: [...], stations: [...] }`
   - **Status**: Handled with `extractApiArray()` helper

### Parameter Alignment Issues
1. **Query Parameter Names**: Some inconsistencies between frontend expectations and backend
   - Example: `stationId` vs `station_id` in some endpoints
   - **Status**: Needs verification against OpenAPI spec

2. **Optional vs Required Fields**: Some fields marked as optional in frontend but required in backend
   - **Status**: Needs verification against OpenAPI spec

## 🚨 Missing Backend Endpoints

Based on frontend usage, these endpoints may be missing from backend:

1. **Bulk Operations**
   - `POST /api/v1/nozzles/bulk` - Bulk create nozzles
   - `PUT /api/v1/fuel-prices/bulk` - Bulk update fuel prices

2. **Advanced Filtering**
   - Enhanced query parameters for complex filtering
   - Date range filtering on more endpoints

3. **Aggregation Endpoints**
   - `GET /api/v1/dashboard/metrics` - Consolidated dashboard metrics
   - `GET /api/v1/analytics/summary` - Analytics summary

## 🎯 Next Steps

### Immediate Actions
1. ✅ Complete alignment of remaining API clients
2. ✅ Add comprehensive error handling using OpenAPI error schemas
3. ✅ Implement request validation using API contract types

### Future Improvements
1. **Auto-Generation**: Implement `openapi-typescript-codegen` for automatic type generation
2. **CI Integration**: Add pipeline step to detect contract drift
3. **Documentation**: Keep this document updated with each API change

### Recommended Backend Changes
1. **Standardize Response Format**: Choose one consistent response wrapper format
2. **OpenAPI Updates**: Ensure all endpoints are documented in OpenAPI spec
3. **Error Schema**: Implement consistent error response format across all endpoints

## 📋 Testing Checklist

### For Each Endpoint
- [ ] Request parameters match OpenAPI spec exactly
- [ ] Response format handled correctly by extractors
- [ ] Error responses follow standard error schema
- [ ] TypeScript types align with actual API behavior
- [ ] No manual snake_case conversion needed

## 🔧 Development Workflow

### When Adding New Endpoints
1. Update `api-contract.ts` with new types
2. Add endpoint to appropriate API client file
3. Use standardized extractors (`extractApiData`/`extractApiArray`)
4. Update this documentation
5. Test with backend to ensure alignment

### When Backend API Changes
1. Update OpenAPI spec first
2. Regenerate types if using codegen
3. Update API client implementation
4. Update documentation
5. Test thoroughly

---

**Last Updated**: Current Date
**Status**: ✅ Phase 1 Complete - Core APIs Aligned
**Next Review**: After remaining API clients are updated
