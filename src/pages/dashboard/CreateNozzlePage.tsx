/**
 * @file CreateNozzlePage.tsx
 * @description Create nozzle page component
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for nozzle management
 */
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePump } from '@/hooks/api/usePumps';
import { useCreateNozzle } from '@/hooks/api/useNozzles';

export default function CreateNozzlePage() {
  const navigate = useNavigate();
  const { stationId, pumpId } = useParams<{ stationId: string; pumpId: string }>();
  
  const [nozzleNumber, setNozzleNumber] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch pump details
  const { data: pump, isLoading: pumpLoading } = usePump(pumpId || '');
  
  // Create nozzle mutation
  const createNozzleMutation = useCreateNozzle();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pumpId || !nozzleNumber || !fuelType) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createNozzleMutation.mutateAsync({
        pumpId,
        nozzleNumber: parseInt(nozzleNumber),
        fuelType: fuelType as 'petrol' | 'diesel' | 'premium',
        status: 'active'
      });
      
      // Navigate back to nozzles page
      navigate(`/dashboard/stations/${stationId}/pumps/${pumpId}/nozzles`);
    } catch (error) {
      console.error('Error creating nozzle:', error);
      setIsSubmitting(false);
    }
  };
  
  if (pumpLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/dashboard/stations/${stationId}/pumps/${pumpId}/nozzles`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Nozzle</h1>
          <p className="text-muted-foreground">
            {pump?.name ? `For pump: ${pump.name}` : ''}
          </p>
        </div>
      </div>
      
      {/* Create Nozzle Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nozzle Details</CardTitle>
          <CardDescription>
            Enter the details for the new nozzle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nozzleNumber">Nozzle Number</Label>
              <Input
                id="nozzleNumber"
                type="number"
                placeholder="Enter nozzle number"
                value={nozzleNumber}
                onChange={(e) => setNozzleNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select
                value={fuelType}
                onValueChange={setFuelType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/dashboard/stations/${stationId}/pumps/${pumpId}/nozzles`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !nozzleNumber || !fuelType}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Nozzle'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}