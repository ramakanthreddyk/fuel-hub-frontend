
/**
 * @file FuelPriceCards.tsx
 * @description Improved card view for fuel prices with proper price display
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Fuel, AlertCircle, Loader2, Plus, Edit } from 'lucide-react';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useStations } from '@/hooks/api/useStations';
import { formatCurrency } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export function FuelPriceCards() {
  const navigate = useNavigate();
  const { data: fuelPrices = [], isLoading, error } = useFuelPrices();
  const { data: stations = [] } = useStations();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
          <p className="text-muted-foreground text-center py-4">
            Failed to load fuel prices: {(error as Error).message}
          </p>
          <div className="flex justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('[FUEL-PRICE-CARDS] Fuel prices:', fuelPrices);
  console.log('[FUEL-PRICE-CARDS] Stations:', stations);
  
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
    console.log('[FUEL-PRICE-CARDS] Processing price:', price);
    
    if (!stationPrices.has(price.stationId)) {
      // If station not found in our map, create an entry using stationName from price
      stationPrices.set(price.stationId, {
        station: { id: price.stationId, name: price.stationName || 'Unknown Station' },
        prices: {
          petrol: null,
          diesel: null,
          premium: null
        }
      });
    }
    
    const stationData = stationPrices.get(price.stationId);
    
    // Only update if this is a newer price or no price exists yet
    if (!stationData.prices[price.fuelType] || 
        new Date(price.validFrom) > new Date(stationData.prices[price.fuelType].validFrom)) {
      stationData.prices[price.fuelType] = price;
    }
  });
  
  // Convert map to array for rendering
  const stationPricesArray = Array.from(stationPrices.values());

  console.log('[FUEL-PRICE-CARDS] Station prices array:', stationPricesArray);

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
              {station.name}
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
                  window.location.href = `/dashboard/fuel-prices?stationId=${station.id}&showForm=true`;
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
