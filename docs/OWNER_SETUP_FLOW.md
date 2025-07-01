# Owner Setup Flow

This document outlines the proper setup flow for owners in the FuelSync Hub system.

## Setup Sequence

Owners must follow this sequence to properly set up their fuel station management system:

1. **Create Station** - First, create at least one station
2. **Create Pumps** - Add pumps to your station(s)
3. **Create Nozzles** - Configure nozzles for each pump
4. **Set Fuel Prices** - Set prices for each fuel type

## API Endpoints for Setup

### Station Creation
```
POST /api/v1/stations
{
  "name": "Station Name",
  "address": "Station Address",
  "status": "active"
}
```

### Pump Creation
```
POST /api/v1/pumps
{
  "label": "Pump Label",
  "serialNumber": "Serial Number",
  "stationId": "station-id",
  "status": "active"
}
```

### Nozzle Creation
```
POST /api/v1/nozzles
{
  "pumpId": "pump-id",
  "nozzleNumber": 1,
  "fuelType": "petrol",
  "status": "active"
}
```

### Fuel Price Setting
```
POST /api/v1/fuel-prices
{
  "stationId": "station-id",
  "fuelType": "petrol",
  "price": 100.50,
  "validFrom": "2023-01-01T00:00:00Z"
}
```

## Common Issues

- **Unable to Create Pumps**: Ensure you have created at least one station first
- **Unable to Create Nozzles**: Ensure you have created at least one pump first
- **Unable to Set Fuel Prices**: Ensure you have created at least one nozzle first

## Role Permissions

The owner role has full permissions to:
- Create, update, and delete stations
- Create, update, and delete pumps
- Create, update, and delete nozzles
- Set and update fuel prices
- Manage users (managers and attendants)
- View all reports and analytics

## Setup Wizard

The setup wizard guides owners through this process step by step. Each step is unlocked only when the previous step is completed.