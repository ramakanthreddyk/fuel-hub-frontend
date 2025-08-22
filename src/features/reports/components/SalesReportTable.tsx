
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SalesReportData } from '@/api/api-contract';
import { format } from 'date-fns';

interface SalesReportTableProps {
  data: SalesReportData[];
  isLoading?: boolean;
}

export function SalesReportTable({ data, isLoading }: SalesReportTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data found for the selected filters.
      </div>
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
          <TableHead>Date</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Nozzle</TableHead>
          <TableHead>Fuel Type</TableHead>
          <TableHead>Volume (L)</TableHead>
          <TableHead>Price/L</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Attendant</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-mono text-sm">
              {format(new Date(record.date), 'dd/MM/yy')}
            </TableCell>
            <TableCell className="font-medium">
              {record.stationName}
            </TableCell>
            <TableCell>
              Nozzle {record.nozzleNumber || record.nozzleName || 'N/A'}
            </TableCell>
            <TableCell>
              <Badge className={getFuelTypeColor(record.fuelType)}>
                {record.fuelType}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono">
              {typeof record.volume === 'number' ? record.volume.toLocaleString() : 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono">
              {record.pricePerLitre ? `₹${Number(record.pricePerLitre).toFixed(2)}` : 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono font-medium">
              {typeof record.amount === 'number' ? `₹${record.amount.toLocaleString()}` : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge className={getPaymentMethodColor(record.paymentMethod)}>
                {record.paymentMethod}
              </Badge>
            </TableCell>
            <TableCell>{record.attendant || record.attendantName || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
