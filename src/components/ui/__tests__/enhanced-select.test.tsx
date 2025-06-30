
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EnhancedSelect } from '../enhanced-select';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

describe('EnhancedSelect', () => {
  it('renders with label', () => {
    render(<EnhancedSelect label="Test Select" options={options} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<EnhancedSelect label="Test" options={options} error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<EnhancedSelect label="Test" options={options} helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('calls onValueChange when option is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    
    render(
      <EnhancedSelect 
        label="Test" 
        options={options} 
        onValueChange={onValueChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    const option = screen.getByText('Option 1');
    await user.click(option);
    
    expect(onValueChange).toHaveBeenCalledWith('option1');
  });

  it('displays required indicator', () => {
    render(<EnhancedSelect label="Required Field" options={options} required />);
    expect(screen.getByText('Required Field')).toHaveTextContent('*');
  });
});
