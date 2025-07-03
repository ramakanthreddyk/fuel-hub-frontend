# FuelSync Frontend Documentation

## 📚 Core Documentation

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Frontend Brain](./frontend_brain.md) | Central architecture document | Start here for overview |
| [API Integration Guide](./API_INTEGRATION_GUIDE.md) | API integration patterns | When implementing API features |
| [Development Strategy](./DEVELOPMENT_STRATEGY.md) | Development approach | When planning new features |
| [Documentation Reference System](./DOCUMENTATION_REFERENCE_SYSTEM.md) | How documentation works | When adding/updating docs |
| [Documentation Map](./DOCUMENTATION_MAP.md) | Code-documentation relationships | To find related documentation |

## 🔄 Development Process

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Development Accountability Checklist](./DEVELOPMENT_ACCOUNTABILITY_CHECKLIST.md) | Required steps for all changes | Before, during, and after development |
| [AI Agent Development Process](./AI_AGENT_DEVELOPMENT_PROCESS.md) | Process for AI agents | When using AI for development |

## 🧩 API Documentation

| Document | Description | When to Use |
|----------|-------------|-------------|
| [API Specification](./API_SPECIFICATION.md) | API endpoints and models | When working with API endpoints |
| [API Optimization Checklist](./api-optimization-checklist.md) | Best practices for API integration | When implementing/reviewing API code |
| [API Contract Alignment](./API_CONTRACT_ALIGNMENT.md) | Frontend-backend contract | When ensuring API compatibility |
| [API Field Mapping](./API_FIELD_MAPPING.md) | Field name mappings | When handling API response data |

## 👤 User Journeys

| Document | Description | When to Use |
|----------|-------------|-------------|
| [SuperAdmin Journey](./journeys/SUPERADMIN.md) | Platform administration flows | When working on admin features |
| [Owner Journey](./journeys/OWNER.md) | Business owner workflows | When working on owner features |
| [Manager Journey](./journeys/MANAGER.md) | Station manager workflows | When working on manager features |
| [Attendant Journey](./journeys/ATTENDANT.md) | Station attendant workflows | When working on attendant features |

## 🔧 Technical Guides

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Quick Start Guide](./QUICK_START_GUIDE.md) | Getting started | When onboarding new developers |
| [Tenant Architecture](./TENANT_ARCHITECTURE.md) | Multi-tenant architecture | When working with tenant features |
| [Setup Flow Guide](./SETUP_FLOW_GUIDE.md) | Initial setup workflows | When working on onboarding flows |
| [User Guide: Pumps & Nozzles](./USER_GUIDE_PUMPS_NOZZLES.md) | Managing pumps and nozzles | When working on pump/nozzle features |

## 🐛 Troubleshooting

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Troubleshooting Nozzles](./TROUBLESHOOTING_NOZZLES.md) | Common issues with nozzles | When debugging nozzle issues |
| [Frontend-Backend Mismatches](./FRONTEND_BACKEND_MISMATCHES.md) | Known API mismatches | When encountering API inconsistencies |

## 📝 Changelog

| Document | Description | When to Use |
|----------|-------------|-------------|
| [Frontend Changelog](./FRONTEND_CHANGELOG.md) | History of frontend changes | When tracking frontend changes |
| [API Changelog](./API_CHANGELOG.md) | History of API changes | When tracking API changes |

## Development Process Overview

### For All Developers and AI Agents

1. **Start with Documentation**: Begin with the README and Frontend Brain
2. **Follow the Accountability Checklist**: Complete all items in the Development Accountability Checklist
3. **Consult User Journeys**: Understand the user flow for the feature
4. **Follow API Integration Patterns**: Use the standardized patterns
5. **Document Changes**: Update documentation and add JSDoc comments
6. **Provide Implementation Summary**: Summarize what was changed and why

### For AI Agents Specifically

AI agents must follow the detailed process in the [AI Agent Development Process](./AI_AGENT_DEVELOPMENT_PROCESS.md) document, which includes:

1. Understanding the request
2. Consulting documentation
3. Analyzing existing code
4. Planning the implementation
5. Implementing changes
6. Testing changes
7. Documenting changes
8. Providing an implementation summary

## Documentation Maintenance

### How to Update Documentation

1. **Identify the Right Document**: Use this README to find the appropriate document
2. **Make Focused Changes**: Update only what's necessary
3. **Add References**: Link to related documents when appropriate
4. **Update Last Modified**: Update the "Last Updated" section at the bottom of the document
5. **Update README if Needed**: If adding new documents, update this README

### Documentation Standards

- Use Markdown for all documentation
- Include a clear title and description
- Add a "Last Updated" section at the bottom
- Link to related documents
- Use JSDoc references in code to point to documentation

### Documentation References in Code

When referencing documentation in code, use JSDoc comments:

```typescript
/**
 * @file MyComponent.tsx
 * @description Component for managing stations
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
```

## Last Updated

**Date**: Documentation and Process Consolidation
**Updated By**: Development Team
**Next Review**: Quarterly