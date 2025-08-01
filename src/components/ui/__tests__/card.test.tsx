/**
 * @file components/ui/__tests__/card.test.tsx
 * @description Comprehensive tests for Card UI components
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default styling', () => {
      render(<Card data-testid="card">Card content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
    });

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles all HTML div props', () => {
      render(
        <Card 
          data-testid="card" 
          id="test-card" 
          role="region" 
          aria-label="Test card"
        >
          Content
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'test-card');
      expect(card).toHaveAttribute('role', 'region');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });

    it('renders children correctly', () => {
      render(
        <Card>
          <div data-testid="child">Child content</div>
        </Card>
      );
      
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('renders with correct styling', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);
      
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('combines custom className with default', () => {
      render(<CardHeader className="custom-header" data-testid="header">Content</CardHeader>);
      
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('custom-header', 'flex', 'flex-col');
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 by default', () => {
      render(<CardTitle data-testid="title">Title text</CardTitle>);
      
      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('applies custom styling', () => {
      render(<CardTitle className="custom-title" data-testid="title">Title</CardTitle>);
      
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders as paragraph with correct styling', () => {
      render(<CardDescription data-testid="description">Description text</CardDescription>);
      
      const description = screen.getByTestId('description');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('renders with padding', () => {
      render(<CardContent data-testid="content">Content text</CardContent>);
      
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders with flex layout', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);
      
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders full card with all components', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('full-card')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('handles nested cards', () => {
      render(
        <Card data-testid="outer-card">
          <CardContent>
            <Card data-testid="inner-card">
              <CardContent>Inner content</CardContent>
            </Card>
          </CardContent>
        </Card>
      );

      expect(screen.getByTestId('outer-card')).toBeInTheDocument();
      expect(screen.getByTestId('inner-card')).toBeInTheDocument();
      expect(screen.getByText('Inner content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      render(<Card data-testid="empty-card" />);
      
      const card = screen.getByTestId('empty-card');
      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it('handles null children', () => {
      render(<Card data-testid="null-children">{null}</Card>);
      
      const card = screen.getByTestId('null-children');
      expect(card).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<Card data-testid="undefined-children">{undefined}</Card>);
      
      const card = screen.getByTestId('undefined-children');
      expect(card).toBeInTheDocument();
    });

    it('handles boolean children', () => {
      render(
        <Card data-testid="boolean-children">
          {true && <div>Conditional content</div>}
          {false && <div>Hidden content</div>}
        </Card>
      );
      
      expect(screen.getByText('Conditional content')).toBeInTheDocument();
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('handles array of children', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      
      render(
        <Card>
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Card>
      );

      items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('handles very long content', () => {
      const longContent = 'A'.repeat(1000);
      
      render(
        <Card>
          <CardContent>{longContent}</CardContent>
        </Card>
      );

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialContent = 'Content with <>&"\' characters';
      
      render(
        <Card>
          <CardContent>{specialContent}</CardContent>
        </Card>
      );

      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeContent = 'Content with 🚗⛽🏪 emojis';
      
      render(
        <Card>
          <CardContent>{unicodeContent}</CardContent>
        </Card>
      );

      expect(screen.getByText(unicodeContent)).toBeInTheDocument();
    });

    it('handles multiple refs', () => {
      const ref1 = React.createRef<HTMLDivElement>();
      const ref2 = React.createRef<HTMLDivElement>();
      
      render(
        <div>
          <Card ref={ref1}>Card 1</Card>
          <Card ref={ref2}>Card 2</Card>
        </div>
      );

      expect(ref1.current).toBeInstanceOf(HTMLDivElement);
      expect(ref2.current).toBeInstanceOf(HTMLDivElement);
      expect(ref1.current).not.toBe(ref2.current);
    });

    it('handles dynamic className changes', () => {
      const { rerender } = render(
        <Card className="initial-class" data-testid="dynamic-card">Content</Card>
      );

      let card = screen.getByTestId('dynamic-card');
      expect(card).toHaveClass('initial-class');

      rerender(
        <Card className="updated-class" data-testid="dynamic-card">Content</Card>
      );

      card = screen.getByTestId('dynamic-card');
      expect(card).toHaveClass('updated-class');
      expect(card).not.toHaveClass('initial-class');
    });
  });

  describe('Accessibility', () => {
    it('supports ARIA attributes', () => {
      render(
        <Card 
          data-testid="accessible-card"
          role="article"
          aria-labelledby="card-title"
          aria-describedby="card-description"
        >
          <CardHeader>
            <CardTitle id="card-title">Accessible Title</CardTitle>
            <CardDescription id="card-description">Accessible description</CardDescription>
          </CardHeader>
        </Card>
      );

      const card = screen.getByTestId('accessible-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-labelledby', 'card-title');
      expect(card).toHaveAttribute('aria-describedby', 'card-description');
    });

    it('supports keyboard navigation attributes', () => {
      render(
        <Card 
          data-testid="keyboard-card"
          tabIndex={0}
          onKeyDown={() => {}}
        >
          Content
        </Card>
      );

      const card = screen.getByTestId('keyboard-card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});
