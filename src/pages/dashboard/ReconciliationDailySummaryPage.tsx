
/**
 * @file ReconciliationDailySummaryPage.tsx
 * @description Daily readings summary page for reconciliation
 */
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Fuel, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { useDailyReadingsSummary } from '@/hooks/useReconciliation';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function ReconciliationDailySummaryPage() {
  const [searchParams] = useSearchParams();
  const [stationId, setStationId] = useState(searchParams.get('stationId') || '');
  const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);

  const { data: stations = [] } = useStations();
  const { data: dailySummary = [], isLoading } = useDailyReadingsSummary(stationId, date);

  const selectedStation = stations.find(s => s.id === stationId);

  const totals = dailySummary.reduce((acc, reading) => ({
    volume: acc.volume + (reading.volume || 0),
    revenue: acc.revenue + (reading.saleValue || 0),
    cashDeclared: acc.cashDeclared + (reading.cashDeclared || 0)
  }), { volume: 0, revenue: 0, cashDeclared: 0 });

  const variance = totals.revenue - totals.cashDeclared;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/reconciliation">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reconciliation
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Daily Readings Summary</h1>
          <p className="text-muted-foreground">
            Per-nozzle breakdown for {selectedStation?.name || 'Selected Station'} on {formatDate(date)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="station">Station</Label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.volume.toFixed(2)}L</div>
            <p className="text-xs text-muted-foreground">Fuel dispensed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Expected Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.revenue)}</div>
            <p className="text-xs text-muted-foreground">From sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cash Declared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.cashDeclared)}</div>
            <p className="text-xs text-muted-foreground">By attendants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${variance !== 0 ? (variance > 0 ? 'text-red-600' : 'text-green-600') : 'text-green-600'}`}>
              {variance > 0 ? '+' : ''}{formatCurrency(variance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {variance === 0 ? 'Balanced' : variance > 0 ? 'Shortfall' : 'Excess'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Nozzle-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nozzle</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Opening Reading</TableHead>
                <TableHead>Closing Reading</TableHead>
                <TableHead>Volume (L)</TableHead>
                <TableHead>Price/L</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Cash Declared</TableHead>
                <TableHead>Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailySummary.map((reading) => {
                const nozzleVariance = (reading.saleValue || 0) - (reading.cashDeclared || 0);
                return (
                  <TableRow key={reading.nozzleId}>
                    <TableCell className="font-medium">
                      Nozzle {reading.nozzleNumber || 'N/A'}
                    </TableCell>
                    <TableCell>{reading.fuelType}</TableCell>
                    <TableCell>{reading.openingReading?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{reading.closingReading?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{reading.volume?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{formatCurrency(reading.pricePerLitre || 0)}</TableCell>
                    <TableCell>{formatCurrency(reading.saleValue || 0)}</TableCell>
                    <TableCell>{formatCurrency(reading.cashDeclared || 0)}</TableCell>
                    <TableCell className={nozzleVariance !== 0 ? (nozzleVariance > 0 ? 'text-red-600' : 'text-green-600') : ''}>
                      {nozzleVariance > 0 ? '+' : ''}{formatCurrency(nozzleVariance)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {dailySummary.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading...' : 'No readings found for the selected station and date.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
