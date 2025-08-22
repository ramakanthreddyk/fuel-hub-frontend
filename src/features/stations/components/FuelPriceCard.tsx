
/**
 * @file components/stations/FuelPriceCard.tsx  
 * @description Component to display fuel prices or warning if missing
 */
import { useNavigate } from 'react-router-dom';
import { useHasFuelPrices } from '@/hooks/api/useFuelPrices';
import { DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FuelPriceCardProps {
  stationId: string;
}

export function FuelPriceCard({ stationId }: FuelPriceCardProps) {
  const navigate = useNavigate();
  const { hasFuelPrices, isLoading, fuelPrices } = useHasFuelPrices(stationId);
  
  console.log('[FUEL-PRICE-CARD] Station ID:', stationId);
  console.log('[FUEL-PRICE-CARD] Has fuel prices:', hasFuelPrices);
  console.log('[FUEL-PRICE-CARD] Fuel prices:', fuelPrices);
  
  if (isLoading) {
    return (
      <div className="bg-amber-50/80 dark:bg-amber-950/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
      </div>
    );
  }
  
  if (!hasFuelPrices || fuelPrices.length === 0) {
    return (
      <div className="bg-red-50/80 dark:bg-red-950/80 backdrop-blur-sm rounded-2xl p-4 border border-red-200/60 dark:border-red-800/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-red-500/20 ring-1 ring-red-400/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">Missing Prices</span>
        </div>
        <div className="text-sm text-red-800 dark:text-red-200 mb-2">
          Fuel prices not set
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
          onClick={() => navigate(`/dashboard/fuel-prices?stationId=${stationId}`)}
        >
          Set Prices
        </Button>
      </div>
    );
  }
  
  // Group prices by fuel type and get latest
  const pricesByType: Record<string, any> = {};
  fuelPrices.forEach(price => {
    if (!pricesByType[price.fuelType] || 
        new Date(price.validFrom) > new Date(pricesByType[price.fuelType].validFrom)) {
      pricesByType[price.fuelType] = price;
    }
  });
  
  const priceCount = Object.keys(pricesByType).length;
  
  return (
    <div className="bg-green-50/80 dark:bg-green-950/80 backdrop-blur-sm rounded-2xl p-4 border border-green-200/60 dark:border-green-800/60">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-green-500/20 ring-1 ring-green-400/30">
          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">Fuel Prices</span>
      </div>
      
      <div className="space-y-1 mb-3">
        {Object.entries(pricesByType).map(([fuelType, price]) => (
          <div key={fuelType} className="flex justify-between items-center text-sm">
            <span className="capitalize text-green-800 dark:text-green-200">{fuelType}:</span>
            <span className="font-semibold text-green-900 dark:text-green-100">₹{price.price}</span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-green-600 dark:text-green-400">
        {priceCount} fuel type{priceCount !== 1 ? 's' : ''} configured
      </div>
    </div>
  );
}
