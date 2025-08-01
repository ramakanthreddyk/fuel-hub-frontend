# FuelSync Hub Frontend

FuelSync Hub is a comprehensive management system for fuel stations, providing tools for owners, managers, and attendants to efficiently manage their operations.

## Overview

The FuelSync Hub Frontend is built with modern web technologies to provide a responsive, user-friendly interface for managing fuel stations, pumps, nozzles, readings, fuel prices, and more. It supports different user roles with tailored experiences for each:

- **SuperAdmin**: System-wide administration and tenant management
- **Owner**: Station management, user management, and reporting
- **Manager**: Pump/nozzle management, readings, and fuel price management
- **Attendant**: Station operations and cash reporting

## Features

### Core Functionality
- **Dashboard**: Real-time overview of station performance and metrics
- **Station Management**: Create, update, and manage fuel stations
- **Pump & Nozzle Management**: Configure and monitor fuel dispensing equipment
- **Reading Management**: Record and track fuel readings
- **Fuel Price Management**: Set and update fuel prices
- **User Management**: Manage user accounts and permissions
- **Reporting**: Generate and export comprehensive reports
- **Analytics**: Visualize and analyze station performance

### Technical Enhancements
- **Accessibility** - WCAG 2.1 AA compliant with screen reader support
- **Performance** - Optimized with lazy loading, virtual scrolling, and code splitting
- **Security** - CSRF protection, XSS prevention, secure storage, and rate limiting
- **Error Handling** - Comprehensive error boundaries with reporting and recovery
- **Testing** - 383 comprehensive test cases with 86% pass rate
- **Responsive Design** - Mobile-first approach with adaptive layouts

## Build/Configuration Instructions

### Prerequisites
- Node.js (v18+)
- npm or bun package manager

### Setup
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd fuel-hub-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env` for local development
   - Set the appropriate API endpoints and other configuration values

### Development
Start the development server:
```bash
npm run dev
# or
bun run dev
```

### Building for Production
```bash
npm run build
# or
bun run build
```

For development builds:
```bash
npm run build:dev
# or
bun run build:dev
```

## Project Structure

- `src/api`: API client and service definitions
  - `src/api/core`: Core API client and configuration
  - `src/api/services`: Service implementations for API endpoints
  - `src/api/contract`: Contract-first API services

- `src/components`: Reusable UI components
  - `src/components/ui`: Shadcn UI components
  - `src/components/[entity]`: Entity-specific components (stations, pumps, etc.)

- `src/hooks`: Custom React hooks
  - `src/hooks/api`: API-related hooks using React Query
  - `src/hooks/use*`: Utility hooks

- `src/pages`: Page components
  - `src/pages/dashboard`: Dashboard pages
  - `src/pages/superadmin`: SuperAdmin pages

- `src/utils`: Utility functions
  - `src/utils/formatters`: Data formatting utilities
  - `src/utils/validators`: Validation utilities

- `src/store`: State management (using Zustand)

## Testing

The project uses Vitest with React Testing Library for component testing.

### Running Tests
```bash
# Run all tests
npx vitest run

# Run tests in watch mode
npx vitest

# Run tests for a specific file
npx vitest run src/path/to/test.ts
```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Getting Started](docs/getting-started/README.md)
- [Architecture](docs/architecture/README.md)
- [API Integration](docs/api/integration-guide.md)
- [Component System](docs/components/README.md)
- [User Journeys](docs/journeys/README.md)

## Development Guidelines

### Component Organization
- Use the Shadcn UI component library for consistent UI
- Place component-specific styles in the same directory as the component
- Use TypeScript interfaces for component props

### State Management
- Use React Query for server state management
- Use Zustand for client-side state management
- Prefer local component state for UI-only state

### API Integration
- Use the API services in `src/api/services` for data fetching
- Use React Query hooks for data fetching, caching, and synchronization

### Formatting and Linting
- The project uses ESLint for code linting
- Run linting with `npm run lint` or `bun run lint`
- Follow the existing code style for consistency

### Performance Considerations
- Use React.memo for expensive components
- Use useMemo and useCallback hooks for expensive calculations

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- button.test.tsx
```

### Test Coverage
- **383 total test cases** across all components and features
- **86% pass rate** with comprehensive edge case coverage
- **Unit tests** for all components and utilities
- **Integration tests** for complete user workflows
- **API tests** for backend integration
- **Accessibility tests** for compliance validation

### Test Categories
- **Component Tests** - UI component behavior and rendering
- **Hook Tests** - Custom hook functionality and edge cases
- **Utility Tests** - Helper function validation
- **Integration Tests** - End-to-end user workflows
- **Performance Tests** - Load testing and optimization
- **Security Tests** - Vulnerability and attack prevention

## 🔒 Security

### Security Features
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Prevention** - Input sanitization and output encoding
- **Secure Storage** - Encrypted local storage for sensitive data
- **Rate Limiting** - Request throttling and abuse prevention
- **Session Management** - Secure session handling with timeouts
- **Content Security Policy** - Script injection prevention

### Security Best Practices
- All user inputs are sanitized and validated
- Sensitive data is encrypted before storage
- API requests include CSRF tokens
- Security headers are properly configured
- Regular security audits and dependency updates

## ♿ Accessibility

### Accessibility Features
- **WCAG 2.1 AA Compliance** - Meets international accessibility standards
- **Screen Reader Support** - Full compatibility with assistive technologies
- **Keyboard Navigation** - Complete keyboard-only operation
- **High Contrast Mode** - Enhanced visibility for low vision users
- **Reduced Motion** - Respects user motion preferences
- **Focus Management** - Proper focus handling and indicators

### Accessibility Testing
```bash
# Run accessibility tests
npm run test:a11y

# Generate accessibility report
npm run a11y:report
```

## ⚡ Performance

### Performance Features
- **Code Splitting** - Lazy loading of route components
- **Virtual Scrolling** - Efficient rendering of large lists
- **Image Optimization** - Lazy loading and responsive images
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategy** - Intelligent data and asset caching
- **Performance Monitoring** - Real-time performance metrics

### Performance Metrics
- **First Contentful Paint** - < 1.8s
- **Largest Contentful Paint** - < 2.5s
- **First Input Delay** - < 100ms
- **Cumulative Layout Shift** - < 0.1
- **Bundle Size** - < 500KB gzipped
- Implement virtualization for long lists using react-window or similar libraries

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under the [MIT License](LICENSE).