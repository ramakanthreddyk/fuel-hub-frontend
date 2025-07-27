
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Activity, Fuel, CreditCard } from 'lucide-react';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency, formatVolume } from '@/utils/formatters';

export function ModernTodaysSalesCard() {
  const { data: todaysSales, isLoading } = useTodaysSales();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { name: 'Cash', amount: todaysSales?.paymentBreakdown.cash || 0, icon: DollarSign, color: 'bg-green-500' },
    { name: 'Card', amount: todaysSales?.paymentBreakdown.card || 0, icon: CreditCard, color: 'bg-blue-500' },
    { name: 'UPI', amount: todaysSales?.paymentBreakdown.upi || 0, icon: Activity, color: 'bg-purple-500' },
    { name: 'Credit', amount: todaysSales?.paymentBreakdown.credit || 0, icon: TrendingUp, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Sales</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(todaysSales?.totalAmount || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatVolume(todaysSales?.totalVolume || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {todaysSales?.totalEntries || 0}
            </div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {paymentMethods.map((method, index) => (
          <Card key={method.name} className="relative overflow-hidden border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.color}`}>
                  <method.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {((method.amount / (todaysSales?.totalAmount || 1)) * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(method.amount, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-600">{method.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
