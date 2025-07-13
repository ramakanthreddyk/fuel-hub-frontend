# API Contract Synchronization Implementation Plan

This document outlines the step-by-step plan to synchronize the frontend API contract with the backend OpenAPI specification.

## Phase 1: Core Infrastructure Updates

### Step 1: Add API Transformation Utilities
- Implement `src/utils/apiTransform.ts` with utilities for normalizing property names
- Add functions for handling both camelCase and snake_case properties

### Step 2: Enhance API Client
- Replace `src/api/core/apiClient.ts` with `src/api/core/apiClient.enhanced.ts`
- Add response interceptors for automatic data normalization
- Improve error handling and data extraction

## Phase 2: API Contract Updates

### Step 1: Update Core Types
- Add standardized `PaymentMethod` type
- Update all interfaces to use this type for consistency

### Step 2: Add Missing Interfaces
- Copy interfaces from `src/api/api-contract-updates.ts` to `src/api/api-contract.ts`
- Ensure all interfaces match the backend OpenAPI specification

### Step 3: Update Existing Interfaces
- Update `Nozzle` interface to include `lastReading` field
- Update `NozzleReading` interface to include all fields from backend
- Fix inconsistencies in other interfaces

## Phase 3: Service Updates

### Step 1: Update Nozzle Service
- Enhance `getNozzles` method to handle property name variations
- Add property normalization for consistent access

### Step 2: Update Readings Service
- Enhance `getLatestReading` method to handle property name variations
- Update payment method types to match backend

### Step 3: Update Other Services
- Apply similar enhancements to other services
- Add error handling for edge cases

## Phase 4: Component Updates

### Step 1: Update FuelNozzleCard
- Improve `LastReadingDisplay` component to handle edge cases
- Add proper number formatting

### Step 2: Update Other Components
- Apply similar improvements to other components
- Ensure all components handle null/undefined values gracefully

## Phase 5: Backend Updates

### Step 1: Update Nozzle Service
- Replace `src/services/nozzle.service.ts` with `src/services/nozzle.service.patch.ts`
- Add SQL query to fetch latest reading for each nozzle

### Step 2: Restart Backend
- Restart the backend server to apply changes

## Phase 6: Testing and Verification

### Step 1: Test API Endpoints
- Test each endpoint to ensure it works correctly
- Verify that data is properly transformed

### Step 2: Test Components
- Verify that components display data correctly
- Check for any console errors

## Phase 7: Documentation

### Step 1: Update API Documentation
- Document the changes made to the API contract
- Provide examples of how to use the new interfaces

### Step 2: Create Maintenance Guide
- Create a guide for keeping the API contract in sync
- Document best practices for handling API changes

## Timeline

- Phase 1: 1 day
- Phase 2: 2 days
- Phase 3: 2 days
- Phase 4: 1 day
- Phase 5: 1 day
- Phase 6: 2 days
- Phase 7: 1 day

Total: 10 days