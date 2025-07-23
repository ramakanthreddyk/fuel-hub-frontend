
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateReconciliationRequest } from '@/api/api-contract';

interface ReconciliationFormProps {
  onSubmit: (data: CreateReconciliationRequest) => void;
  isLoading?: boolean;
}

export const ReconciliationForm: React.FC<ReconciliationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateReconciliationRequest>({
    stationId: '',
    date: new Date().toISOString().split('T')[0],
    reconciliationNotes: '',
    managerConfirmation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reconciliation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stationId">Station ID</Label>
              <Input
                id="stationId"
                value={formData.stationId}
                onChange={(e) =>
                  setFormData({ ...formData, stationId: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Reconciliation Notes</Label>
            <Textarea
              id="notes"
              value={formData.reconciliationNotes}
              onChange={(e) =>
                setFormData({ ...formData, reconciliationNotes: e.target.value })
              }
              placeholder="Enter any notes about the reconciliation..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmation"
              checked={formData.managerConfirmation}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, managerConfirmation: !!checked })
              }
            />
            <Label htmlFor="confirmation">Manager Confirmation</Label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Reconciliation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
