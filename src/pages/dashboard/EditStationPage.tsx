import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { StationForm } from '@/components/stations/StationForm';
import { useStation, useUpdateStation } from '@/hooks/api/useStations';

export default function EditStationPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: station, isLoading } = useStation(stationId || '');
  const updateStation = useUpdateStation();

  useEffect(() => {
    if (!stationId) navigate('/dashboard/stations');
  }, [stationId, navigate]);

  const handleSubmit = async (data: any) => {
    if (!stationId) return;
    try {
      await updateStation.mutateAsync({ id: stationId, data });
      toast({ title: 'Success', description: 'Station updated successfully' });
      navigate(`/dashboard/stations/${stationId}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update station',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/stations/${stationId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Station</h1>
          <p className="text-muted-foreground text-sm">Update station details</p>
        </div>
      </div>

      <StationForm
        onSubmit={handleSubmit}
        initialData={station}
        isLoading={updateStation.isPending}
        title="Station Details"
        description="Modify the station information below"
      />
    </div>
  );
}
