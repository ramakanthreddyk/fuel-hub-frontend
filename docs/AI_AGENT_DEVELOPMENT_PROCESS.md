# AI Agent Development Process

This document outlines the specific process that AI agents should follow when working on the FuelSync frontend codebase. It ensures that AI agents maintain the same standards as human developers and produce maintainable, well-documented code.

## Process Overview

1. **Understand the Request**
2. **Consult Documentation**
3. **Analyze Existing Code**
4. **Plan the Implementation**
5. **Implement Changes**
6. **Test Changes**
7. **Document Changes**
8. **Provide Implementation Summary**

## Detailed Process

### 1. Understanding the Request

- Identify the type of request (feature, bug fix, refactoring)
- Determine which user journey it belongs to
- Identify the components and services affected
- Clarify any ambiguities with follow-up questions

Example:
```
This appears to be a feature request to add sorting functionality to the fuel prices table.
This belongs to the Manager journey and affects the FuelPricesPage component and related services.
```

### 2. Consulting Documentation

- Start with docs/README.md
- Check docs/DOCUMENTATION_MAP.md
- Review the appropriate user journey document
- Read the API Integration Guide

Example:
```
I've reviewed the following documentation:
- docs/journeys/MANAGER.md for the Manager journey
- docs/API_INTEGRATION_GUIDE.md for implementation patterns
- docs/DOCUMENTATION_MAP.md to find related code files
```

### 3. Analyzing Existing Code

- Examine related services and hooks
- Review component implementations
- Understand data flow and state management

Example:
```
I've analyzed:
- src/api/services/fuelPricesService.ts
- src/hooks/api/useFuelPrices.ts
- src/components/fuel-prices/FuelPriceTable.tsx
```

### 4. Planning the Implementation

- Create a minimal implementation plan
- Identify files to modify
- Plan for backward compatibility

Example:
```
Implementation Plan:
1. Add sorting state to FuelPriceTable component
2. Implement sort functions for different columns
3. Update the table UI to show sort indicators
4. Ensure backward compatibility with existing features
```

### 5. Implementing Changes

- Follow standardized patterns
- Use existing services and hooks
- Add proper error handling
- Include JSDoc comments

### 6. Testing Changes

- Verify functionality works as expected
- Test error scenarios
- Check for regressions

### 7. Documenting Changes

- Update relevant documentation
- Add JSDoc comments
- Update DOCUMENTATION_MAP.md if needed
- Add entry to FRONTEND_CHANGELOG.md

### 8. Providing Implementation Summary

- Summarize what was changed and why
- Explain how it was implemented
- Note any potential impact on other features
- Document any known limitations

Example:
```
Implementation Summary:
- Added sorting functionality to the FuelPriceTable component
- Implemented sort functions for price, date, and station columns
- Updated the UI to show sort indicators
- Maintained backward compatibility with existing filtering
- Known limitation: Sorting resets when filters are applied
```

## Accountability Requirements

AI agents must:

1. **Follow the Development Accountability Checklist**
2. **Provide clear reasoning for implementation decisions**
3. **Document all changes thoroughly**
4. **Highlight any deviations from standard patterns**
5. **Suggest improvements to documentation when gaps are found**

## Example Workflow

Here's an example of how an AI agent should approach a task:

```
Task: Add sorting functionality to the fuel prices table

1. Understanding:
   This is a feature request for the Manager journey affecting the FuelPricesTable component.

2. Documentation:
   I've reviewed the Manager journey and API Integration Guide.

3. Analysis:
   The FuelPriceTable component currently displays prices without sorting.
   It uses the useFuelPrices hook to fetch data.

4. Plan:
   - Add sorting state to the component
   - Implement sort functions
   - Update UI with sort indicators
   - Ensure backward compatibility

5. Implementation:
   [Code implementation details]

6. Testing:
   - Verified sorting works for all columns
   - Tested with empty data
   - Checked mobile view

7. Documentation:
   - Added JSDoc comments
   - Updated FRONTEND_CHANGELOG.md

8. Summary:
   [Implementation summary]
```

## Last Updated

**Date**: Documentation Consolidation
**Updated By**: Development Team
**Next Review**: Quarterly