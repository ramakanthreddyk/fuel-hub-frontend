
import { useState } from 'react';
import type { DailyReadingSummary } from '@/api/api-contract';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateReconciliation } from '@/hooks/useReconciliation';

interface ReconciliationFormProps {
  stationId: string;
  date: string;
  readings: DailyReadingSummary[];
  alreadyReconciled?: boolean;
  onSuccess?: () => void;
}

interface FormData {
  reconciliationNotes: string;
  managerConfirmation: boolean;
}

export function ReconciliationForm({ stationId, date, readings, alreadyReconciled, onSuccess }: ReconciliationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const createReconciliation = useCreateReconciliation();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      reconciliationNotes: '',
      managerConfirmation: false,
    }
  });

  const managerConfirmation = watch('managerConfirmation');

  const totalExpected = readings.reduce((sum, reading) => sum + (reading.revenue || 0), 0);
  const totalCashDeclared = readings.reduce((sum, reading) => sum + (reading.cashDeclared || 0), 0);
  const deltaAmount = totalExpected - totalCashDeclared;

  const onSubmit = async (data: FormData) => {
    if (!data.managerConfirmation) {
      setError('Manager confirmation is required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await createReconciliation.mutateAsync({
        stationId,
        date,
        reconciliationNotes: data.reconciliationNotes,
        managerConfirmation: data.managerConfirmation,
      });
      setSuccess(true);
      onSuccess?.();
    } catch (e) {
      setError('Failed to reconcile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Calculate readings and variance
  const openingReading = readings.reduce((sum, r) => sum + (r.openingReading || 0), 0);
  const closingReading = readings.reduce((sum, r) => sum + (r.closingReading || 0), 0);
  const totalVolume = readings.reduce((sum, r) => sum + (r.totalVolume || 0), 0);
  const variance = closingReading - openingReading - totalVolume;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Daily Reconciliation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning and guidance */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-900 text-sm">
          <strong>Warning:</strong> Running reconciliation will finalize all sales and cash data for this station on {date}.<br />
          Once saved, no further sales or payments can be entered for this day.
        </div>
        {/* Show readings and variance */}
        <div className="space-y-2">
          <div>Opening Reading: <strong>{openingReading}</strong></div>
          <div>Closing Reading: <strong>{closingReading}</strong></div>
          <div>Total Sales Volume: <strong>{totalVolume}</strong></div>
          <div>Variance: <strong className={variance !== 0 ? 'text-red-600' : 'text-green-600'}>{variance}</strong></div>
          {variance !== 0 && (
            <div className="text-red-600 text-xs">Variance detected! Please review nozzle readings and sales data before finalizing.</div>
          )}
        </div>
        {/* Show cash variance */}
        <div className="space-y-2">
          <div>Expected Cash: <strong>{totalExpected}</strong></div>
          <div>Declared Cash: <strong>{totalCashDeclared}</strong></div>
          <div>Cash Variance: <strong className={deltaAmount !== 0 ? 'text-red-600' : 'text-green-600'}>{deltaAmount}</strong></div>
          {deltaAmount !== 0 && (
            <div className="text-red-600 text-xs">Cash variance detected! Please review cash entries before finalizing.</div>
          )}
        </div>
        {/* If already reconciled, show message and disable form */}
        {alreadyReconciled && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-green-900 text-sm mb-2">
            This day has already been reconciled and is locked. No further changes allowed.
          </div>
        )}
        {/* Error and success feedback */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Reconciliation completed successfully.</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={alreadyReconciled}>
            <div>
              <Label>Manager Confirmation *</Label>
              <Checkbox {...register('managerConfirmation', { required: true })} />
              <span className="ml-2 text-xs text-muted-foreground">I confirm all sales and cash data are accurate for this day.</span>
              {errors.managerConfirmation && <span className="text-red-600 text-xs">Manager confirmation is required.</span>}
            </div>
            <div>
              <Label>Reconciliation Notes</Label>
              <Textarea {...register('reconciliationNotes')} placeholder="Add any notes or comments..." />
            </div>
            <Button type="submit" disabled={isSubmitting || !managerConfirmation || alreadyReconciled} className="w-full">
              {alreadyReconciled ? 'Already Reconciled' : isSubmitting ? (<span className="flex items-center justify-center"><span className="animate-spin mr-2">⏳</span>Reconciling...</span>) : 'Run Reconciliation'}
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
// ...existing code...
}
