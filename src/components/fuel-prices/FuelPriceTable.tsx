
/**
 * @file FuelPriceTable.tsx
 * @description Table component for displaying fuel prices with dialog accessibility
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Edit, Trash2, Building2, Fuel, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Import new API hooks
import { useFuelPrices, useDeleteFuelPrice } from '@/hooks/api/useFuelPrices';
import { useStations } from '@/hooks/api/useStations';

export function FuelPriceTable() {
  const { data: fuelPrices = [], isLoading, error } = useFuelPrices();
  const { data: stations = [] } = useStations();
  const deleteFuelPrice = useDeleteFuelPrice();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Current Fuel Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading fuel prices...</span>
          </div>
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

  if (!fuelPrices || !Array.isArray(fuelPrices) || fuelPrices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Current Fuel Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No fuel prices configured</p>
            <p className="text-sm text-muted-foreground">
              Add your first fuel price to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'diesel': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStationName = (stationId: string, stationName?: string) => {
    // First try to use the stationName from the price object
    if (stationName) return stationName;
    
    // Fallback to looking up in stations array
    const station = stations?.find(s => s.id === stationId);
    return station?.name || 'Unknown Station';
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFuelPrice.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete fuel price:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to safely format price
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } else {
      console.warn('Invalid price format:', price);
      return '0.00';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Current Fuel Prices ({fuelPrices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Station</th>
                    <th className="text-left p-3 font-medium">Fuel Type</th>
                    <th className="text-left p-3 font-medium">Price</th>
                    <th className="text-left p-3 font-medium">Valid From</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelPrices.map((price) => (
                    <tr key={price.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{getStationName(price.stationId, price.stationName)}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getFuelTypeColor(price.fuelType)}>
                          {price.fuelType.charAt(0).toUpperCase() + price.fuelType.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-lg">₹{formatPrice(price.price)}</div>
                        <div className="text-xs text-muted-foreground">per litre</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {format(new Date(price.validFrom), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(price.validFrom), 'HH:mm')}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                disabled={deletingId === price.id}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {deletingId === price.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Fuel Price</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this fuel price for {price.fuelType} at {getStationName(price.stationId, price.stationName)}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(price.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {fuelPrices.map((price) => (
              <Card key={price.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{getStationName(price.stationId, price.stationName)}</span>
                  </div>
                  <Badge className={getFuelTypeColor(price.fuelType)}>
                    {price.fuelType.charAt(0).toUpperCase() + price.fuelType.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold">₹{formatPrice(price.price)}</div>
                    <div className="text-xs text-muted-foreground">per litre</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(price.validFrom), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(price.validFrom), 'HH:mm')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        disabled={deletingId === price.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingId === price.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Fuel Price</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this fuel price for {price.fuelType} at {getStationName(price.stationId, price.stationName)}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(price.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
