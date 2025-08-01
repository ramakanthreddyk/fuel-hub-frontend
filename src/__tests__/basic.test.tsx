/**
 * @file __tests__/basic.test.tsx
 * @description Basic test to verify test setup is working
 */
import { describe, it, expect } from 'vitest';

describe('Basic Test Setup', () => {
  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('async result');
    const result = await promise;
    expect(result).toBe('async result');
  });

  it('should handle objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name', 'test');
    expect(obj).toHaveProperty('value', 42);
  });
});
