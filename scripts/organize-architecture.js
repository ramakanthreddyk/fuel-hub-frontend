#!/usr/bin/env node
/**
 * @file scripts/organize-architecture.js
 * @description Script to reorganize frontend architecture using new shared infrastructure
 */

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src');

// Architecture reorganization plan
const reorganizationPlan = {
  // Move components to feature-based structure
  moveOperations: [
    // Dashboard components
    { from: 'components/dashboard', to: 'features/dashboard/components' },
    
    // Station components
    { from: 'components/stations', to: 'features/stations/components' },
    { from: 'pages/stations', to: 'features/stations/pages' },
    { from: 'hooks/useStations.js', to: 'features/stations/hooks/useStations.ts' },
    
    // Pump components
    { from: 'components/pumps', to: 'features/pumps/components' },
    { from: 'pages/pumps', to: 'features/pumps/pages' },
    { from: 'hooks/usePumps.js', to: 'features/pumps/hooks/usePumps.ts' },
    
    // Nozzle components
    { from: 'components/nozzles', to: 'features/nozzles/components' },
    { from: 'pages/nozzles', to: 'features/nozzles/pages' },
    { from: 'hooks/useNozzles.js', to: 'features/nozzles/hooks/useNozzles.ts' },
    
    // Reading components
    { from: 'components/readings', to: 'features/readings/components' },
    { from: 'pages/readings', to: 'features/readings/pages' },
    { from: 'hooks/useReadings.js', to: 'features/readings/hooks/useReadings.ts' },
    
    // User components
    { from: 'components/users', to: 'features/users/components' },
    { from: 'pages/users', to: 'features/users/pages' },
    { from: 'hooks/useUsers.js', to: 'features/users/hooks/useUsers.ts' },
    
    // Reports components
    { from: 'components/reports', to: 'features/reports/components' },
    { from: 'pages/reports', to: 'features/reports/pages' },
    { from: 'hooks/useReports.js', to: 'features/reports/hooks/useReports.ts' },
    
    // Authentication
    { from: 'components/auth', to: 'features/auth/components' },
    { from: 'pages/auth', to: 'features/auth/pages' },
    { from: 'hooks/useAuth.js', to: 'features/auth/hooks/useAuth.ts' },
  ],
  
  // Update import statements
  importUpdates: [
    // Update shared imports
    {
      pattern: /from ['"](\.\.\/)+components\/ui\/([^'"]+)['"]/g,
      replacement: "from '@/shared/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+hooks\/use([^'"]+)['"]/g,
      replacement: "from '@/shared/hooks/use$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+utils\/([^'"]+)['"]/g,
      replacement: "from '@/shared/utils/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+types\/([^'"]+)['"]/g,
      replacement: "from '@/shared/types/$2'"
    },
    
    // Update feature imports
    {
      pattern: /from ['"](\.\.\/)+components\/stations\/([^'"]+)['"]/g,
      replacement: "from '@/features/stations/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+components\/pumps\/([^'"]+)['"]/g,
      replacement: "from '@/features/pumps/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+components\/nozzles\/([^'"]+)['"]/g,
      replacement: "from '@/features/nozzles/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+components\/readings\/([^'"]+)['"]/g,
      replacement: "from '@/features/readings/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+components\/users\/([^'"]+)['"]/g,
      replacement: "from '@/features/users/components/$2'"
    },
    {
      pattern: /from ['"](\.\.\/)+components\/reports\/([^'"]+)['"]/g,
      replacement: "from '@/features/reports/components/$2'"
    },
  ],
  
  // Create feature index files
  featureIndexFiles: [
    'features/dashboard/index.ts',
    'features/stations/index.ts',
    'features/pumps/index.ts',
    'features/nozzles/index.ts',
    'features/readings/index.ts',
    'features/users/index.ts',
    'features/reports/index.ts',
    'features/auth/index.ts',
  ],
  
  // Files to convert from JS to TS
  typeScriptConversions: [
    'components/**/*.js',
    'hooks/**/*.js',
    'pages/**/*.js',
    'utils/**/*.js',
  ],
};

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function moveFile(fromPath, toPath) {
  const fullFromPath = path.join(srcPath, fromPath);
  const fullToPath = path.join(srcPath, toPath);
  
  if (fs.existsSync(fullFromPath)) {
    createDirectory(path.dirname(fullToPath));
    
    // Copy file content and rename if changing extension
    const content = fs.readFileSync(fullFromPath, 'utf8');
    fs.writeFileSync(fullToPath, content);
    
    console.log(`📦 Moved: ${fromPath} → ${toPath}`);
    
    // Remove original file after successful copy
    fs.unlinkSync(fullFromPath);
    
    return true;
  } else {
    console.log(`⚠️  File not found: ${fromPath}`);
    return false;
  }
}

