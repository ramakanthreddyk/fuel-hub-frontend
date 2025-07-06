/**
 * @file StationSettingsPage.tsx
 * @description Station settings page component
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useStation, useUpdateStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';

export default function StationSettingsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: station, isLoading } = useStation(stationId!);
  const updateStation = useUpdateStation();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when station data loads
  React.useEffect(() => {
    if (station) {
      setName(station.name || '');
      setAddress(station.address || '');
    }
  }, [station]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationId) return;
    
    setIsSubmitting(true);
    try {
      await updateStation.mutateAsync({
        id: stationId,
        data: { name, address }
      });
      
      toast({
        title: 'Success',
        description: 'Station settings updated successfully'
      });
      
      navigate(`/dashboard/stations/${stationId}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update station settings',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Station not found</h2>
        <Button onClick={() => navigate('/dashboard/stations')}>
          Back to Stations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/stations/${stationId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Station
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Station Settings</h1>
          <p className="text-muted-foreground">Manage {station.name} configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Station Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter station name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter station address"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/dashboard/stations/${stationId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}