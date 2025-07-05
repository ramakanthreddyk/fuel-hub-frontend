import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST,
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  user: process.env.DB_USER || process.env.PGUSER,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  database: process.env.DB_NAME || process.env.PGDATABASE,
});

export async function createTestSchema() {
  // Unified schema - no dedicated test schema required
}

export async function dropTestSchema() {
  // Unified schema - nothing to drop
}
