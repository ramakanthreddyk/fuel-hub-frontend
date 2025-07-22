
/**
 * @file ReconciliationPage.tsx
 * @description Comprehensive reconciliation management page utilizing all backend features
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, AlertTriangle, Eye, Play, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { useReconciliationHistory, useCreateReconciliation, useDailyReadingsSummary } from '@/hooks/useReconciliation';
import { useReconciliationDiffs, useDiscrepancySummary } from '@/hooks/api/useReconciliationDiff';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ReconciliationRecord } from '@/api/api-contract';

export default function ReconciliationPage() {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const { data: stations = [] } = useStations();
  const { data: reconciliations = [], isLoading } = useReconciliationHistory(selectedStation !== 'all' ? selectedStation : undefined);
  const { data: discrepancySummary } = useDiscrepancySummary(
    selectedStation !== 'all' ? selectedStation : '',
    selectedDate
  );
  // Only fetch reconciliation diffs when a specific station is selected
  const { data: reconciliationDiffs = [] } = useReconciliationDiffs({
    stationId: selectedStation !== 'all' ? selectedStation : '',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const createReconciliation = useCreateReconciliation();

  const getStatusBadge = (reconciliation: ReconciliationRecord) => {
    const status = reconciliation.status || 'pending';
    
    if (status === 'matched') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Balanced</Badge>;
    } else if (status === 'variance') {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Variance</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const handleTriggerReconciliation = async (stationId: string, date: string = selectedDate) => {
    try {
      // For now, we'll pass minimal required data and let the backend calculate readings
      await createReconciliation.mutateAsync({ 
        stationId, 
        date,
        openingReading: 0, // Backend will calculate actual readings
        closingReading: 0, // Backend will calculate actual readings
        notes: `Reconciliation for ${date}`
      });
    } catch (error) {
      console.error('Failed to create reconciliation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reconciliation Management</h1>
          <p className="text-muted-foreground">Complete daily reconciliation and track discrepancies</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {stations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Discrepancy Summary Cards */}
      {discrepancySummary && selectedStation !== 'all' && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Total Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discrepancySummary.totalDiscrepancies}</div>
              <p className="text-xs text-muted-foreground">Active issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Over Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(discrepancySummary.totalOverReported, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Excess cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Under Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(discrepancySummary.totalUnderReported, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Missing cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Largest Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(discrepancySummary.largestDiscrepancy, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Single discrepancy</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reconciliations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reconciliations">Reconciliations</TabsTrigger>
          <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reconciliation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Expected Sales</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliations.map((recon: ReconciliationRecord) => (
                      <TableRow key={recon.id}>
                        <TableCell>{formatDate(recon.date)}</TableCell>
                        <TableCell>{recon.stationName}</TableCell>
                        <TableCell>{formatCurrency(recon.totalSales, { useLakhsCrores: true })}</TableCell>
                        <TableCell>{formatCurrency(recon.expectedSales || 0, { useLakhsCrores: true })}</TableCell>
                        <TableCell className={recon.variance !== 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {recon.variance > 0 ? '+' : ''}{formatCurrency(recon.variance || 0, { useLakhsCrores: true })}
                        </TableCell>
                        <TableCell>{getStatusBadge(recon)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/dashboard/reconciliation/${recon.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reconciliations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No reconciliations found. Run your first reconciliation to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discrepancies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Cash Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Reported Cash</TableHead>
                    <TableHead>Actual Cash</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationDiffs.map((diff) => (
                    <TableRow key={diff.id}>
                      <TableCell>{formatDate(diff.date)}</TableCell>
                      <TableCell>{diff.stationName}</TableCell>
                      <TableCell>{formatCurrency(diff.reportedCash, { useLakhsCrores: true })}</TableCell>
                      <TableCell>{formatCurrency(diff.actualCash, { useLakhsCrores: true })}</TableCell>
                      <TableCell className={diff.difference !== 0 ? (diff.difference > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                        {diff.difference > 0 ? '+' : ''}{formatCurrency(diff.difference, { useLakhsCrores: true })}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          diff.status === 'match' 
                            ? 'bg-green-100 text-green-800' 
                            : diff.status === 'over' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }>
                          {diff.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedStation === 'all' ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Please select a specific station to view discrepancies.
                      </TableCell>
                    </TableRow>
                  ) : reconciliationDiffs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No discrepancies found for the selected station.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <Card key={station.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{station.address}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleTriggerReconciliation(station.id)}
                      disabled={createReconciliation.isPending}
                      className="flex-1"
                      size="sm"
                    >
                      {createReconciliation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      Today's Reconciliation
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/dashboard/reconciliation/daily-summary?stationId=${station.id}&date=${selectedDate}`}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Daily Summary
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
