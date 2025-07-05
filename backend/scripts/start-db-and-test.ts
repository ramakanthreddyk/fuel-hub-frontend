import { spawnSync, execSync } from 'child_process';
import path from 'path';

function checkConnection(): boolean {
  const result = spawnSync('node', [path.join(__dirname, 'check-db-connection.js')], { encoding: 'utf8' });
  return result.stdout.includes('Successfully connected');
}

async function waitForConnection(retries = 10, delayMs = 3000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (checkConnection()) return true;
    await new Promise(res => setTimeout(res, delayMs));
  }
  return false;
}

async function main() {
  if (!checkConnection()) {
    console.log('Database not running. Starting dev DB...');
    execSync(`sh ${path.join(__dirname, 'start-dev-db.sh')}`, { stdio: 'inherit' });
    const ready = await waitForConnection();
    if (!ready) {
      console.error('Database failed to start.');
      process.exit(1);
    }
  }

  execSync('npm run test:unit', { stdio: 'inherit' });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
