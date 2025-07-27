
/**
 * @file components/sales/SalesTable.tsx
 * @description Fully responsive table component for displaying sales data
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Fuel, DollarSign } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { Sale } from '@/api/services/salesService';
import { formatCurrency, formatVolume, formatDateTime } from '@/utils/formatters';

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
}

export function SalesTable({ sales, isLoading }: SalesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FuelLoader size="md" text="Loading sales data..." />
        <span className="ml-2 text-muted-foreground">Loading sales...</span>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">No sales found</p>
        <p className="text-sm text-muted-foreground">
          Sales are automatically generated when readings are recorded
        </p>
      </div>
    );
  }

  const getFuelTypeColor = (fuelType: string) => {
    if (!fuelType) return 'bg-gray-100 text-gray-800 border-gray-200';
    switch (fuelType.toLowerCase()) {
      case 'petrol': return 'bg-green-100 text-green-800 border-green-200';
      case 'diesel': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    if (!method) return 'bg-gray-100 text-gray-800';
    switch (method.toLowerCase()) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      case 'credit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-slate-50">
            <tr className="border-b-2 border-blue-200">
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[150px]">Station/Pump</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[100px]">Nozzle</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[80px]">Volume</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[80px]">Price</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[100px]">Amount</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[80px]">Payment</th>
              <th className="text-left p-4 font-semibold text-blue-900 min-w-[120px]">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={sale.id} className={`border-b hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="p-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{sale.station_name || sale.stationName || 'Unknown Station'}</div>
                      <div className="text-sm text-muted-foreground truncate">{sale.pump_name || sale.pumpName || 'Unknown Pump'}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Fuel className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">#{sale.nozzle_number || sale.nozzleNumber || 'N/A'}</div>
                      <Badge className={`text-xs font-medium ${getFuelTypeColor(sale.fuel_type || sale.fuelType)}`}>
                        {(sale.fuel_type || sale.fuelType || '').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-blue-700">{formatVolume(sale.volume)}</div>
                  <div className="text-xs text-muted-foreground">Liters</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold">{formatCurrency(sale.fuel_price || sale.fuelPrice || 0)}</div>
                  <div className="text-xs text-muted-foreground">per liter</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-xl text-green-600">
                    {formatCurrency(sale.amount)}
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`${getPaymentMethodColor(sale.payment_method || sale.paymentMethod)} font-medium`}>
                    {(sale.payment_method || sale.paymentMethod || '').toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium">{formatDateTime(sale.recorded_at || sale.recordedAt)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards - Visible on smaller screens */}
      <div className="lg:hidden space-y-4 p-4">
        {sales.map((sale, index) => (
          <Card key={sale.id} className="w-full shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              {/* Header with Station and Amount */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{sale.station_name || sale.stationName || 'Unknown Station'}</div>
                    <div className="text-xs text-muted-foreground truncate">{sale.pump_name || sale.pumpName || 'Unknown Pump'}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-bold text-lg text-green-600">
                    {formatCurrency(sale.amount)}
                  </div>
                  <Badge className={`${getPaymentMethodColor(sale.payment_method || sale.paymentMethod)} text-xs`}>
                    {(sale.payment_method || sale.paymentMethod || '').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-xs">Nozzle:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-medium">#{sale.nozzle_number || sale.nozzleNumber || 'N/A'}</span>
                    <Badge className={`${getFuelTypeColor(sale.fuel_type || sale.fuelType)} text-xs`}>
                      {sale.fuel_type || sale.fuelType}
                    </Badge>
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-xs">Volume:</span>
                  <div className="font-medium mt-1 truncate">{formatVolume(sale.volume)}</div>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-xs">Price:</span>
                  <div className="font-medium mt-1 truncate">{formatCurrency(sale.fuel_price || sale.fuelPrice || 0)}/L</div>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-xs">Date:</span>
                  <div className="font-medium mt-1 text-xs truncate">{formatDateTime(sale.recorded_at || sale.recordedAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
