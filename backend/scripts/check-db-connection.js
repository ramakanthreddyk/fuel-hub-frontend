const { Pool } = require('pg');

async function checkDbConnection() {
  // Load .env file if exists
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('dotenv not available, using environment variables');
  }

  console.log('Checking database connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // Log DB connection parameters
  console.log('DB Connection Parameters:');
  console.log('- Host:', process.env.DB_HOST || 'localhost');
  console.log('- Database:', process.env.DB_NAME || 'fuelsync_db');
  console.log('- User:', process.env.DB_USER || 'postgres');
 
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fuelsync_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database!');
    
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('Database info:');
    console.log('- Database:', result.rows[0].current_database);
    console.log('- User:', result.rows[0].current_user);
    console.log('- Version:', result.rows[0].version);
    
    // Check for existing schemas
    const schemas = await client.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')");
    console.log('Existing schemas:');
    schemas.rows.forEach(row => console.log(`- ${row.schema_name}`));
    
    // Check for existing tables in public schema
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Existing tables in public schema:');
    if (tables.rows.length === 0) {
      console.log('- No tables found');
    } else {
      tables.rows.forEach(row => console.log(`- ${row.table_name}`));
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
    console.error('Error details:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('\nPossible solutions:');
      console.log('1. Check if the database server is running');
      console.log('2. Verify the DB_HOST, DB_PORT values in .env file');
      console.log('3. Check if your IP is allowed in the database firewall');
    } else if (err.code === '28P01') {
      console.log('\nPossible solutions:');
      console.log('1. Check your DB_USER and DB_PASSWORD values');
      console.log('2. Verify the user has access to the database');
    } else if (err.code === '3D000') {
      console.log('\nPossible solutions:');
      console.log('1. Verify the DB_NAME exists');
      console.log('2. Create the database if it does not exist');
    }
  } finally {
    await pool.end();
  }
}

checkDbConnection().catch(console.error);