import fs from 'fs';
import path from 'path';
import pool from '../src/utils/db';

async function runMigration() {
  console.log('Running database migration...');
  const client = await pool.connect();
  
  try {
    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'migrations/schema/001_initial_schema.sql');
    console.log(`Reading migration file: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`Migration file not found: ${migrationPath}`);
      process.exit(1);
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Migration file read successfully');
    
    // Execute the SQL
    console.log('Executing migration...');
    await client.query('BEGIN');
    
    try {
      await client.query(sql);
      await client.query('COMMIT');
      console.log('Migration completed successfully');
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.error('Migration failed:', error?.message || error);
      process.exit(1);
    }
  } finally {
    client.release();
  }
}

runMigration().catch((error: any) => {
  console.error('Migration script failed:', error?.message || error);
  process.exit(1);
});