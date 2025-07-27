
/**
 * @file pages/dashboard/CreditorsPage.tsx
 * @description Clean creditors page with proper data mapping
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreditors } from '@/hooks/api/useCreditors';
import { CreditorCard } from '@/components/creditors/CreditorCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreditorsPage() {
  const navigate = useNavigate();
  const { data: creditors = [], isLoading, isError, error } = useCreditors();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Normalize creditor data from backend
  const normalizeCreditor = (creditor: any) => ({
    id: creditor.id,
    name: creditor.party_name || creditor.partyName || creditor.name || 'Unknown',
    phone: creditor.contact_number || creditor.phoneNumber || creditor.phone,
    creditLimit: Number(creditor.credit_limit || creditor.creditLimit || 0),
    currentBalance: Number(creditor.balance || creditor.currentBalance || creditor.outstandingAmount || 0),
    status: creditor.status === 'active' ? 'active' : 'inactive',
    stationName: creditor.station_name || creditor.stationName
  });

  const normalizedCreditors = Array.isArray(creditors) 
    ? creditors.map(normalizeCreditor)
    : [];
  
  const filteredCreditors = normalizedCreditors.filter(creditor =>
    creditor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creditor.phone || '').includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creditors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Credit Management</h1>
          <p className="text-muted-foreground">Manage customer credit accounts and payments</p>
        </div>
        
        <Button onClick={() => navigate('/dashboard/creditors/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Creditor
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load creditors. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search creditors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary Stats */}
      {normalizedCreditors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold">{normalizedCreditors.length}</div>
            <div className="text-sm text-muted-foreground">Total Creditors</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold">
              {normalizedCreditors.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">
              {normalizedCreditors.filter(c => c.currentBalance > c.creditLimit).length}
            </div>
            <div className="text-sm text-muted-foreground">Over Limit</div>
          </div>
        </div>
      )}

      {/* Creditors Grid */}
      {filteredCreditors.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12 text-muted-foreground" />}
          title={searchTerm ? "No creditors found" : "No creditors yet"}
          description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first creditor"}
          action={!searchTerm ? {
            label: "Add First Creditor",
            onClick: () => navigate('/dashboard/creditors/new')
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCreditors.map((creditor) => (
            <CreditorCard
              key={creditor.id}
              creditor={creditor}
              onViewDetails={(id) => navigate(`/dashboard/creditors/${id}`)}
              onAddPayment={(id) => navigate(`/dashboard/creditors/${id}/payments/new`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
