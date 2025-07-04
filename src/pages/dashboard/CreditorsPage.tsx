
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreditorList } from '@/components/creditors/CreditorList';
import { CreditorForm } from '@/components/creditors/CreditorForm';
import { useCreditors } from '@/hooks/useCreditors';
import { useAuth } from '@/contexts/AuthContext';

export default function CreditorsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  const { data: creditors = [], isLoading } = useCreditors();

  // Filter creditors based on search term
  const filteredCreditors = creditors.filter(creditor =>
    (creditor.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creditor.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creditor.phoneNumber || '').includes(searchTerm)
  );

  const totalOutstanding = creditors.reduce((sum, creditor) => sum + (creditor.outstandingAmount || 0), 0);
  const activeCreditors = creditors.filter(creditor => (creditor.outstandingAmount || 0) > 0);
  const nearLimitCreditors = creditors.filter(creditor => {
    if (!creditor.creditLimit || creditor.creditLimit === 0) return false;
    const utilization = (creditor.outstandingAmount || 0) / creditor.creditLimit;
    return utilization >= 0.8; // 80% or more of credit limit used
  });

  // Check permissions - only owners and managers can add creditors
  const canManageCreditors = user?.role === 'owner' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Management</h1>
          <p className="text-muted-foreground">
            Manage credit parties and track outstanding amounts
          </p>
        </div>
        {canManageCreditors && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Creditor'}
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all creditors
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creditors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{activeCreditors.length}</div>
            <p className="text-xs text-muted-foreground">
              With outstanding amounts
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Near Credit Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{nearLimitCreditors.length}</div>
            <p className="text-xs text-muted-foreground">
              Above 80% utilization
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creditors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{creditors.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered parties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Creditor Form */}
      {showForm && canManageCreditors && (
        <div className="max-w-4xl">
          <CreditorForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Credit Parties</CardTitle>
              <CardDescription>
                {filteredCreditors.length} of {creditors.length} creditors
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creditors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CreditorList creditors={filteredCreditors} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
