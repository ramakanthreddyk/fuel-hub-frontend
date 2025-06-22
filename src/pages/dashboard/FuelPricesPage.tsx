
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FuelPriceTable } from '@/components/fuel-prices/FuelPriceTable';
import { FuelPriceForm } from '@/components/fuel-prices/FuelPriceForm';
import { useState } from 'react';

export default function FuelPricesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Prices</h1>
          <p className="text-muted-foreground">
            Manage and monitor fuel pricing across all stations
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Update Prices'}
        </Button>
      </div>

      {/* Add/Update Price Form */}
      {showForm && (
        <div className="max-w-md">
          <FuelPriceForm />
        </div>
      )}

      {/* Fuel Prices Table */}
      <FuelPriceTable />
    </div>
  );
}
