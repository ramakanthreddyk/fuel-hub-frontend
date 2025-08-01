#!/usr/bin/env node

/**
 * @file scripts/test-validation.js
 * @description Comprehensive test validation script for FuelSync frontend
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Utility functions
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);
const logHeader = (message) => log(`\n${colors.bright}=== ${message} ===${colors.reset}`, colors.cyan);

// Test validation results
const validationResults = {
  dependencies: false,
  configuration: false,
  testFiles: false,
  unitTests: false,
  integrationTests: false,
  e2eTests: false,
  coverage: false,
  performance: false,
  accessibility: false,
  linting: false,
};

// Check if dependencies are installed
function checkDependencies() {
  logHeader('Checking Dependencies');
  
  const requiredDeps = [
    'vitest',
    '@testing-library/react',
    '@testing-library/user-event',
    '@testing-library/jest-dom',
    'jsdom',
    'msw',
    '@tanstack/react-query',
    'react-router-dom',
  ];

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  let allPresent = true;
  
  for (const dep of requiredDeps) {
    if (allDeps[dep]) {
      logSuccess(`${dep} is installed (${allDeps[dep]})`);
    } else {
      logError(`${dep} is missing`);
      allPresent = false;
    }
  }

  validationResults.dependencies = allPresent;
  return allPresent;
}

// Check test configuration files
function checkConfiguration() {
  logHeader('Checking Configuration Files');
  
  const configFiles = [
    'vitest.config.ts',
    'src/test/setup.ts',
    'tsconfig.json',
  ];

  let allPresent = true;

  for (const file of configFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file} exists`);
    } else {
      logError(`${file} is missing`);
      allPresent = false;
    }
  }

  // Check if vitest config has required settings
  try {
    const vitestConfigPath = path.join(process.cwd(), 'vitest.config.ts');
    const vitestConfig = fs.readFileSync(vitestConfigPath, 'utf8');
    
    const requiredSettings = [
      'environment: \'jsdom\'',
      'setupFiles',
      'coverage',
      'globals: true',
    ];

    for (const setting of requiredSettings) {
      if (vitestConfig.includes(setting)) {
        logSuccess(`Vitest config includes ${setting}`);
      } else {
        logWarning(`Vitest config missing ${setting}`);
      }
    }
  } catch (error) {
    logError('Error reading vitest config');
    allPresent = false;
  }

  validationResults.configuration = allPresent;
  return allPresent;
}

// Count test files
function checkTestFiles() {
  logHeader('Checking Test Files');
  
  const testPatterns = [
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'src/**/__tests__/**/*.{ts,tsx}',
  ];

  let totalTestFiles = 0;
  const testFilesByType = {
    unit: 0,
    integration: 0,
    e2e: 0,
    component: 0,
    hook: 0,
    service: 0,
  };

  // Recursively find test files
  function findTestFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findTestFiles(filePath);
      } else if (file.match(/\.(test|spec)\.(ts|tsx)$/)) {
        totalTestFiles++;
        
        // Categorize test files
        if (file.includes('component') || filePath.includes('/components/')) {
          testFilesByType.component++;
        } else if (file.includes('hook') || filePath.includes('/hooks/')) {
          testFilesByType.hook++;
        } else if (file.includes('service') || filePath.includes('/services/')) {
          testFilesByType.service++;
        } else if (file.includes('integration') || filePath.includes('/integration/')) {
          testFilesByType.integration++;
        } else if (file.includes('e2e') || filePath.includes('/e2e/')) {
          testFilesByType.e2e++;
        } else {
          testFilesByType.unit++;
        }
      }
    }
  }

  const srcDir = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    findTestFiles(srcDir);
  }

  logInfo(`Total test files found: ${totalTestFiles}`);
  logInfo(`Component tests: ${testFilesByType.component}`);
  logInfo(`Hook tests: ${testFilesByType.hook}`);
  logInfo(`Service tests: ${testFilesByType.service}`);
  logInfo(`Unit tests: ${testFilesByType.unit}`);
  logInfo(`Integration tests: ${testFilesByType.integration}`);
  logInfo(`E2E tests: ${testFilesByType.e2e}`);

  const hasTests = totalTestFiles > 0;
  if (hasTests) {
    logSuccess(`Found ${totalTestFiles} test files`);
  } else {
    logError('No test files found');
  }

  validationResults.testFiles = hasTests;
  return hasTests;
}

// Run unit tests
function runUnitTests() {
  logHeader('Running Unit Tests');
  
  try {
    const output = execSync('npm run test:unit 2>&1', { 
      encoding: 'utf8',
      timeout: 120000 // 2 minutes timeout
    });
    
    logSuccess('Unit tests passed');
    logInfo('Unit test output:');
    console.log(output);
    
    validationResults.unitTests = true;
    return true;
  } catch (error) {
    logError('Unit tests failed');
    console.log(error.stdout || error.message);
    
    validationResults.unitTests = false;
    return false;
  }
}

// Run integration tests
function runIntegrationTests() {
  logHeader('Running Integration Tests');
  
  try {
    const output = execSync('npm run test:integration 2>&1', { 
      encoding: 'utf8',
      timeout: 180000 // 3 minutes timeout
    });
    
    logSuccess('Integration tests passed');
    logInfo('Integration test output:');
    console.log(output);
    
    validationResults.integrationTests = true;
    return true;
  } catch (error) {
    logWarning('Integration tests failed or not configured');
    console.log(error.stdout || error.message);
    
    validationResults.integrationTests = false;
    return false;
  }
}

