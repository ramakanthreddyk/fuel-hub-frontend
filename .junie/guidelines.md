# Fuel Hub Frontend Development Guidelines

## Build/Configuration Instructions

### Prerequisites
- Node.js (v18+)
- npm or bun package manager

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Configure environment variables:
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

## Testing Information

### Testing Framework
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

### Writing Tests

#### Component Tests
Component tests should be placed in a `__tests__` directory adjacent to the component being tested.

Example component test:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { YourComponent } from "../YourComponent";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    
    render(<YourComponent onClick={onClickMock} />);
    
    await user.click(screen.getByRole("button"));
    expect(onClickMock).toHaveBeenCalled();
  });
});
```

#### Utility Tests
Utility tests should be placed in a `__tests__` directory adjacent to the utility file being tested.

Example utility test:
```tsx
import { describe, it, expect } from "vitest";
import { formatCurrency } from "../formatters";

describe("formatCurrency", () => {
  it("formats currency correctly", () => {
    expect(formatCurrency(1000)).toBe("₹1,000.00");
    expect(formatCurrency(1234.56)).toBe("₹1,234.56");
  });

  it("handles null and undefined values", () => {
    expect(formatCurrency(null)).toBe("₹0.00");
    expect(formatCurrency(undefined)).toBe("₹0.00");
  });
});
```

## Code Style and Development Guidelines

### Project Structure
- `src/api`: API client and service definitions
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/pages`: Page components
- `src/utils`: Utility functions
- `src/store`: State management (using Zustand)

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
- Implement virtualization for long lists using react-window or similar libraries