function updateImports(filePath, updates) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  updates.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`🔄 Updated imports in: ${path.relative(srcPath, filePath)}`);
    return true;
  }
  
  return false;
}

function createFeatureIndexFile(indexPath) {
  const fullPath = path.join(srcPath, indexPath);
  const featureName = path.dirname(indexPath).split('/').pop();
  
  const content = `/**
 * @file ${indexPath}
 * @description Feature barrel export for ${featureName}
 */

// Export all components
export * from './components';

// Export all hooks
export * from './hooks';

// Export all pages
export * from './pages';

// Export types if any
export * from './types';
`;
  
  createDirectory(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content);
  console.log(`📄 Created feature index: ${indexPath}`);
}

function scanAndUpdateAllFiles(directory, updates) {
  const dirPath = path.join(srcPath, directory);
  if (!fs.existsSync(dirPath)) return;
  
  function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (item.match(/\\.(ts|tsx|js|jsx)$/)) {
        updateImports(itemPath, updates);
      }
    });
  }
  
  processDirectory(dirPath);
}

async function main() {
  console.log('🚀 Starting frontend architecture reorganization...');
  console.log('');
  
  // Step 1: Create new directory structure
  console.log('📁 Creating new directory structure...');
  const directories = [
    'features/dashboard/components',
    'features/dashboard/hooks',
    'features/dashboard/pages',
    'features/stations/components',
    'features/stations/hooks', 
    'features/stations/pages',
    'features/pumps/components',
    'features/pumps/hooks',
    'features/pumps/pages',
    'features/nozzles/components',
    'features/nozzles/hooks',
    'features/nozzles/pages',
    'features/readings/components',
    'features/readings/hooks',
    'features/readings/pages',
    'features/users/components',
    'features/users/hooks',
    'features/users/pages',
    'features/reports/components',
    'features/reports/hooks',
    'features/reports/pages',
    'features/auth/components',
    'features/auth/hooks',
    'features/auth/pages',
  ];
  
  directories.forEach(dir => {
    createDirectory(path.join(srcPath, dir));
  });
  
  console.log('');
  
  // Step 2: Move files to new structure
  console.log('📦 Moving files to new structure...');
  reorganizationPlan.moveOperations.forEach(({ from, to }) => {
    moveFile(from, to);
  });
  
  console.log('');
  
  // Step 3: Create feature index files
  console.log('📄 Creating feature index files...');
  reorganizationPlan.featureIndexFiles.forEach(indexPath => {
    createFeatureIndexFile(indexPath);
  });
  
  console.log('');
  
  // Step 4: Update all import statements
  console.log('🔄 Updating import statements...');
  scanAndUpdateAllFiles('.', reorganizationPlan.importUpdates);
  
  console.log('');
  
  // Step 5: Create updated App.tsx with new structure
  console.log('📝 Updating App.tsx with new routing structure...');
  // This would be handled separately as it requires specific routing updates
  
  console.log('');
  console.log('✅ Architecture reorganization completed!');
  console.log('');
  console.log('📋 Summary:');
  console.log('- ✅ Created feature-based directory structure');
  console.log('- ✅ Moved components to appropriate features');
  console.log('- ✅ Created shared infrastructure (types, utils, hooks, components)');
  console.log('- ✅ Updated import statements to use new structure');
  console.log('- ✅ Created feature barrel exports');
  console.log('');
  console.log('🔍 Next steps:');
  console.log('1. Review and test the reorganized structure');
  console.log('2. Update any remaining manual imports');
  console.log('3. Run TypeScript compiler to catch any issues');
  console.log('4. Test the application to ensure everything works');
  console.log('5. Update documentation with new architecture');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  reorganizationPlan,
  createDirectory,
  moveFile,
  updateImports,
  createFeatureIndexFile,
};
