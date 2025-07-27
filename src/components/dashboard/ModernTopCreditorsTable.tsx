
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { useTopCreditors } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';

export function ModernTopCreditorsTable() {
  const { data: creditors = [], isLoading } = useTopCreditors(5);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getCreditLimitColor = (outstanding: number, limit: number | null) => {
    if (!limit) return 'bg-gray-100 text-gray-800';
    const percentage = (outstanding / limit) * 100;
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Users className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Creditors</h3>
          <p className="text-sm text-gray-600">Highest outstanding amounts</p>
        </div>
      </div>

      <div className="space-y-4">
        {creditors.map((creditor, index) => (
          <div key={creditor.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">{creditor.partyName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className={`${getCreditLimitColor(creditor.outstandingAmount, creditor.creditLimit)} border text-xs`}>
                      <CreditCard className="h-3 w-3 mr-1" />
                      {creditor.creditLimit ? 
                        `${((creditor.outstandingAmount / creditor.creditLimit) * 100).toFixed(1)}% used` : 
                        'No limit'
                      }
                    </Badge>
                    {creditor.creditLimit && creditor.outstandingAmount >= creditor.creditLimit * 0.9 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs">Near limit</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(creditor.outstandingAmount, { useLakhsCrores: true })}
                  </div>
                  <div className="text-xs text-gray-500">Outstanding</div>
                </div>
                {creditor.creditLimit && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700">
                      {formatCurrency(creditor.creditLimit, { useLakhsCrores: true })}
                    </div>
                    <div className="text-xs text-gray-500">Limit</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
