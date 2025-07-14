import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useVoidReading } from '@/hooks/api/useReadings';

interface VoidReadingDialogProps {
  readingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function VoidReadingDialog({ readingId, open, onOpenChange, onSuccess }: VoidReadingDialogProps) {
  const [reason, setReason] = useState('');
  const voidReading = useVoidReading();

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    
    try {
      await voidReading.mutateAsync({
        id: readingId,
        reason: reason.trim()
      });
      
      setReason('');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to void reading:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Void Reading
          </DialogTitle>
          <DialogDescription>
            Voiding a reading will mark it as invalid. This action cannot be undone and requires manager approval.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <p className="font-medium">Important:</p>
            <p>Instead of editing readings, we recommend voiding incorrect readings and creating new ones to maintain data integrity.</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for voiding <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for voiding this reading"
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason.trim() || voidReading.isPending}
          >
            {voidReading.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Voiding...
              </>
            ) : (
              'Void Reading'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}