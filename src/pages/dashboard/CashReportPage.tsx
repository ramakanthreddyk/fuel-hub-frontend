
/**
 * @file pages/dashboard/CashReportPage.tsx
 * @description Page for submitting cash reports
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStations } from '@/hooks/api/useStations';
import { useCreditors } from '@/hooks/api/useCreditors';
import {
  useAttendantStations,
  useAttendantCreditors,
  useCreateCashReport,
} from '@/hooks/api/useAttendant';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Trash, DollarSign, CreditCard, Loader2 } from 'lucide-react';

export default function CashReportPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAttendant = user?.role === 'attendant';
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // State
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [shift, setShift] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch stations
  const {
    data: stations = [],
    isLoading: stationsLoading,
  } = isAttendant ? useAttendantStations() : useStations();

  // Fetch creditors for selected station
  const {
    data: creditors = [],
    isLoading: creditorsLoading,
  } = isAttendant
    ? useAttendantCreditors(selectedStationId)
    : useCreditors(selectedStationId);
  
  // Submit cash report mutation
  const submitCashReport = useCreateCashReport();
  
  // Set default station if not selected
  if (!selectedStationId && stations.length > 0 && !stationsLoading) {
    setSelectedStationId(stations[0].id);
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStationId) {
      toast({
        title: 'Error',
        description: 'Please select a station',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const reportData = {
      stationId: selectedStationId,
      cashAmount,
      reportDate: today,
      shift,
      notes: notes.trim() || undefined
    };
    
    try {
      await submitCashReport.mutateAsync(reportData);
      toast({
        title: 'Success',
        description: 'Cash report submitted successfully'
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit cash report',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (stationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Submit Cash Report</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Cash Report</CardTitle>
            <CardDescription>
              Submit your end of day cash report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Station Selection */}
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Select 
                value={selectedStationId} 
                onValueChange={setSelectedStationId}
              >
                <SelectTrigger id="station">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={today} 
                disabled 
              />
            </div>
            
            {/* Shift */}
            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select value={shift} onValueChange={(value: 'morning' | 'afternoon' | 'night') => setShift(value)}>
                <SelectTrigger id="shift">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Cash Amount */}
            <div className="space-y-2">
              <Label htmlFor="cashAmount">Cash Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="cashAmount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  className="pl-8" 
                  value={cashAmount || ''} 
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Add any additional notes..."
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !selectedStationId}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Cash Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}
