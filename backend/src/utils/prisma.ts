import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables similar to pg pool helper
if (process.env.NODE_ENV !== 'production') {
  const envFile =
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
  dotenv.config({ path: envFile });
}

// Construct DATABASE_URL from individual DB_* vars if not provided
if (!process.env.DATABASE_URL && process.env.DB_HOST) {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const name = process.env.DB_NAME || 'postgres';
  process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${name}`;
}

const prisma = new PrismaClient();

export default prisma;
