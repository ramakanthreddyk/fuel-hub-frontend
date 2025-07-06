/**
 * @file components/stations/FuelPriceCard.tsx
 * @description Component to display fuel prices or warning if missing
 */
import { useNavigate } from 'react-router-dom';
import { useHasFuelPrices } from '@/hooks/api/useFuelPrices';
import { DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatters';

interface FuelPriceCardProps {
  stationId: string;
}

export function FuelPriceCard({ stationId }: FuelPriceCardProps) {
  const navigate = useNavigate();
  const { hasFuelPrices, isLoading, fuelPrices } = useHasFuelPrices(stationId);
  
  // Get the latest price (if any)
  const latestPrice = fuelPrices.length > 0 
    ? fuelPrices.reduce((latest, price) => {
        const priceDate = new Date(price.validFrom);
        const latestDate = new Date(latest.validFrom);
        return priceDate > latestDate ? price : latest;
      }, fuelPrices[0])
    : null;
  
  if (isLoading) {
    return (
      <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/60 flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
      </div>
    );
  }
  
  if (!hasFuelPrices) {
    return (
      <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 border border-red-200/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-red-500/20 ring-1 ring-red-400/30">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <span className="text-sm font-semibold text-red-700">Missing Prices</span>
        </div>
        <div className="text-sm text-red-800 mb-2">
          Fuel prices not set
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs border-red-300 text-red-700 hover:bg-red-100"
          onClick={() => navigate(`/dashboard/fuel-prices?stationId=${stationId}`)}
        >
          Set Prices
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-green-50/80 backdrop-blur-sm rounded-2xl p-4 border border-green-200/60">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-green-500/20 ring-1 ring-green-400/30">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <span className="text-sm font-semibold text-green-700">Fuel Prices</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {latestPrice ? formatPrice(latestPrice.price) : 'N/A'}
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {latestPrice ? latestPrice.fuelType : 'No prices set'}
      </div>
    </div>
  );
}