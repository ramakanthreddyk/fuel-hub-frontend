import { Pool } from 'pg';

export const pool = new Pool({
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Connection pool with 10 max clients to prevent Azure PostgreSQL exhaustion
