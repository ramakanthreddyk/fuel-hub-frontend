
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateReconciliation } from '@/hooks/useReconciliation';
import { DailyReadingSummary } from '@/api/api-contract';

interface ReconciliationFormProps {
  stationId: string;
  date: string;
  readings: DailyReadingSummary[];
  onSuccess?: () => void;
}

interface FormData {
  reconciliationNotes: string;
  managerConfirmation: boolean;
}

export function ReconciliationForm({ stationId, date, readings, onSuccess }: ReconciliationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createReconciliation = useCreateReconciliation();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      reconciliationNotes: '',
      managerConfirmation: false,
    }
  });

  const managerConfirmation = watch('managerConfirmation');
  
  const totalExpected = readings.reduce((sum, reading) => sum + reading.saleValue, 0);
  const totalCashDeclared = readings.reduce((sum, reading) => sum + reading.cashDeclared, 0);
  const deltaAmount = totalExpected - totalCashDeclared;

  const onSubmit = async (data: FormData) => {
    if (!data.managerConfirmation) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createReconciliation.mutateAsync({
        stationId,
        date,
        totalExpected,
        cashReceived: totalCashDeclared,
        reconciliationNotes: data.reconciliationNotes,
        managerConfirmation: data.managerConfirmation,
      });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasShortfall = deltaAmount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Reconciliation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reconciliationNotes">
              Reconciliation Notes
              {hasShortfall && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id="reconciliationNotes"
              placeholder={hasShortfall ? 
                "Please explain the shortfall (e.g., credit sales, online payments, etc.)" : 
                "Optional notes about today's reconciliation"
              }
              {...register('reconciliationNotes', {
                required: hasShortfall ? 'Notes are required when there is a shortfall' : false
              })}
            />
            {errors.reconciliationNotes && (
              <p className="text-sm text-red-500">{errors.reconciliationNotes.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="managerConfirmation"
              checked={managerConfirmation}
              onCheckedChange={(checked) => setValue('managerConfirmation', !!checked)}
            />
            <Label htmlFor="managerConfirmation" className="text-sm">
              I verify the above amounts and confirm this reconciliation is accurate
            </Label>
          </div>
          {errors.managerConfirmation && (
            <p className="text-sm text-red-500">Manager confirmation is required</p>
          )}

          <Button 
            type="submit" 
            disabled={!managerConfirmation || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Reconciliation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
