/**
 * @file FuelPriceCards.tsx
 * @description Simplified card view for fuel prices
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Fuel, AlertCircle, Loader2, Plus } from 'lucide-react';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useStations } from '@/hooks/api/useStations';
import { formatPrice } from '@/utils/formatters';
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

  // Group prices by station
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
  
  // Then add the latest price for each fuel type
  fuelPrices.forEach(price => {
    if (!stationPrices.has(price.stationId)) {
      // If station not found in our map, create an entry
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

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'bg-green-100 text-green-800 border-green-200';
      case 'diesel': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (stationPricesArray.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No stations configured</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stationPricesArray.map(({ station, prices }) => (
        <Card key={station.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              {station.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {/* Petrol */}
              <div className="flex items-center justify-between">
                <Badge className={getFuelTypeColor('petrol')}>Petrol</Badge>
                {prices.petrol ? (
                  <div className="font-bold text-lg">₹{formatPrice(prices.petrol.price)}</div>
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              {/* Diesel */}
              <div className="flex items-center justify-between">
                <Badge className={getFuelTypeColor('diesel')}>Diesel</Badge>
                {prices.diesel ? (
                  <div className="font-bold text-lg">₹{formatPrice(prices.diesel.price)}</div>
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              {/* Premium */}
              <div className="flex items-center justify-between">
                <Badge className={getFuelTypeColor('premium')}>Premium</Badge>
                {prices.premium ? (
                  <div className="font-bold text-lg">₹{formatPrice(prices.premium.price)}</div>
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(`/dashboard/fuel-prices?stationId=${station.id}`)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {Object.values(prices).every(p => p) ? 'Update Prices' : 'Set Missing Prices'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}