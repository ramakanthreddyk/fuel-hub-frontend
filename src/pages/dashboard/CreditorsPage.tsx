
/**
 * @file pages/dashboard/CreditorsPage.tsx
 * @description Redesigned creditors page with consistent UI styling
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCreditors } from '@/hooks/api/useCreditors';
import { CreditorCard } from '@/components/creditors/CreditorCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function CreditorsPage() {
  const navigate = useNavigate();
  const { data: creditors = [], isLoading } = useCreditors();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCreditors = creditors.filter(creditor =>
    creditor.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creditor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creditor.phoneNumber?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Credit Management
            </h1>
            <p className="text-slate-600 mt-1">Manage customer credit accounts and payments</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/creditors/new')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Creditor
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search creditors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-2 border-white shadow-lg"
          />
        </div>

        {/* Creditors Grid */}
        {filteredCreditors.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12 text-blue-500" />}
            title={searchTerm ? "No creditors found" : "No creditors yet"}
            description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first creditor"}
            action={!searchTerm ? {
              label: "Add First Creditor",
              onClick: () => navigate('/dashboard/creditors/new')
            } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {filteredCreditors.map((creditor) => (
              <CreditorCard
                key={creditor.id}
                creditor={{
                  id: creditor.id,
                  name: creditor.partyName,
                  email: creditor.email,
                  phone: creditor.phoneNumber,
                  creditLimit: creditor.creditLimit || 0,
                  currentBalance: creditor.outstandingAmount,
                  lastPaymentDate: creditor.lastPaymentDate,
                  status: creditor.isActive ? 'active' : 'inactive'
                }}
                onViewDetails={(id) => navigate(`/dashboard/creditors/${id}`)}
                onAddPayment={(id) => navigate(`/dashboard/creditors/${id}/payments/new`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
