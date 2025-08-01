/**
 * @file components/ui/__tests__/button.test.tsx
 * @description Comprehensive tests for Button UI component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';

// Mock Slot component from @radix-ui/react-slot
vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default variant and size', () => {
      render(<Button data-testid="button">Click me</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('renders button text correctly', () => {
      render(<Button>Test Button</Button>);
      
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Button variant="default" data-testid="button">Default</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('renders destructive variant', () => {
      render(<Button variant="destructive" data-testid="button">Destructive</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline" data-testid="button">Outline</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('border', 'border-input', 'bg-background');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary" data-testid="button">Secondary</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost" data-testid="button">Ghost</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('renders link variant', () => {
      render(<Button variant="link" data-testid="button">Link</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('renders default size', () => {
      render(<Button size="default" data-testid="button">Default Size</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    });

    it('renders small size', () => {
      render(<Button size="sm" data-testid="button">Small</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
    });

    it('renders large size', () => {
      render(<Button size="lg" data-testid="button">Large</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('h-11', 'rounded-md', 'px-8');
    });

    it('renders icon size', () => {
      render(<Button size="icon" data-testid="button">🔥</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class" data-testid="button">Custom</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-class');
    });

    it('combines variant, size, and custom className', () => {
      render(
        <Button 
          variant="outline" 
          size="lg" 
          className="custom-class" 
          data-testid="button"
        >
          Combined
        </Button>
      );
      
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-class', 'border', 'h-11');
    });
  });

  describe('Event Handling', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByText('Click me');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Press me</Button>);
      
      fireEvent.keyDown(screen.getByText('Press me'), { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles mouse events', () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();
      
      render(
        <Button 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover me
        </Button>
      );
      
      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
      
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled data-testid="button">Disabled</Button>);
      
      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('prevents click when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      fireEvent.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles focus state', () => {
      render(<Button data-testid="button">Focus me</Button>);
      
      const button = screen.getByTestId('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });
  });

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild data-testid="button">
          <a href="/test">Link Button</a>
        </Button>
      );
      
      // When asChild is true, it should render the child element
      const element = screen.getByTestId('button');
      expect(element).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('supports all button HTML attributes', () => {
      render(
        <Button 
          data-testid="button"
          id="test-button"
          type="submit"
          form="test-form"
          name="test-name"
          value="test-value"
          aria-label="Test button"
          title="Button title"
        >
          Full Button
        </Button>
      );
      
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('form', 'test-form');
      expect(button).toHaveAttribute('name', 'test-name');
      expect(button).toHaveAttribute('value', 'test-value');
      expect(button).toHaveAttribute('aria-label', 'Test button');
      expect(button).toHaveAttribute('title', 'Button title');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      render(<Button data-testid="empty-button" />);
      
      const button = screen.getByTestId('empty-button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('handles null children', () => {
      render(<Button data-testid="null-children">{null}</Button>);
      
      const button = screen.getByTestId('null-children');
      expect(button).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<Button data-testid="undefined-children">{undefined}</Button>);
      
      const button = screen.getByTestId('undefined-children');
      expect(button).toBeInTheDocument();
    });

    it('handles boolean children', () => {
      render(
        <Button data-testid="boolean-children">
          {true && 'Visible'}
          {false && 'Hidden'}
        </Button>
      );
      
      expect(screen.getByText('Visible')).toBeInTheDocument();
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });

    it('handles complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<Button>{longText}</Button>);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      const specialText = 'Button with <>&"\' characters';
      render(<Button>{specialText}</Button>);
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeText = 'Button with 🚗⛽🏪 emojis';
      render(<Button>{unicodeText}</Button>);
      
      expect(screen.getByText(unicodeText)).toBeInTheDocument();
    });

    it('handles rapid clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Rapid Click</Button>);
      
      const button = screen.getByText('Rapid Click');
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      expect(handleClick).toHaveBeenCalledTimes(10);
    });

    it('handles click with modifier keys', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Modified Click</Button>);
      
      const button = screen.getByText('Modified Click');
      
      fireEvent.click(button, { ctrlKey: true });
      fireEvent.click(button, { shiftKey: true });
      fireEvent.click(button, { altKey: true });
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(
        <Button 
          data-testid="accessible-button"
          aria-label="Accessible button"
          aria-describedby="button-description"
          role="button"
        >
          Accessible
        </Button>
      );
      
      const button = screen.getByTestId('accessible-button');
      expect(button).toHaveAttribute('aria-label', 'Accessible button');
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByText('Keyboard Button');
      
      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();
      
      // Should activate on Enter
      fireEvent.keyDown(button, { key: 'Enter' });
      // Note: Default button behavior for Enter is handled by the browser
    });

    it('supports screen reader attributes', () => {
      render(
        <Button 
          data-testid="screen-reader-button"
          aria-pressed="false"
          aria-expanded="false"
          aria-haspopup="true"
        >
          Screen Reader Button
        </Button>
      );
      
      const button = screen.getByTestId('screen-reader-button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });
  });
});
