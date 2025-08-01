/**
 * @file components/ui/__tests__/input.test.tsx
 * @description Comprehensive tests for Input UI component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default styling', () => {
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders password input', () => {
      render(<Input type="password" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders email input', () => {
      render(<Input type="email" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders number input', () => {
      render(<Input type="number" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders date input', () => {
      render(<Input type="date" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('renders file input', () => {
      render(<Input type="file" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'file');
    });
  });

  describe('Input Attributes', () => {
    it('handles placeholder', () => {
      render(<Input placeholder="Enter text" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('handles value', () => {
      render(<Input value="test value" data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('handles defaultValue', () => {
      render(<Input defaultValue="default value" data-testid="input" />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('default value');
    });

    it('handles disabled state', () => {
      render(<Input disabled data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('handles readOnly state', () => {
      render(<Input readOnly data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readOnly');
    });

    it('handles required attribute', () => {
      render(<Input required data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('required');
    });

    it('handles min and max for number inputs', () => {
      render(<Input type="number" min="0" max="100" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('handles step for number inputs', () => {
      render(<Input type="number" step="0.01" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('step', '0.01');
    });

    it('handles maxLength', () => {
      render(<Input maxLength={10} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('handles pattern', () => {
      render(<Input pattern="[0-9]*" data-testid="input" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });
  });

  describe('Event Handling', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles onKeyDown events', () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles onKeyUp events', () => {
      const handleKeyUp = vi.fn();
      render(<Input onKeyUp={handleKeyUp} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.keyUp(input, { key: 'Enter' });
      
      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    });

    it('handles multiple input changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });
      
      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(
        <Input 
          data-testid="input"
          aria-label="Accessible input"
          aria-describedby="input-description"
          aria-required="true"
          aria-invalid="false"
        />
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-label', 'Accessible input');
      expect(input).toHaveAttribute('aria-describedby', 'input-description');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('supports id for label association', () => {
      render(
        <div>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" data-testid="input" />
        </div>
      );
      
      const input = screen.getByTestId('input');
      const label = screen.getByText('Test Label');
      
      expect(input).toHaveAttribute('id', 'test-input');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('is keyboard accessible', () => {
      render(<Input data-testid="input" />);
      
      const input = screen.getByTestId('input');
      
      // Should be focusable
      input.focus();
      expect(input).toHaveFocus();
      
      // Should accept keyboard input
      fireEvent.keyDown(input, { key: 'a' });
      fireEvent.change(input, { target: { value: 'a' } });
      
      expect((input as HTMLInputElement).value).toBe('a');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty value', () => {
      render(<Input value="" data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles null value', () => {
      render(<Input value={null as any} data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles undefined value', () => {
      render(<Input value={undefined} data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles very long values', () => {
      const longValue = 'A'.repeat(1000);
      render(<Input value={longValue} data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe(longValue);
    });

    it('handles special characters in value', () => {
      const specialValue = 'Value with <>&"\' characters';
      render(<Input value={specialValue} data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe(specialValue);
    });

    it('handles unicode characters in value', () => {
      const unicodeValue = 'Value with 🚗⛽🏪 emojis';
      render(<Input value={unicodeValue} data-testid="input" readOnly />);
      
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe(unicodeValue);
    });

    it('handles rapid typing', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      
      // Simulate rapid typing
      const text = 'rapid typing test';
      for (let i = 0; i < text.length; i++) {
        fireEvent.change(input, { target: { value: text.substring(0, i + 1) } });
      }
      
      expect(handleChange).toHaveBeenCalledTimes(text.length);
    });

    it('handles paste events', () => {
      const handlePaste = vi.fn();
      render(<Input onPaste={handlePaste} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.paste(input, { clipboardData: { getData: () => 'pasted text' } });
      
      expect(handlePaste).toHaveBeenCalledTimes(1);
    });

    it('handles cut events', () => {
      const handleCut = vi.fn();
      render(<Input onCut={handleCut} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.cut(input);
      
      expect(handleCut).toHaveBeenCalledTimes(1);
    });

    it('handles copy events', () => {
      const handleCopy = vi.fn();
      render(<Input onCopy={handleCopy} data-testid="input" />);
      
      const input = screen.getByTestId('input');
      fireEvent.copy(input);
      
      expect(handleCopy).toHaveBeenCalledTimes(1);
    });

    it('handles form submission', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="test-input" data-testid="input" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const input = screen.getByTestId('input');
      const submitButton = screen.getByText('Submit');
      
      fireEvent.change(input, { target: { value: 'test value' } });
      fireEvent.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('handles controlled vs uncontrolled switching', () => {
      const { rerender } = render(<Input data-testid="input" />);
      
      let input = screen.getByTestId('input') as HTMLInputElement;
      
      // Start as uncontrolled
      fireEvent.change(input, { target: { value: 'uncontrolled' } });
      expect(input.value).toBe('uncontrolled');
      
      // Switch to controlled
      rerender(<Input value="controlled" data-testid="input" readOnly />);
      input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('controlled');
    });

    it('handles dynamic type changes', () => {
      const { rerender } = render(<Input type="text" data-testid="input" />);
      
      let input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'text');
      
      rerender(<Input type="password" data-testid="input" />);
      input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Integration', () => {
    it('works with form validation', () => {
      render(
        <form>
          <Input 
            type="email" 
            required 
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            data-testid="input" 
          />
        </form>
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('pattern');
    });

    it('supports form data attributes', () => {
      render(
        <Input 
          name="test-field"
          id="test-field"
          data-testid="input"
        />
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'test-field');
      expect(input).toHaveAttribute('id', 'test-field');
    });
  });
});
