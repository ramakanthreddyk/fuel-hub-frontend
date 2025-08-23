
/**
 * @file FuelPriceCards.tsx
 * @description Improved card view for fuel prices with proper price display
 */
import { SafeText } from '@/components/ui/SafeHtml';
import { secureLog } from '@/utils/security';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Fuel, AlertCircle, Plus, Edit } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useStations } from '@/hooks/api/useStations';
import { useNavigate } from 'react-router-dom';

export function FuelPriceCards() {
  const navigate = useNavigate();
  const { data: fuelPricesRaw, isLoading, error } = useFuelPrices();
  const { data: stationsRaw } = useStations();

  // Defensive: ensure arrays
  const fuelPrices: Array<any> = Array.isArray(fuelPricesRaw) ? fuelPricesRaw : [];
  const stations: Array<any> = Array.isArray(stationsRaw) ? stationsRaw : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <FuelLoader size="md" text="Loading fuel prices..." />
          <span className="ml-2 text-muted-foreground">Loading fuel prices...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Error Loading Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-muted-foreground text-center py-4">
              Failed to load fuel prices: {error.message}
            </p>
          )}
          <div className="flex justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  secureLog.debug('[FUEL-PRICE-CARDS] Fuel prices:', fuelPrices);
  secureLog.debug('[FUEL-PRICE-CARDS] Stations:', stations);
  
  // Group prices by station and get the latest price for each fuel type
  const stationPrices = new Map();
  
  // First, organize all stations
  stations.forEach(station => {
    stationPrices.set(station.id, {
      station,
      prices: {
        petrol: null,
        diesel: null,
        premium: null
      }
    });
  });
  
  // Then add the latest price for each fuel type per station
  fuelPrices.forEach(price => {
    secureLog.debug('[FUEL-PRICE-CARDS] Processing price:', price);
    // Defensive checks and sanitization
    const safeStationId = typeof price.stationId === 'string' ? price.stationId.replace(/[^\w-]/g, '') : '';
    const safeStationName = typeof price.stationName === 'string' ? price.stationName.replace(/<[^>]*>/g, '') : 'Unknown Station';
    const safeFuelType = typeof price.fuelType === 'string' ? price.fuelType : '';
    const safeValidFrom = price.validFrom ? new Date(price.validFrom) : new Date();
    if (!stationPrices.has(safeStationId)) {
      stationPrices.set(safeStationId, {
        station: { id: safeStationId, name: safeStationName },
        prices: {
          petrol: null,
          diesel: null,
          premium: null
        }
      });
    }
    const stationData = stationPrices.get(safeStationId);
    // Only update if this is a newer price or no price exists yet
    if (!stationData.prices[safeFuelType] || safeValidFrom > new Date(stationData.prices[safeFuelType]?.validFrom)) {
      stationData.prices[safeFuelType] = price;
    }
  });
  
  // Convert map to array for rendering
  const stationPricesArray = Array.from(stationPrices.values());

  secureLog.debug('[FUEL-PRICE-CARDS] Station prices array:', stationPricesArray);

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      case 'diesel': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (stationPricesArray.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No stations found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first station to get started
          </p>
          <Button onClick={() => navigate('/dashboard/stations/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stationPricesArray.map(({ station, prices }) => (
        <Card key={station.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              {<SafeText text={station.name} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Petrol */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <Badge className={getFuelTypeColor('petrol')}>Petrol</Badge>
                </div>
                {prices.petrol ? (
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-700 dark:text-green-300">₹{prices.petrol.price}</div>
                    <div className="text-xs text-green-600 dark:text-green-400">per litre</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not set</div>
                )}
              </div>
              
              {/* Diesel */}
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <Badge className={getFuelTypeColor('diesel')}>Diesel</Badge>
                </div>
                {prices.diesel ? (
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-700 dark:text-blue-300">₹{prices.diesel.price}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">per litre</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not set</div>
                )}
              </div>
              
              {/* Premium */}
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <Badge className={getFuelTypeColor('premium')}>Premium</Badge>
                </div>
                {prices.premium ? (
                  <div className="text-right">
                    <div className="font-bold text-lg text-purple-700 dark:text-purple-300">₹{prices.premium.price}</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">per litre</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not set</div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  // Use window.location.href to force a full page reload with the new parameters
                  window.location.href = `/dashboard/fuel-prices?stationId=${encodeURIComponent(String(station.id))}&showForm=true`;
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Update Prices
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
