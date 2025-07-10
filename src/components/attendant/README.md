# Attendant Components

This directory contains components specific to the attendant role in FuelSync.

## Overview

Attendants need access to:

1. View their assigned stations
2. View pumps and nozzles for those stations
3. Record meter readings
4. Submit cash reports
5. View and acknowledge alerts

## Implementation

The attendant functionality is implemented using:

1. **API Services**: `attendantService.ts` provides methods to interact with the attendant-specific API endpoints
2. **React Hooks**: `useAttendant.ts` and `useAttendantReadings.ts` provide React Query hooks for data fetching and mutations
3. **UI Components**: `AttendantDashboard.tsx` provides the main interface for attendants

## Permissions

Attendants have limited permissions:
- They can only view stations they are assigned to
- They can only create readings, not edit or delete them
- They can submit cash reports but cannot approve them
- They can view and acknowledge alerts but cannot create or delete them

## Troubleshooting

If attendants are getting "Forbidden" errors:
1. Check that the user has the "attendant" role in the database
2. Verify they are assigned to at least one station
3. Ensure the JWT token includes the correct role and permissions
4. Check that the API routes include the attendant role in the `requireRole` middleware