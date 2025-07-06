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
import { useCreateCashReport } from '@/hooks/useAttendant';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Trash, DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { CashReport, CreditEntry } from '@/api/services/attendantService';

export default function CashReportPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // State
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [creditEntries, setCreditEntries] = useState<CreditEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch creditors for selected station
  const { data: creditors = [], isLoading: creditorsLoading } = useCreditors(selectedStationId);
  
  // Submit cash report mutation
  const submitCashReport = useCreateCashReport();
  
  // Set default station if not selected
  if (!selectedStationId && stations.length > 0 && !stationsLoading) {
    setSelectedStationId(stations[0].id);
  }
  
  // Add credit entry
  const addCreditEntry = () => {
    setCreditEntries([
      ...creditEntries,
      {
        creditorId: '',
        fuelType: 'petrol',
        litres: 0,
        amount: 0
      }
    ]);
  };
  
  // Remove credit entry
  const removeCreditEntry = (index: number) => {
    setCreditEntries(creditEntries.filter((_, i) => i !== index));
  };
  
  // Update credit entry
  const updateCreditEntry = (index: number, field: keyof CreditEntry, value: any) => {
    const updatedEntries = [...creditEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setCreditEntries(updatedEntries);
  };
  
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
    
    // Validate credit entries
    const invalidEntries = creditEntries.filter(entry => !entry.creditorId || !entry.fuelType);
    if (invalidEntries.length > 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields for credit entries',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const report: CashReport = {
      stationId: selectedStationId,
      date: today,
      cashAmount,
      creditEntries
    };
    
    try {
      await submitCashReport.mutateAsync(report);
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
              Submit your end of day cash and credit breakdown
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Credit Entries</CardTitle>
              <CardDescription>
                Add credit sales for the day
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCreditEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Add Credit Entry
            </Button>
          </CardHeader>
          <CardContent>
            {creditEntries.length === 0 ? (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No credit entries</h3>
                <p className="text-muted-foreground mb-4">
                  Add credit entries if you have any credit sales for the day
                </p>
                <Button type="button" onClick={addCreditEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credit Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {creditEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                    {/* Creditor */}
                    <div className="md:col-span-2">
                      <Label htmlFor={`creditor-${index}`}>Creditor</Label>
                      <Select 
                        value={entry.creditorId} 
                        onValueChange={(value) => updateCreditEntry(index, 'creditorId', value)}
                      >
                        <SelectTrigger id={`creditor-${index}`}>
                          <SelectValue placeholder="Select creditor" />
                        </SelectTrigger>
                        <SelectContent>
                          {creditorsLoading ? (
                            <SelectItem value="loading" disabled>Loading creditors...</SelectItem>
                          ) : creditors.length === 0 ? (
                            <SelectItem value="no-creditors" disabled>No creditors available</SelectItem>
                          ) : (
                            creditors.map((creditor) => (
                              <SelectItem key={creditor.id} value={creditor.id}>
                                {creditor.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Fuel Type */}
                    <div>
                      <Label htmlFor={`fuelType-${index}`}>Fuel Type</Label>
                      <Select 
                        value={entry.fuelType} 
                        onValueChange={(value) => updateCreditEntry(index, 'fuelType', value)}
                      >
                        <SelectTrigger id={`fuelType-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Litres */}
                    <div>
                      <Label htmlFor={`litres-${index}`}>Litres</Label>
                      <Input 
                        id={`litres-${index}`} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={entry.litres || ''} 
                        onChange={(e) => updateCreditEntry(index, 'litres', parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    
                    {/* Amount */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`amount-${index}`}>Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id={`amount-${index}`} 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            className="pl-8" 
                            value={entry.amount || ''} 
                            onChange={(e) => updateCreditEntry(index, 'amount', parseFloat(e.target.value) || 0)} 
                          />
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeCreditEntry(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
