/**
 * @file ReconciliationPage.tsx
 * @description Reconciliation summary page for owners/managers
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, AlertTriangle, Eye, Play, Loader2 } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Reconciliation {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  totalSales: number;
  cashTotal: number;
  cardTotal: number;
  upiTotal: number;
  creditTotal: number;
  finalized: boolean;
}

export default function ReconciliationPage() {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stations = [] } = useStations();

  const { data: reconciliations = [], isLoading } = useQuery({
    queryKey: ['reconciliations', selectedStation],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStation !== 'all') params.append('stationId', selectedStation);
      
      const response = await apiClient.get(`/reconciliation/list?${params.toString()}`);
      return response.data.data || response.data || [];
    }
  });

  const triggerReconciliation = useMutation({
    mutationFn: async ({ stationId, date }: { stationId: string; date: string }) => {
      console.log('[RECONCILIATION] Triggering reconciliation for:', { stationId, date });
      const response = await apiClient.post('/reconciliation/run', { stationId, date });
      console.log('[RECONCILIATION] Response received:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[RECONCILIATION] Success:', data);
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
      toast({
        title: 'Success',
        description: 'Reconciliation completed successfully'
      });
    },
    onError: (error: any) => {
      console.error('[RECONCILIATION] Error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to run reconciliation',
        variant: 'destructive'
      });
    }
  });

  const getStatusBadge = (reconciliation: Reconciliation) => {
    const totalReported = reconciliation.cashTotal + reconciliation.cardTotal + reconciliation.upiTotal;
    const difference = Math.abs(reconciliation.totalSales - totalReported);
    
    if (difference < 1) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Matched</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Mismatch</Badge>;
    }
  };

  const handleTriggerReconciliation = (stationId: string) => {
    const today = new Date().toISOString().split('T')[0];
    triggerReconciliation.mutate({ stationId, date: today });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reconciliation</h1>
          <p className="text-muted-foreground">Compare sales vs cash reports</p>
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {stations.slice(0, 3).map((station) => (
          <Card key={station.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{station.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleTriggerReconciliation(station.id)}
                disabled={triggerReconciliation.isPending}
                className="w-full"
                size="sm"
              >
                {triggerReconciliation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run Today's Reconciliation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reconciliation History */}
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
                  <TableHead>Cash Reported</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliations.map((recon: Reconciliation) => {
                  const totalReported = recon.cashTotal + recon.cardTotal + recon.upiTotal;
                  const difference = recon.totalSales - totalReported;
                  
                  return (
                    <TableRow key={recon.id}>
                      <TableCell>{formatDate(recon.date)}</TableCell>
                      <TableCell>{recon.stationName}</TableCell>
                      <TableCell>{formatCurrency(recon.totalSales)}</TableCell>
                      <TableCell>{formatCurrency(totalReported)}</TableCell>
                      <TableCell className={difference !== 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {difference > 0 ? '+' : ''}{formatCurrency(difference)}
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
                  );
                })}
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
    </div>
  );
}