
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DailyReadingSummary } from '@/api/api-contract';

interface ReconciliationTableProps {
  readings: DailyReadingSummary[];
  isLoading?: boolean;
}

export function ReconciliationTable({ readings, isLoading }: ReconciliationTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!readings.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No readings found for the selected date.
      </div>
    );
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      case 'credit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nozzle</TableHead>
          <TableHead>Fuel Type</TableHead>
          <TableHead>Previous Reading</TableHead>
          <TableHead>Current Reading</TableHead>
          <TableHead>Delta (L)</TableHead>
          <TableHead>Price/Litre</TableHead>
          <TableHead>Sale Value</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Cash Declared</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((reading, index) => (
          <TableRow key={`${reading.nozzleId}-${index}`}>
            <TableCell className="font-medium">
              Nozzle #{reading.nozzleNumber}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{reading.fuelType}</Badge>
            </TableCell>
            <TableCell className="font-mono">
              {typeof reading.previousReading === 'number' ? reading.previousReading.toLocaleString() : (reading.openingReading ? reading.openingReading.toLocaleString() : 'N/A')}
            </TableCell>
            <TableCell className="font-mono">
              {typeof reading.currentReading === 'number' ? reading.currentReading.toLocaleString() : (reading.closingReading ? reading.closingReading.toLocaleString() : 'N/A')}
            </TableCell>
            <TableCell className="font-mono font-medium">
              {typeof reading.deltaVolume === 'number' ? reading.deltaVolume.toLocaleString() : (reading.totalVolume ? reading.totalVolume.toLocaleString() : 'N/A')}
            </TableCell>
            <TableCell className="font-mono">
              {reading.pricePerLitre ? `₹${Number(reading.pricePerLitre).toFixed(2)}` : 'N/A'}
            </TableCell>
            <TableCell className="font-mono font-medium">
              {reading.saleValue ? `₹${reading.saleValue.toLocaleString()}` : (reading.revenue ? `₹${reading.revenue.toLocaleString()}` : 'N/A')}
            </TableCell>
            <TableCell>
              {reading.paymentMethod ? (
                <Badge className={getPaymentMethodColor(reading.paymentMethod)}>
                  {reading.paymentMethod}
                </Badge>
              ) : 'N/A'}
            </TableCell>
            <TableCell className="font-mono">
              {reading.cashDeclared ? `₹${reading.cashDeclared.toLocaleString()}` : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
