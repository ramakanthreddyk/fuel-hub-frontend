import { Pool } from 'pg';
import dotenv from 'dotenv';

// Only load .env files in development
if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
  dotenv.config({ path: envFile });
}

console.log('[DB] Environment:', process.env.NODE_ENV);

// Determine connection method: connection string vs Azure parameters
const useConnectionString = process.env.POSTGRES_URL || process.env.NILEDB_URL;
const useAzureParams = process.env.DB_HOST && process.env.DB_USER;

let pool: Pool;

if (useConnectionString) {
  console.log('[DB] Using connection string');
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.NILEDB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000,
    max: 1
  });
} else if (useAzureParams) {
  console.log('[DB] Using Azure PostgreSQL params');
  console.log('[DB] Host:', process.env.DB_HOST);
  console.log('[DB] User:', process.env.DB_USER);
  console.log('[DB] Database:', process.env.DB_NAME);
  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000,
    max: process.env.NODE_ENV === 'production' ? 1 : 10
  });
} else {
  console.error('[DB] No database configuration found!');
  throw new Error('Database configuration missing');
}

// Test connection on startup
pool.on('error', (err) => {
  console.error('[DB] Pool error:', err);
});

// Add connection test function
export async function testConnection() {
  try {
    console.log('[DB] Testing connection with config:', {
      host: process.env.DB_HOST ? 'SET' : 'NOT_SET',
      user: process.env.DB_USER ? 'SET' : 'NOT_SET', 
      database: process.env.DB_NAME ? 'SET' : 'NOT_SET',
      port: process.env.DB_PORT || '5432'
    });
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    console.log('[DB] Connection test successful:', result.rows[0]);
    return { success: true, time: result.rows[0].current_time };
  } catch (err: any) {
    console.error('[DB] Connection test failed:', {
      message: err.message,
      code: err.code,
      host: process.env.DB_HOST,
      user: process.env.DB_USER
    });
    return { success: false, error: err.message, code: err.code };
  }
}

export default pool;
