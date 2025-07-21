
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCreditor } from '@/hooks/useCreditors';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import type { CreateCreditorRequest } from '@/api/api-contract';

interface CreditorFormProps {
  onSuccess?: () => void;
}

export function CreditorForm({ onSuccess }: CreditorFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCreditorRequest>();
  const createCreditor = useCreateCreditor();
  const { toast } = useToast();
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const [selectedStationId, setSelectedStationId] = useState<string>('none');

  // Handle station selection
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    // Only set stationId if not 'none'
    if (value === 'none') {
      setValue('stationId', undefined);
    } else {
      setValue('stationId', value);
    }
  };

  const onSubmit = async (data: CreateCreditorRequest) => {
    try {
      // Validate credit limit
      if (data.creditLimit && data.creditLimit > 9999999) {
        toast({
          title: 'Invalid Credit Limit',
          description: 'Credit limit cannot exceed 9,999,999',
          variant: 'destructive',
        });
        return;
      }
      
      // Create a clean copy of the data
      const submitData = { ...data };
      
      // Handle stationId properly
      if (selectedStationId === 'none' || !selectedStationId) {
        delete submitData.stationId;
      }
      
      const result = await createCreditor.mutateAsync(submitData);
      toast({
        title: 'Success',
        description: `Creditor ${data.partyName} has been successfully added.`,
        variant: 'success',
      });
      reset();
      setSelectedStationId('none');
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to create creditor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create creditor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Creditor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partyName">Party Name *</Label>
              <Input
                id="partyName"
                {...register('partyName', { required: 'Party name is required' })}
                placeholder="Enter party name"
              />
              {errors.partyName && (
                <p className="text-sm text-red-600">{errors.partyName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="stationId">Station</Label>
              <Select value={selectedStationId} onValueChange={handleStationChange}>
                <SelectTrigger id="stationId">
                  <SelectValue placeholder="Select station (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific station</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                {...register('contactPerson')}
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
              <Input
                id="creditLimit"
                type="number"
                {...register('creditLimit', { 
                  valueAsNumber: true,
                  max: { value: 9999999, message: 'Credit limit cannot exceed 9,999,999' }
                })}
                placeholder="Enter credit limit"
                min="0"
                max="9999999"
                step="0.01"
              />
              {errors.creditLimit && (
                <p className="text-sm text-red-600">{errors.creditLimit.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Maximum allowed: 9,999,999</p>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              {...register('paymentTerms')}
              placeholder="e.g., Net 30 days"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={createCreditor.isPending}
            className="w-full"
          >
            {createCreditor.isPending ? 'Creating...' : 'Create Creditor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
