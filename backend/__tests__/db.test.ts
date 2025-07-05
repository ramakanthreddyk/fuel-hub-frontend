import { pool } from '../src/db';

describe('db pool config', () => {
  test('pool uses 10 max clients', () => {
    // Pool options are runtime dependent, but should expose max
    // Use any cast to access internal option
    expect((pool as any).options.max).toBe(10);
  });
});