// Run E2E tests
function runE2ETests() {
  logHeader('Running E2E Tests');
  
  try {
    const output = execSync('npm run test:e2e 2>&1', { 
      encoding: 'utf8',
      timeout: 300000 // 5 minutes timeout
    });
    
    logSuccess('E2E tests passed');
    logInfo('E2E test output:');
    console.log(output);
    
    validationResults.e2eTests = true;
    return true;
  } catch (error) {
    logWarning('E2E tests failed or not configured');
    console.log(error.stdout || error.message);
    
    validationResults.e2eTests = false;
    return false;
  }
}

// Check test coverage
function checkCoverage() {
  logHeader('Checking Test Coverage');
  
  try {
    const output = execSync('npm run test:coverage 2>&1', { 
      encoding: 'utf8',
      timeout: 180000 // 3 minutes timeout
    });
    
    logSuccess('Coverage report generated');
    
    // Parse coverage results
    const coverageMatch = output.match(/All files\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)\s+\|\s+(\d+\.?\d*)/);
    
    if (coverageMatch) {
      const [, statements, branches, functions, lines] = coverageMatch;
      logInfo(`Coverage Summary:`);
      logInfo(`  Statements: ${statements}%`);
      logInfo(`  Branches: ${branches}%`);
      logInfo(`  Functions: ${functions}%`);
      logInfo(`  Lines: ${lines}%`);
      
      const minCoverage = 80;
      const allAboveThreshold = [statements, branches, functions, lines]
        .every(coverage => parseFloat(coverage) >= minCoverage);
      
      if (allAboveThreshold) {
        logSuccess(`All coverage metrics above ${minCoverage}% threshold`);
      } else {
        logWarning(`Some coverage metrics below ${minCoverage}% threshold`);
      }
    }
    
    validationResults.coverage = true;
    return true;
  } catch (error) {
    logError('Coverage check failed');
    console.log(error.stdout || error.message);
    
    validationResults.coverage = false;
    return false;
  }
}

// Run performance tests
function runPerformanceTests() {
  logHeader('Running Performance Tests');
  
  try {
    const output = execSync('npm run test:performance 2>&1', { 
      encoding: 'utf8',
      timeout: 120000 // 2 minutes timeout
    });
    
    logSuccess('Performance tests passed');
    validationResults.performance = true;
    return true;
  } catch (error) {
    logWarning('Performance tests failed or not configured');
    validationResults.performance = false;
    return false;
  }
}

// Run accessibility tests
function runAccessibilityTests() {
  logHeader('Running Accessibility Tests');
  
  try {
    const output = execSync('npm run test:a11y 2>&1', { 
      encoding: 'utf8',
      timeout: 120000 // 2 minutes timeout
    });
    
    logSuccess('Accessibility tests passed');
    validationResults.accessibility = true;
    return true;
  } catch (error) {
    logWarning('Accessibility tests failed or not configured');
    validationResults.accessibility = false;
    return false;
  }
}

// Run linting
function runLinting() {
  logHeader('Running Linting');
  
  try {
    const output = execSync('npm run lint 2>&1', { 
      encoding: 'utf8',
      timeout: 60000 // 1 minute timeout
    });
    
    logSuccess('Linting passed');
    validationResults.linting = true;
    return true;
  } catch (error) {
    logWarning('Linting failed or not configured');
    console.log(error.stdout || error.message);
    validationResults.linting = false;
    return false;
  }
}

// Generate validation report
function generateReport() {
  logHeader('Validation Report');
  
  const totalChecks = Object.keys(validationResults).length;
  const passedChecks = Object.values(validationResults).filter(Boolean).length;
  const passRate = (passedChecks / totalChecks * 100).toFixed(1);
  
  logInfo(`Overall Status: ${passedChecks}/${totalChecks} checks passed (${passRate}%)`);
  
  console.log('\nDetailed Results:');
  for (const [check, passed] of Object.entries(validationResults)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? colors.green : colors.red;
    log(`  ${check.padEnd(20)} ${status}`, color);
  }
  
  // Recommendations
  console.log('\nRecommendations:');
  
  if (!validationResults.dependencies) {
    logWarning('Install missing dependencies with: npm install');
  }
  
  if (!validationResults.configuration) {
    logWarning('Fix configuration files and ensure proper setup');
  }
  
  if (!validationResults.testFiles) {
    logWarning('Create test files for your components, hooks, and services');
  }
  
  if (!validationResults.coverage) {
    logWarning('Improve test coverage to meet minimum thresholds');
  }
  
  if (passRate >= 80) {
    logSuccess('Test infrastructure is in good shape! 🎉');
  } else if (passRate >= 60) {
    logWarning('Test infrastructure needs some improvements');
  } else {
    logError('Test infrastructure requires significant work');
  }
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'test-validation-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    totalChecks,
    passedChecks,
    passRate: parseFloat(passRate),
    results: validationResults,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logInfo(`Report saved to: ${reportPath}`);
  
  return passRate >= 80;
}

// Main execution
async function main() {
  log(`${colors.bright}🧪 FuelSync Frontend Test Validation${colors.reset}`, colors.cyan);
  log('This script validates the test infrastructure and runs all tests\n');
  
  const startTime = Date.now();
  
  // Run all validation steps
  checkDependencies();
  checkConfiguration();
  checkTestFiles();
  
  // Only run tests if basic setup is correct
  if (validationResults.dependencies && validationResults.configuration) {
    runUnitTests();
    runIntegrationTests();
    runE2ETests();
    checkCoverage();
    runPerformanceTests();
    runAccessibilityTests();
  } else {
    logError('Skipping test execution due to setup issues');
  }
  
  runLinting();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  logInfo(`\nValidation completed in ${duration} seconds`);
  
  const success = generateReport();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Handle errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Run the validation
main().catch((error) => {
  logError(`Validation failed: ${error.message}`);
  process.exit(1);
});
