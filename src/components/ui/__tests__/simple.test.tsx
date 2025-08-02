/**
 * @file simple.test.tsx
 * @description Simple test to verify setup
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

function SimpleComponent() {
  return <div>Hello World</div>;
}

function ButtonComponent({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return <button onClick={onClick}>{children}</button>;
}

describe('Simple Test Suite', () => {
  it('should render hello world', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4);
  });

  it('should render button component', () => {
    render(<ButtonComponent>Click me</ButtonComponent>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle arrays correctly', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr[0]).toBe(1);
  });

  it('should handle objects correctly', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj.name).toBe('Test');
    expect(obj.value).toBe(42);
  });
});
