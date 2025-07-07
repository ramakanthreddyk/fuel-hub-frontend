/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/core/apiClient';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNozzle } from '@/hooks/api/useNozzles';

export default function NewReadingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { nozzleId } = useParams<{ nozzleId: string }>();
  const [reading, setReading] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [creditorId, setCreditorId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: nozzle, isLoading: nozzleLoading, isError: nozzleError } = useNozzle(nozzleId);

  useEffect(() => {
    if (nozzleError) {
      toast({
        title: 'Error',
        description: 'Failed to load nozzle details',
        variant: 'destructive'
      });
      navigate('/dashboard/readings');
    }
  }, [nozzleError, navigate, toast]);

  const createReadingMutation = useMutation({
    mutationFn: async () => {
      if (!nozzleId || reading === undefined) {
        throw new Error('Nozzle ID and reading are required');
      }

      setIsSubmitting(true);

      const response = await apiClient.post('/readings', {
        nozzleId: nozzleId,
        reading: reading,
        paymentMethod: paymentMethod,
        creditorId: creditorId,
        notes: notes
      });

      setIsSubmitting(false);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Reading created successfully',
      });
      navigate('/dashboard/readings');
    },
    onError: (error: any) => {
      setIsSubmitting(false);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create reading',
          variant: 'destructive',
        });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createReadingMutation.mutate();
  };

  if (nozzleLoading) {
    return <div>Loading...</div>;
  }

  if (!nozzle) {
    return <div>Nozzle not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/readings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Readings
        </Button>
        <h1 className="text-2xl font-bold">New Reading for Nozzle #{nozzle.nozzleNumber}</h1>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Enter Reading Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reading">Current Reading</Label>
              <Input
                id="reading"
                type="number"
                placeholder="Enter current reading"
                value={reading === undefined ? '' : reading.toString()}
                onChange={(e) => setReading(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                type="text"
                placeholder="Enter payment method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditorId">Creditor ID (if applicable)</Label>
              <Input
                id="creditorId"
                type="text"
                placeholder="Enter creditor ID"
                value={creditorId}
                onChange={(e) => setCreditorId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                type="text"
                placeholder="Enter any notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Reading
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
