
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useReading, useUpdateReading } from '@/hooks/api/useReadings';
import { useToast } from '@/hooks/use-toast';

export default function EditReadingPage() {
  const { readingId } = useParams<{ readingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: reading, isLoading } = useReading(readingId || '');
  const updateReading = useUpdateReading();

  const [readingValue, setReadingValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'credit'>('cash');
  const [recordedAt, setRecordedAt] = useState('');

  useEffect(() => {
    if (reading) {
      setReadingValue(String(reading.reading));
      setPaymentMethod(reading.paymentMethod);
      setRecordedAt(reading.recordedAt.slice(0, 16));
    }
  }, [reading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingId) return;
    try {
      await updateReading.mutateAsync({
        id: readingId,
        data: {
          reading: parseFloat(readingValue),
          paymentMethod,
          recordedAt,
        },
      });
      toast({ title: 'Success', description: 'Reading updated' });
      navigate(`/dashboard/readings/${readingId}`);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update reading', variant: 'destructive' });
    }
  };

  if (isLoading || !reading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/dashboard/readings/${readingId}`}> 
            <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Edit Reading</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nozzle {reading.nozzleNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Reading (L)</label>
              <Input type="number" value={readingValue} onChange={(e) => setReadingValue(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Recorded At</label>
              <Input type="datetime-local" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Payment Method</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'upi' | 'credit')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={updateReading.isPending}>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
