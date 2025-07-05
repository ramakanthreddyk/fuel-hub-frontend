import { execSync } from 'child_process';

console.log('Initializing database...');

try {
  execSync('npm run setup-db', { stdio: 'inherit' });
  console.log('\n--- Database initialization complete ---');
} catch (error) {
  console.error('Database initialization failed');
  process.exit(1);
}