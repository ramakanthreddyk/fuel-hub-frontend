const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

async function setupUnifiedDatabase() {
  try {
    console.log('=== FuelSync Unified Database Setup ===\n');
    
    // Step 1: Check database connection
    console.log('Step 1: Checking database connection...');
    execSync('node scripts/check-db-connection.js', { stdio: 'inherit' });
    console.log('✅ Database connection verified\n');
    
    // Step 2: Fix constraints
    console.log('Step 2: Fixing database constraints...');
    execSync('node scripts/fix-constraints.js', { stdio: 'inherit' });
    console.log('✅ Database constraints fixed\n');
    
    // Step 3: Apply unified schema
    console.log('Step 3: Applying unified schema...');
    execSync('node scripts/apply-unified-schema.js', { stdio: 'inherit' });
    console.log('✅ Unified schema applied\n');

    // Step 4: Running pending migrations
    console.log('Step 4: Running pending migrations...');
    execSync('node scripts/migrate.js up', { stdio: 'inherit' });
    console.log('✅ Pending migrations applied\n');
    // Step 5: Verify schema
    console.log('Step 5: Verifying schema structure...');
    execSync('node scripts/verify-schema.js', { stdio: 'inherit' });
    console.log('✅ Schema structure verified\n');
    
    // Step 6: Generating Prisma client
    console.log('Step 6: Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated\n');
    
    // Step 7: Seeding initial data
    console.log('Step 7: Seeding initial data...');
    execSync('node scripts/seed-data.js', { stdio: 'inherit' });
    console.log('✅ Initial data seeded\n');
    
    console.log('=== Setup Complete ===');
    console.log('The FuelSync database has been successfully set up with the unified schema and seed data.');
    console.log('\nYou can now start the application with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('Error during setup:', error.message);
    process.exit(1);
  }
}

setupUnifiedDatabase();