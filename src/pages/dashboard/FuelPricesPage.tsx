
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, RefreshCw } from 'lucide-react';
import { FuelPriceTable } from '@/components/fuel-prices/FuelPriceTable';
import { FuelPriceForm } from '@/components/fuel-prices/FuelPriceForm';
import { PageHeader } from '@/components/ui/page-header';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { useFuelPrices } from '@/hooks/useFuelPrices';

/**
 * Fuel Prices management page
 * 
 * Features:
 * - Toggle between table view and form
 * - Responsive layout for mobile/tablet/desktop
 * - Real-time data with refresh capability
 * - Clear user feedback and navigation
 */
export default function FuelPricesPage() {
  const [showForm, setShowForm] = useState(false);
  const { refetch, isLoading } = useFuelPrices();

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel Prices"
        description="Manage and monitor fuel pricing across all stations"
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <TooltipWrapper content="Refresh fuel prices">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                aria-label="Refresh fuel prices"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </TooltipWrapper>
            
            <TooltipWrapper 
              content={showForm ? "Cancel price update" : "Update fuel prices"}
            >
              <Button 
                onClick={handleToggleForm}
                variant={showForm ? 'outline' : 'default'}
                size="sm"
                aria-label={showForm ? 'Cancel price update' : 'Update fuel prices'}
              >
                {showForm ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Update Prices</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </Button>
            </TooltipWrapper>
          </div>
        }
      />

      {/* Price Update Form */}
      {showForm && (
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Update Fuel Prices
            </h2>
            <p className="text-sm text-muted-foreground">
              Set new prices that will apply to the selected station
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
