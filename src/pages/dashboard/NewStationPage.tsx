
/**
 * @file pages/dashboard/NewStationPage.tsx
 * @description Page for creating new stations with improved form layout
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StationForm } from '@/components/stations/StationForm';
import { useCreateStation } from '@/hooks/api/useStations';
import { navigateBack } from '@/utils/navigation';

export default function NewStationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createStation = useCreateStation();

  const handleSubmit = async (data: any) => {
    try {
      await createStation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Station created successfully'
      });
      navigate('/dashboard/stations');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create station',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateBack(navigate, '/dashboard/stations')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stations
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Station</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Add a new fuel station to your network
          </p>
        </div>
      </div>

      {/* Station Form */}
      <StationForm
        onSubmit={handleSubmit}
        isLoading={createStation.isPending}
        title="New Station Details"
        description="Enter the station information below to add it to your network"
      />
    </div>
  );
}
