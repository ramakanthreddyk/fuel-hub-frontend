#!/usr/bin/env bash
# Frontend Restructure Script - Phase 1: Create new structure

echo "🏗️ Creating new frontend architecture..."

# Create feature-based structure
mkdir -p src/features/{stations,pumps,nozzles,readings,sales,reports,analytics,users,creditors,reconciliation,inventory}

# For each feature, create standard structure
for feature in stations pumps nozzles readings sales reports analytics users creditors reconciliation inventory; do
  mkdir -p "src/features/$feature"/{components,hooks,pages,services,types,utils}
done

# Create shared directory structure
mkdir -p src/shared/{components,hooks,services,types,utils,constants}

# Create core directory structure  
mkdir -p src/core/{auth,routing,layout,providers,config}

# Move existing files to features (examples)
echo "📁 Moving files to feature-based structure..."

# Example moves (you'll need to do this systematically)
# mv src/pages/dashboard/StationsPage.tsx src/features/stations/pages/StationsListPage.tsx
# mv src/components/stations/* src/features/stations/components/
# mv src/hooks/useStations.ts src/features/stations/hooks/

echo "✅ New structure created. Next: Move files systematically and update imports."
