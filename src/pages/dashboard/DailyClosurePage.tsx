import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Plus } from 'lucide-react';
import { DailyClosureCard } from '@/components/reconciliation/DailyClosureCard';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/api/core/apiClient';

interface DailyClosureData {
  id: string;
  stationId: string;
  stationName: string;
  closureDate: string;
  systemSalesAmount: number;
  systemSalesVolume: number;
  systemTransactionCount: number;
  reportedCashAmount: number;
  varianceAmount: number;
  varianceReason?: string;
  isClosed: boolean;
  closedBy?: string;
  closedAt?: string;
}

export default function DailyClosurePage() {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch stations
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const response = await apiClient.get('/stations');
      return response.data?.data || response.data || [];
    }
  });

  // Fetch open days
  const { data: openDays = [], isLoading } = useQuery({
    queryKey: ['daily-closure', 'open', selectedStation],
    queryFn: async () => {
      const url = selectedStation 
        ? `/daily-closure/open?stationId=${selectedStation}`
        : '/daily-closure/open';
      const response = await apiClient.get(url);
      return response.data?.data?.openDays || [];
    }
  });

  // Fetch specific day summary
  const { data: daySummary, refetch: refetchSummary } = useQuery({
    queryKey: ['daily-closure', 'summary', selectedStation, selectedDate],
    queryFn: async () => {
      if (!selectedStation || !selectedDate) return null;
      const response = await apiClient.get(`/daily-closure/summary/${selectedStation}/${selectedDate}`);
      return response.data?.data || response.data;
    },
    enabled: !!selectedStation && !!selectedDate
  });

  // Close business day mutation
  const closeDayMutation = useMutation({
    mutationFn: async ({ stationId, date, cashAmount, reason }: {
      stationId: string;
      date: string;
      cashAmount: number;
      reason?: string;
    }) => {
      const response = await apiClient.post('/daily-closure/close', {
        stationId,
        closureDate: date,
        reportedCashAmount: cashAmount,
        varianceReason: reason
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Business Day Closed',
        description: 'The business day has been successfully closed.',
      });
      queryClient.invalidateQueries({ queryKey: ['daily-closure'] });
      refetchSummary();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to close business day',
        variant: 'destructive',
      });
    }
  });

  const handleCloseDay = async (stationId: string, date: string, cashAmount: number, reason?: string) => {
    await closeDayMutation.mutateAsync({ stationId, date, cashAmount, reason });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Business Closure</h1>
          <p className="text-muted-foreground">Close business days and reconcile cash vs system sales</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Station</label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Stations</SelectItem>
              {stations.map((station: any) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <Button 
          onClick={() => refetchSummary()}
          disabled={!selectedStation || !selectedDate}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Load Day
        </Button>
      </div>

      {/* Open Days Alert */}
      {openDays.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {openDays.length} open business day{openDays.length > 1 ? 's' : ''} that need to be closed.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Day Summary */}
      {daySummary && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {daySummary.stationName} - {selectedDate}
          </h2>
          <DailyClosureCard
            data={daySummary}
            onClose={handleCloseDay}
            isLoading={closeDayMutation.isPending}
          />
        </div>
      )}

      {/* Open Days List */}
      {openDays.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Open Business Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openDays.map((day: DailyClosureData) => (
              <DailyClosureCard
                key={`${day.stationId}-${day.closureDate}`}
                data={day}
                onClose={handleCloseDay}
                isLoading={closeDayMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      )}
    </div>
  );
}