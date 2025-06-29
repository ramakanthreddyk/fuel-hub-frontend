
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FuelPriceTable } from '@/components/fuel-prices/FuelPriceTable';
import { FuelPriceForm } from '@/components/fuel-prices/FuelPriceForm';
import { PageHeader } from '@/components/ui/page-header';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

/**
 * Fuel Prices management page
 * 
 * Features:
 * - Toggle between table view and form
 * - Accessible page structure with proper headings
 * - Responsive layout with mobile-friendly actions
 * - Clear user feedback and navigation
 */
export default function FuelPricesPage() {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel Prices"
        description="Manage and monitor fuel pricing across all stations"
        actions={
          <TooltipWrapper 
            content={showForm ? "Cancel price update" : "Update fuel prices"}
          >
            <Button 
              onClick={handleToggleForm}
              variant={showForm ? 'outline' : 'default'}
              aria-label={showForm ? 'Cancel price update' : 'Update fuel prices'}
            >
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Update Prices
                </>
              )}
            </Button>
          </TooltipWrapper>
        }
      />

      {/* Price Update Form */}
      {showForm && (
        <div className="max-w-4xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Update Fuel Prices
            </h2>
            <p className="text-sm text-muted-foreground">
              Set new prices that will apply to all stations
            </p>
          </div>
          <FuelPriceForm />
        </div>
      )}

      {/* Fuel Prices Table */}
      <div>
        <FuelPriceTable />
      </div>
    </div>
  );
}
