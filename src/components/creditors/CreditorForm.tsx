
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCreditor } from '@/hooks/useCreditors';

export function CreditorForm() {
  const [partyName, setPartyName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const createCreditor = useCreateCreditor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partyName.trim()) return;

    createCreditor.mutate({
      partyName: partyName.trim(),
      creditLimit: creditLimit ? Number(creditLimit) : undefined,
    });

    // Reset form on success
    setPartyName('');
    setCreditLimit('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Creditor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="partyName">Party Name *</Label>
            <Input
              id="partyName"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="Enter party name"
              required
            />
          </div>
          <div>
            <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              type="number"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              placeholder="Enter credit limit (optional)"
              min="0"
            />
          </div>
          <Button 
            type="submit" 
            disabled={createCreditor.isPending || !partyName.trim()}
            className="w-full"
          >
            {createCreditor.isPending ? 'Creating...' : 'Add Creditor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
