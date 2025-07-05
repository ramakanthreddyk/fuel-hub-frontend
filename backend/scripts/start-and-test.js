const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}Starting server and running login tests...${colors.reset}`);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Start the server
console.log(`${colors.yellow}Starting server...${colors.reset}`);
const server = spawn('node', ['index.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true
});

// Log server output
const serverLogFile = fs.createWriteStream(path.join(logsDir, 'server.log'));
server.stdout.pipe(serverLogFile);
server.stderr.pipe(serverLogFile);

// Listen for server output to detect when it's ready
let serverReady = false;
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`${colors.blue}[SERVER] ${output.trim()}${colors.reset}`);
  
  if (output.includes('FuelSync API listening')) {
    serverReady = true;
    runTests();
  }
});

server.stderr.on('data', (data) => {
  console.error(`${colors.red}[SERVER ERROR] ${data.toString().trim()}${colors.reset}`);
});

// Wait for server to start or timeout
let timeout = setTimeout(() => {
  if (!serverReady) {
    console.error(`${colors.red}Server did not start within 10 seconds${colors.reset}`);
    cleanup();
    process.exit(1);
  }
}, 10000);

// Run tests when server is ready
function runTests() {
  clearTimeout(timeout);
  
  // Wait a bit more to ensure server is fully initialized
  setTimeout(() => {
    console.log(`${colors.green}Server is ready, running login tests...${colors.reset}`);
    
    try {
      console.log(`${colors.cyan}Running direct login test...${colors.reset}`);
      execSync('npm run test:direct-login', { stdio: 'inherit' });
      console.log(`${colors.green}Tests completed${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Tests failed${colors.reset}`);
    } finally {
      cleanup();
    }
  }, 2000);
}

// Cleanup function
function cleanup() {
  console.log(`${colors.yellow}Stopping server...${colors.reset}`);
  
  // Kill the server process and its children
  if (process.platform === 'win32') {
    // On Windows, we need to use taskkill
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
    } catch (error) {
      // Ignore errors
    }
  } else {
    // On Unix-like systems
    if (server.pid) {
      process.kill(-server.pid);
    }
  }
}

// Handle process exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit();
});