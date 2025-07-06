/**
 * @file components/sales/SalesTable.tsx
 * @description Table component for displaying sales data
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Fuel, DollarSign } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Station/Pump</th>
              <th className="text-left p-3 font-medium">Nozzle</th>
              <th className="text-left p-3 font-medium">Volume</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Payment</th>
              <th className="text-left p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{sale.stationName}</div>
                      <div className="text-sm text-muted-foreground">{sale.pumpName}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">#{sale.nozzleNumber}</div>
                      <Badge className={getFuelTypeColor(sale.fuelType)}>
                        {sale.fuelType}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{formatVolume(sale.volume)}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{formatCurrency(sale.fuelPrice)}</div>
                  <div className="text-xs text-muted-foreground">per litre</div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-lg text-green-600">
                    {formatCurrency(sale.amount)}
                  </div>
                </td>
                <td className="p-3">
                  <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                    {sale.paymentMethod.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="text-sm">{formatDateTime(sale.recordedAt)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sales.map((sale) => (
          <Card key={sale.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">{sale.stationName}</div>
                  <div className="text-xs text-muted-foreground">{sale.pumpName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-600">
                  {formatCurrency(sale.amount)}
                </div>
                <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                  {sale.paymentMethod.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nozzle:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">#{sale.nozzleNumber}</span>
                  <Badge className={getFuelTypeColor(sale.fuelType)}>
                    {sale.fuelType}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Volume:</span>
                <div className="font-medium">{formatVolume(sale.volume)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <div className="font-medium">{formatCurrency(sale.fuelPrice)}/L</div>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <div className="font-medium">{formatDateTime(sale.recordedAt)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}