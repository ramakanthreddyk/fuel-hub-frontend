# Plan Pricing Guide

## Overview

FuelSync offers subscription plans with both monthly and yearly pricing options. This guide explains how plan pricing works and how to manage it.

## Plan Pricing Structure

Each plan has two pricing options:
- **Monthly Price**: Charged on a monthly basis
- **Yearly Price**: Charged annually (typically at a discount)

## Database Schema

The `public.plans` table includes both pricing fields:

```sql
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_stations INTEGER NOT NULL DEFAULT 5,
  max_pumps_per_station INTEGER NOT NULL DEFAULT 10,
  max_nozzles_per_pump INTEGER NOT NULL DEFAULT 4,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Create Plan
```
POST /api/v1/admin/plans
```

**Request:**
```json
{
  "name": "Premium Plan",
  "maxStations": 20,
  "maxPumpsPerStation": 25,
  "maxNozzlesPerPump": 6,
  "priceMonthly": 149.99,
  "priceYearly": 1499.99,
  "features": ["Feature 1", "Feature 2"]
}
```

### Update Plan
```
PUT /api/v1/admin/plans/:id
```

**Request:**
```json
{
  "priceMonthly": 159.99,
  "priceYearly": 1599.99
}
```

## Frontend Implementation

### Plan Creation Form

```tsx
function PlanForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    maxStations: initialData?.maxStations || 5,
    maxPumpsPerStation: initialData?.maxPumpsPerStation || 10,
    maxNozzlesPerPump: initialData?.maxNozzlesPerPump || 4,
    priceMonthly: initialData?.priceMonthly || 0,
    priceYearly: initialData?.priceYearly || 0,
    features: initialData?.features || []
  });
  
  // Calculate yearly price automatically (10% discount)
  const calculateYearlyPrice = (monthlyPrice) => {
    const monthly = parseFloat(monthlyPrice) || 0;
    return (monthly * 12 * 0.9).toFixed(2); // 10% discount
  };
  
  const handleMonthlyPriceChange = (e) => {
    const monthlyPrice = e.target.value;
    setFormData({
      ...formData,
      priceMonthly: monthlyPrice,
      priceYearly: calculateYearlyPrice(monthlyPrice)
    });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      {/* Other form fields */}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label>Monthly Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.priceMonthly}
            onChange={handleMonthlyPriceChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label>Yearly Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.priceYearly}
            onChange={(e) => setFormData({...formData, priceYearly: e.target.value})}
            required
          />
          <small className="text-gray-500">
            Suggested: ${calculateYearlyPrice(formData.priceMonthly)} (10% discount)
          </small>
        </div>
      </div>
      
      <button type="submit">
        {initialData ? 'Update Plan' : 'Create Plan'}
      </button>
    </form>
  );
}
```

### Plan Display Component

```tsx
function PlanCard({ plan, onSelect, selected }) {
  return (
    <div className={`border rounded-lg p-4 ${selected ? 'border-blue-500 bg-blue-50' : ''}`}>
      <h3 className="text-lg font-bold">{plan.name}</h3>
      
      <div className="mt-4">
        <div className="flex justify-between">
          <span>Monthly</span>
          <span className="font-bold">${plan.priceMonthly}</span>
        </div>
        <div className="flex justify-between">
          <span>Yearly</span>
          <span className="font-bold">${plan.priceYearly}</span>
          <span className="text-green-600 text-sm">
            Save ${(plan.priceMonthly * 12 - plan.priceYearly).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold">Features</h4>
        <ul className="mt-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <button
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded"
        onClick={() => onSelect(plan)}
      >
        Select Plan
      </button>
    </div>
  );
}
```

## Billing Cycle Options

When a tenant selects a plan, they can choose between:

1. **Monthly Billing**: Charged the `priceMonthly` amount each month
2. **Yearly Billing**: Charged the `priceYearly` amount once per year

The yearly option typically offers a discount (e.g., 10-20% off) compared to paying monthly for 12 months.

## Updating Existing Plans

To update the yearly price for existing plans:

```bash
# Run the add-yearly-price script
npm run add-yearly-price
```

This script will:
1. Add the `price_yearly` column if it doesn't exist
2. Set the yearly price to 12x the monthly price
3. Record the migration in the `schema_migrations` table