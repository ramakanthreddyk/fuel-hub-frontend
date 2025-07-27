import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, DollarSign, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface DailyClosureData {
  id: string;
  stationId: string;
  stationName: string;
  closureDate: string;
  systemSalesAmount: number;
  systemSalesVolume: number;
  systemTransactionCount: number;
  reportedCashAmount: number;
  varianceAmount: number;
  varianceReason?: string;
  isClosed: boolean;
  closedBy?: string;
  closedAt?: string;
}

interface DailyClosureCardProps {
  data: DailyClosureData;
  onClose: (stationId: string, date: string, cashAmount: number, reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export function DailyClosureCard({ data, onClose, isLoading }: DailyClosureCardProps) {
  const [cashAmount, setCashAmount] = useState(data.reportedCashAmount || data.systemSalesAmount);
  const [reason, setReason] = useState(data.varianceReason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const variance = cashAmount - data.systemSalesAmount;
  const hasVariance = Math.abs(variance) > 0.01;
  const hasSignificantVariance = Math.abs(variance) > 1.00;

  // Validate on cash amount change
  const validateClosure = async (amount: number) => {
    if (data.isClosed) return;
    
    try {
      const response = await fetch('/api/v1/daily-closure/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: data.stationId,
          closureDate: data.closureDate,
          reportedCashAmount: amount
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setValidationErrors(result.data.errors || []);
        setValidationWarnings(result.data.warnings || []);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCashChange = (value: number) => {
    setCashAmount(value);
    validateClosure(value);
  };

  const handleClose = async () => {
    if (data.isClosed || validationErrors.length > 0) return;
    
    setIsSubmitting(true);
    try {
      await onClose(data.stationId, data.closureDate, cashAmount, reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canClose = !data.isClosed && 
                   validationErrors.length === 0 && 
                   (!hasSignificantVariance || reason.trim().length > 0);

  return (
    <Card className={cn(
      "transition-all duration-200",
      data.isClosed ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{data.stationName}</CardTitle>
            <p className="text-sm text-muted-foreground">{data.closureDate}</p>
          </div>
          <Badge variant={data.isClosed ? "default" : "secondary"}>
            {data.isClosed ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Closed
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Open
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* System Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white rounded-md">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="text-xs text-muted-foreground">Sales</span>
            </div>
            <div className="text-sm font-bold">{formatCurrency(data.systemSalesAmount)}</div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-md">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-muted-foreground">Volume</span>
            </div>
            <div className="text-sm font-bold">{data.systemSalesVolume.toFixed(2)}L</div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-md">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-muted-foreground">Txns</span>
            </div>
            <div className="text-sm font-bold">{data.systemTransactionCount}</div>
          </div>
        </div>

        {!data.isClosed ? (
          <>
            {/* Cash Entry */}
            <div className="space-y-2">
              <Label htmlFor="cashAmount">Actual Cash Collected</Label>
              <Input
                id="cashAmount"
                type="number"
                step="0.01"
                min="0"
                value={cashAmount}
                onChange={(e) => handleCashChange(Number(e.target.value))}
                className={cn(
                  "text-right font-mono",
                  validationErrors.length > 0 && "border-red-500"
                )}
              />
              {validationErrors.length > 0 && (
                <div className="text-xs text-red-600 mt-1">
                  {validationErrors.map((error, i) => (
                    <div key={i}>• {error}</div>
                  ))}
                </div>
              )}
              {validationWarnings.length > 0 && (
                <div className="text-xs text-yellow-600 mt-1">
                  {validationWarnings.map((warning, i) => (
                    <div key={i}>⚠ {warning}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Variance Display */}
            {hasVariance && (
              <div className={cn(
                "p-3 rounded-md border",
                variance > 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Variance</span>
                  <span className={cn(
                    "font-bold",
                    variance > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                  </span>
                </div>
                <Textarea
                  placeholder="Explain the variance (required for differences > ₹1)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={handleClose}
              disabled={!canClose || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Closing...' : 'Close Business Day'}
            </Button>
            
            {!canClose && !isSubmitting && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                {validationErrors.length > 0 ? 'Fix errors above' : 
                 hasSignificantVariance && !reason.trim() ? 'Variance explanation required' : 
                 'Cannot close'}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Closed Summary */}
            <div className="space-y-2 p-3 bg-white rounded-md">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cash Reported:</span>
                <span className="font-medium">{formatCurrency(data.reportedCashAmount)}</span>
              </div>
              {data.varianceAmount !== 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Variance:</span>
                    <span className={cn(
                      "font-medium",
                      data.varianceAmount > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {data.varianceAmount > 0 ? '+' : ''}{formatCurrency(data.varianceAmount)}
                    </span>
                  </div>
                  {data.varianceReason && (
                    <div className="text-xs text-muted-foreground">
                      Reason: {data.varianceReason}
                    </div>
                  )}
                </>
              )}
              <div className="text-xs text-muted-foreground pt-1 border-t">
                Closed by {data.closedBy} on {new Date(data.closedAt!).toLocaleString()}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}