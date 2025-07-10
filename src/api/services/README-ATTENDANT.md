# Attendant API Endpoints

This document outlines the correct API endpoints for the attendant role in FuelSync.

## Endpoints

| Endpoint                                 | Method | Purpose                                     | Implementation Status |
| ---------------------------------------- | ------ | ------------------------------------------- | -------------------- |
| `/fuel-inventory`                        | `GET`  | List fuel inventory                         | ✅ Implemented |
| `/fuel-inventory/summary`                | `GET`  | Inventory totals                            | ✅ Implemented |
| `/attendant/stations`                    | `GET`  | Assigned stations                           | ✅ Implemented |
| `/attendant/pumps?stationId=`            | `GET`  | Pumps in a station                          | ✅ Implemented |
| `/attendant/nozzles?pumpId=`             | `GET`  | Nozzles on a pump                           | ✅ Implemented |
| `/attendant/creditors`                   | `GET`  | List creditors                              | ✅ Implemented |
| `/attendant/cash-report`                 | `POST` | Submit daily cash totals and credit entries | ✅ Implemented |
| `/attendant/cash-reports`                | `GET`  | List submitted cash reports                 | ✅ Implemented |
| `/attendant/alerts`                      | `GET`  | View alerts                                 | ✅ Implemented |
| `/attendant/alerts/{id}/acknowledge`     | `PUT`  | Mark alert as read                          | ✅ Implemented |
| `/nozzle-readings`                       | `POST` | Record a nozzle reading (generates sales)   | ✅ Implemented |
| `/nozzle-readings/can-create/{nozzleId}` | `GET`  | Check if a reading can be recorded          | ✅ Implemented |

## Implementation Details

### Services

- `attendantService.ts` - Contains methods for attendant-specific endpoints
- Direct API calls for nozzle readings in `useAttendantReadings.ts`

### Hooks

- `useAttendant.ts` - Hooks for attendant operations
- `useAttendantReadings.ts` - Hooks for nozzle readings

## Troubleshooting

If you encounter "Forbidden" errors:

1. Check that the user has the "attendant" role
2. Verify the JWT token includes the correct permissions
3. Ensure the backend routes include the attendant role in the `requireRole` middleware
4. Check that the attendant is assigned to the station they're trying to access