import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.test' });

export async function createTestDb(retries = 5): Promise<void> {
  const host = process.env.PGHOST || 'localhost';
  const port = parseInt(process.env.PGPORT || '5432');
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || 'postgres';
  const dbName = process.env.PGDATABASE || 'fuelsync_test';

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const admin = new Client({ host, port, user, password, database: 'postgres' });
      await admin.connect();
      await admin.query(`CREATE DATABASE ${dbName}`);
      await admin.end();
      break;
    } catch (err: any) {
      if (err.code === '42P04') {
        break; // database already exists
      }
      console.error(`DB creation attempt ${attempt + 1} failed:`, err.message);
      if (attempt === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  const client = new Client({ host, port, user, password, database: dbName });
  await client.connect();

  const publicSql = fs.readFileSync(path.join(__dirname, '../migrations/schema/001_initial_schema.sql'), 'utf8');
  await client.query(publicSql);

  await client.query(
    `INSERT INTO public.plans (id, name, features)
     VALUES ($1, $2, $3)`,
    [randomUUID(), 'basic', '[]']
  );

  await client.end();
}

if (require.main === module) {
  createTestDb().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
