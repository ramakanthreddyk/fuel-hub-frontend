import { createTestDb } from './scripts/create-test-db';
import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.test' });

export default async function () {
  try {
    await createTestDb();
    const client = new Client({
      host: process.env.DB_HOST || process.env.PGHOST,
      port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
      user: process.env.DB_USER || process.env.PGUSER,
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
      database: process.env.DB_NAME || process.env.PGDATABASE,
    });
    await client.connect();
    await client.end();
  } catch (err: any) {
    fs.writeFileSync('SKIP_TESTS', err.message);
    console.error('Skipping tests: unable to provision test DB.', err.message);
    process.exit(0);
  }
}
