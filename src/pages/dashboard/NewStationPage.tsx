
/**
 * @file pages/dashboard/NewStationPage.tsx
 * @description Page for creating new stations with improved form layout
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, DollarSign } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
      const result = await createStation.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Station created successfully'
      });
      
      // Show a toast reminding to set fuel prices
      toast({
        title: 'Important',
        description: 'Remember to set fuel prices for this station',
        variant: 'default',
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dashboard/fuel-prices?stationId=${result.id}`)}
          >
            Set Prices
          </Button>
        )
      });
      
      // Navigate to fuel prices page directly
      navigate(`/dashboard/fuel-prices?stationId=${result.id}`);
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

      {/* Fuel Price Warning */}
      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important: Fuel Prices Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          After creating a station, you'll need to set fuel prices before readings can be recorded.
          You'll be redirected to the fuel prices page after station creation.
        </AlertDescription>
      </Alert>
      
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
