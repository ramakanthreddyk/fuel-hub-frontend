import { dropTestSchema, pool } from './tests/utils/db-utils';
import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.test' });

export default async function () {
  if (fs.existsSync('SKIP_TESTS')) {
    fs.unlinkSync('SKIP_TESTS');
    return;
  }
  try {
    await dropTestSchema();
  } catch (_) {}
  await pool.end().catch(() => {});
  const client = new Client({
    host: process.env.DB_HOST || process.env.PGHOST,
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
    user: process.env.DB_USER || process.env.PGUSER,
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
    database: 'postgres',
  });
  await client.connect();
  const dbName = process.env.DB_NAME || process.env.PGDATABASE;
  await client.query(`DROP DATABASE IF EXISTS ${dbName}`).catch(() => {});
  await client.end();
}
