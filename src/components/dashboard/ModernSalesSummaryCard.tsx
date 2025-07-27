
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';

interface ModernSalesSummaryCardProps {
  filters?: {
    stationId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export function ModernSalesSummaryCard({ filters = {} }: ModernSalesSummaryCardProps) {
  const { data: summary, isLoading } = useSalesSummary('monthly', filters);

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
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Summary</h3>
          <p className="text-sm text-gray-600">Monthly performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              +{summary?.growthPercentage || 0}%
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary?.totalRevenue || 0, { useLakhsCrores: true })}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {summary?.salesCount || 0}
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {summary?.totalVolume?.toFixed(1) || 0}L
            </div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </div>
        </div>
      </div>
    </div>
  );
}
