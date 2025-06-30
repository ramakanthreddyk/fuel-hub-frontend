
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EnhancedInput } from '../enhanced-input';
import { User } from 'lucide-react';

describe('EnhancedInput', () => {
  it('renders with label', () => {
    render(<EnhancedInput label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<EnhancedInput label="Test" error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<EnhancedInput label="Test" helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('handles password visibility toggle', async () => {
    const user = userEvent.setup();
    render(<EnhancedInput type="password" label="Password" />);
    
    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(input).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('displays required indicator', () => {
    render(<EnhancedInput label="Required Field" required />);
    expect(screen.getByText('Required Field')).toHaveTextContent('*');
  });

  it('renders with left icon', () => {
    render(<EnhancedInput label="Test" leftIcon={<User data-testid="user-icon" />} />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });
});
