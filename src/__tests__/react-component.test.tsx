/**
 * @file __tests__/react-component.test.tsx
 * @description Test React component rendering with Testing Library
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple test component
const TestButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button onClick={onClick} data-testid="test-button">
      {children}
    </button>
  );
};

const TestForm = () => {
  return (
    <form data-testid="test-form">
      <label htmlFor="name">Name:</label>
      <input id="name" type="text" data-testid="name-input" />
      <button type="submit" data-testid="submit-button">Submit</button>
    </form>
  );
};

describe('React Component Testing', () => {
  afterEach(() => {
    cleanup();
  });
  it('should render a button component', () => {
    const mockClick = vi.fn();
    render(<TestButton onClick={mockClick}>Click me</TestButton>);
    
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle button clicks', async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();
    
    render(<TestButton onClick={mockClick}>Click me</TestButton>);
    
    const button = screen.getByTestId('test-button');
    await user.click(button);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should render a form with accessibility', () => {
    render(<TestForm />);
    
    expect(screen.getByTestId('test-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should handle form input', async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    
    const input = screen.getByTestId('name-input');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });
});
