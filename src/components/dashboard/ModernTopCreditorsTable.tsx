import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCreditors } from '@/hooks/api/useCreditors';
import { formatCurrency } from '@/utils/formatters';

export function ModernTopCreditorsTable() {
  const { data: creditors = [], isLoading } = useCreditors();

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
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Sort creditors by outstanding amount and take top 10
  const topCreditors = creditors
    .sort((a, b) => (b.outstandingAmount || 0) - (a.outstandingAmount || 0))
    .slice(0, 10);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <Users className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Creditors</h3>
          <p className="text-sm text-gray-600">Outstanding amounts by customer</p>
        </div>
      </div>

      {topCreditors.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No creditors found</h3>
          <p className="text-gray-600">All customers have cleared their dues</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topCreditors.map((creditor, index) => (
            <Card key={creditor.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {creditor.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {creditor.phone || 'No phone'}
                        </span>
                        {creditor.outstandingAmount > 10000 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(creditor.outstandingAmount || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Outstanding
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}