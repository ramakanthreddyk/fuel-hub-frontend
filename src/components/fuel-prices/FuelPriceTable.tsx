
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFuelPrices } from '@/hooks/useFuelPrices';
import { format } from 'date-fns';
import { Edit, Fuel } from 'lucide-react';

export function FuelPriceTable() {
  const { data: fuelPrices = [], isLoading } = useFuelPrices();

  if (isLoading) {
    return <div>Loading fuel prices...</div>;
  }

  if (!fuelPrices || !Array.isArray(fuelPrices) || fuelPrices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">No fuel prices configured</p>
        </CardContent>
      </Card>
    );
  }

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'bg-green-100 text-green-800';
      case 'diesel': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Fuel Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(fuelPrices) && fuelPrices.map((price) => (
            <div key={price.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Fuel className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getFuelTypeColor(price.fuelType)}>
                      {price.fuelType.charAt(0).toUpperCase() + price.fuelType.slice(1)}
                    </Badge>
                    {price.stationName && (
                      <span className="text-sm text-muted-foreground">
                        • {price.stationName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valid from: {format(new Date(price.validFrom), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">₹{price.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">per litre</div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
