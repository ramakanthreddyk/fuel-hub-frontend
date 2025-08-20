
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNozzle, useUpdateNozzle } from '@/hooks/api/useNozzles';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function EditNozzlePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { nozzleId } = useParams<{ nozzleId: string }>();

  const stationId = searchParams.get('stationId');
  const pumpId = searchParams.get('pumpId');

  const { data: nozzle, isLoading } = useNozzle(nozzleId || '');
  const updateNozzle = useUpdateNozzle(); // Toast handling is now in the hook

  const [nozzleName, setNozzleName] = useState('');
  const [fuelType, setFuelType] = useState('');

  useEffect(() => {
    if (nozzle) {
      setNozzleName(nozzle.name);
      setFuelType(nozzle.fuelType);
    }
  }, [nozzle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nozzleId) return;
    
    try {
      await updateNozzle.mutateAsync({ 
        id: nozzleId, 
        data: { 
          name: nozzleName, 
          fuelType 
        } 
      });
      // Success toast is handled by the hook
      if (stationId && pumpId) {
        navigate(`/dashboard/nozzles?pumpId=${pumpId}&stationId=${stationId}`);
      } else {
        navigate('/dashboard/nozzles');
      }
    } catch (error: any) {
      // Error toast is handled by the hook
      console.error('Update failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const backUrl = stationId && pumpId ? `/dashboard/nozzles?pumpId=${pumpId}&stationId=${stationId}` : '/dashboard/nozzles';

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to={backUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Edit Nozzle</h1>
          <p className="text-muted-foreground text-sm">Update nozzle details</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Nozzle Details</CardTitle>
          <CardDescription className="text-sm">Modify the nozzle information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nozzleName" className="text-sm font-medium">
                  Nozzle Name
                </Label>
                <Input
                  id="nozzleName"
                  type="text"
                  placeholder="Enter nozzle name"
                  value={nozzleName}
                  onChange={(e) => setNozzleName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type
                </Label>
                <Select value={fuelType} onValueChange={setFuelType} required>
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
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(backUrl)} className="order-2 sm:order-1">
                Cancel
              </Button>
              <Button type="submit" disabled={updateNozzle.isPending} className="order-1 sm:order-2">
                {updateNozzle.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
