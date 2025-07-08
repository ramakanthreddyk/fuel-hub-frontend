
/**
 * @file FuelPricesPage.tsx
 * @description Fuel prices management page
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for setting fuel prices
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, RefreshCw } from 'lucide-react';
import { FuelPriceCards } from '@/components/fuel-prices/FuelPriceCards';
import { FuelPriceForm } from '@/components/fuel-prices/FuelPriceForm';
import { PageHeader } from '@/components/ui/page-header';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Fuel Prices"
        description="Manage and monitor fuel pricing across all stations"
        actions={
          <div className="flex items-center gap-2">
            <TooltipWrapper content="Refresh fuel prices">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                aria-label="Refresh fuel prices"
                className="flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} sm:mr-2`} />
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
                className="flex-shrink-0"
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add</span>
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

      {/* Fuel Prices Cards */}
      <div>
        <FuelPriceCards />
      </div>
    </div>
  );
}
