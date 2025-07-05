const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const MigrationRunner = require('./migrate');

// Skip when running in Codex or CI
if (process.env.CODEX_ENV_NODE_VERSION || process.env.CI) {
  console.log('Codex environment detected. Skipping Azure database setup.');
  process.exit(0);
}

async function setupAzureDatabase() {
  try {
    console.log('=== FuelSync Azure Database Setup ===\n');

    console.log('Step 1: Checking database connection...');
    execSync('node scripts/check-db-connection.js', { stdio: 'inherit' });
    console.log('✅ Database connection verified\n');

    console.log('Step 2: Fixing database constraints...');
    execSync('node scripts/fix-constraints.js', { stdio: 'inherit' });
    console.log('✅ Database constraints fixed\n');

    console.log('Step 3: Applying unified schema for Azure...');
    execSync('node scripts/setup-azure-schema.js', { stdio: 'inherit' });
    console.log('✅ Unified schema applied\n');

    console.log('Step 4: Running pending migrations (excluding cash_reports and tenant_settings_kv)...');

    const runner = new MigrationRunner();
    await runner.ensureMigrationTable();
    const applied = await runner.getAppliedMigrations();
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../migrations/schema'))
      .filter(file => file.endsWith('.sql') &&
        !file.includes('template') &&
        file !== '007_create_cash_reports.sql' &&
        file !== '008_create_tenant_settings_kv.sql')
      .sort();

    for (const file of migrationFiles) {
      const version = file.split('_')[0];
      if (applied.includes(version)) {
        console.log(`⏭️  Skipping ${version} (already applied)`);
        continue;
      }

      const filePath = path.join(__dirname, '../migrations/schema', file);
      const content = fs.readFileSync(filePath, 'utf8');
      const descMatch = content.match(/-- Description: (.+)/);
      const description = descMatch ? descMatch[1] : file;
      await runner.runMigration(version, description, content);
    }
    await runner.close();
    console.log('✅ Pending migrations applied\n');

    console.log('Step 5: Applying cash_reports migration...');
    execSync('node scripts/apply-cash-reports-azure.js', { stdio: 'inherit' });
    console.log('✅ cash_reports table created\n');

    console.log('Step 6: Applying tenant_settings_kv migration...');
    execSync('node scripts/apply-tenant-settings-kv-azure.js', { stdio: 'inherit' });
    console.log('✅ tenant_settings_kv table created\n');

    console.log('Step 7: Verifying schema structure...');
    execSync('node scripts/verify-schema.js', { stdio: 'inherit' });
    console.log('✅ Schema structure verified\n');

    console.log('Step 8: Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated\n');

    console.log('Step 9: Seeding initial data...');
    execSync('node scripts/seed-data.js', { stdio: 'inherit' });
    console.log('✅ Initial data seeded\n');

    console.log('=== Azure Setup Complete ===');
  } catch (err) {
    console.error('Error during Azure setup:', err.message);
    process.exit(1);
  }
}

setupAzureDatabase();
