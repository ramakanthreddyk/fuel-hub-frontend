
import { useState, useEffect } from 'react';
import type { DailyReadingSummary } from '@/api/api-contract';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateReconciliation } from '@/hooks/useReconciliation';
// import { useUser } from '@/hooks/useUser'; // Not available, use localStorage fuelsync_user
import { useGetCashReport } from '../../hooks/useCashReport';
import { useGetReconciliationDiff } from '@/hooks/useReconciliationDiff';

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

  const ReconciliationForm: React.FC<ReconciliationFormProps> = (props) => {
    // Role enforcement: get user role from backend/session context
    // Use fuelsync_user from localStorage (set by backend auth)
  let userRole: string | undefined = undefined;
  try {
    const userStr = localStorage.getItem('fuelsync_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      userRole = userObj?.role;
    }
  } catch {}
  const canReconcile = userRole === 'owner' || userRole === 'manager';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCashReportPrompt, setShowCashReportPrompt] = useState(false);
  const [cashReportExists, setCashReportExists] = useState(false);
  const [reconciliationDiff, setReconciliationDiff] = useState<any>(null);
  const createReconciliation = useCreateReconciliation();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      reconciliationNotes: '',
      managerConfirmation: false,
    }
  });

  // Fetch cash report for this station/date
  const { stationId, date, readings, alreadyReconciled, onSuccess } = props;
  const { data: cashReport, isLoading: cashReportLoading } = useGetCashReport(stationId, date);
  useEffect(() => {
    setCashReportExists(!!cashReport);
    setShowCashReportPrompt(!cashReport && canReconcile && !alreadyReconciled);
  }, [cashReport, canReconcile, alreadyReconciled]);

  // Fetch reconciliation diff for this station/date
  const { data: diffData } = useGetReconciliationDiff(stationId, date);
  useEffect(() => {
    setReconciliationDiff(diffData);
  }, [diffData]);

  const managerConfirmation = watch('managerConfirmation');

  const totalExpected = readings.reduce((sum, reading) => sum + (reading.revenue || 0), 0);
  const totalCashDeclared = readings.reduce((sum, reading) => sum + (reading.cashDeclared || 0), 0);
  const deltaAmount = totalExpected - totalCashDeclared;

  const onSubmit = async (data: FormData) => {
    if (!canReconcile) {
      setError('You do not have permission to reconcile.');
      return;
    }
    if (!cashReportExists) {
      setError('A cash report must be submitted before reconciliation.');
      setShowCashReportPrompt(true);
      return;
    }
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
        {/* Workflow guidance */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
          <strong>Workflow:</strong> 1. Record nozzle readings. 2. Submit daily cash report. 3. Run reconciliation.<br />
          <span className="text-xs">You must submit a cash report before reconciling.</span>
        </div>
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
        {/* Enhanced cash variance feedback */}
        <div className="space-y-2">
          <div>Expected Cash: <strong>{totalExpected}</strong></div>
          <div>Declared Cash: <strong>{totalCashDeclared}</strong></div>
          <div>Cash Variance: <strong className={deltaAmount !== 0 ? 'text-red-600' : 'text-green-600'}>{deltaAmount}</strong></div>
          {deltaAmount !== 0 ? (
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-orange-900 text-sm mb-2">
              <strong>Cash variance detected!</strong> Please review cash entries before finalizing.<br />
              <a href={`/cash-report?stationId=${stationId}&date=${date}`} className="text-blue-600 underline">Review or update cash report</a><br />
              <a href={`/reconciliation/discrepancies?stationId=${stationId}&date=${date}`} className="text-blue-600 underline">View cash discrepancies</a>
            </div>
          ) : (
            <div className="text-green-700 text-xs">No cash variance detected. Cash report matches expected sales.</div>
          )}
        </div>
        {/* Cash report prompt */}
        {showCashReportPrompt && (
          <div className="p-2 bg-orange-50 border border-orange-200 rounded text-orange-900 text-sm mb-2">
            No cash report found for this day. Please submit a cash report before running reconciliation.<br />
            <a href={`/cash-report?stationId=${stationId}&date=${date}`} className="text-blue-600 underline">Go to Cash Report</a>
          </div>
        )}
        {/* If already reconciled, show message and disable form */}
        {alreadyReconciled && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-green-900 text-sm mb-2">
            This day has already been reconciled and is locked. No further changes allowed.<br />
            <a href={`/reconciliation/history?stationId=${stationId}`} className="text-blue-600 underline">View reconciliation history</a>
          </div>
        )}
        {/* Error and success feedback */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 text-sm mb-2">
            <strong>Error:</strong> {error}<br />
            {error.includes('403') && (
              <span>Access denied. Please check your role or contact your manager.</span>
            )}
          </div>
        )}
        {success && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-green-900 text-sm mb-2">
            Reconciliation completed successfully.<br />
            <a href={`/reconciliation/history?stationId=${stationId}`} className="text-blue-600 underline">View reconciliation history</a>
            <br />
            <a href={`/reconciliation/discrepancies?stationId=${stationId}`} className="text-blue-600 underline">View discrepancies</a>
          </div>
        )}
        {/* Show reconciliation diff if available */}
        {reconciliationDiff && (
          <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-900 text-sm mb-2">
            <strong>Cash Reconciliation Diff:</strong><br />
            Reported Cash: <strong>{reconciliationDiff.reported_cash}</strong><br />
            Actual Cash: <strong>{reconciliationDiff.actual_cash}</strong><br />
            Difference: <strong className={reconciliationDiff.difference !== 0 ? 'text-red-600' : 'text-green-600'}>{reconciliationDiff.difference}</strong><br />
            Status: <strong>{reconciliationDiff.status}</strong><br />
            {reconciliationDiff.difference !== 0 && (
              <span className="text-red-600">Variance detected! <a href={`/reconciliation/discrepancies?stationId=${stationId}&date=${date}`} className="underline">Review discrepancy details</a></span>
            )}
          </div>
        )}
        {/* Only show form if user can reconcile and not already reconciled and cash report exists */}
        {canReconcile && !alreadyReconciled && cashReportExists && (
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
        )}
        {/* If not allowed, show message */}
        {!canReconcile && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 text-sm mb-2">
            You do not have permission to run reconciliation. Please contact your manager or owner.
          </div>
        )}
      </CardContent>
    </Card>
  );
// ...existing code...
}
