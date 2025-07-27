
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Fuel, CreditCard, Banknote, Smartphone, Users } from 'lucide-react';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';

export function ModernTodaysSalesCard() {
  const { data: todaysSales, isLoading } = useTodaysSales();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const paymentBreakdown = todaysSales?.paymentBreakdown || {
    cash: 0,
    card: 0,
    upi: 0,
    credit: 0
  };

  const totalAmount = todaysSales?.totalAmount || 0;
  const totalEntries = todaysSales?.totalEntries || 0;
  const totalVolume = todaysSales?.totalVolume || 0;

  return (
    <div className="space-y-6">
      {/* Main Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Sales</h3>
                  <p className="text-sm text-gray-600">Today's Performance</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +12% vs yesterday
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalAmount, { useLakhsCrores: true })}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{totalEntries} transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{totalVolume.toFixed(1)}L volume</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3 mb-2">
              <Fuel className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Volume</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalVolume.toFixed(1)}L</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Transactions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalEntries}</div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                {totalAmount > 0 ? ((paymentBreakdown.cash / totalAmount) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(paymentBreakdown.cash)}
              </div>
              <div className="text-sm text-gray-600">Cash</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {totalAmount > 0 ? ((paymentBreakdown.card / totalAmount) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(paymentBreakdown.card)}
              </div>
              <div className="text-sm text-gray-600">Card</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {totalAmount > 0 ? ((paymentBreakdown.upi / totalAmount) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(paymentBreakdown.upi)}
              </div>
              <div className="text-sm text-gray-600">UPI</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                {totalAmount > 0 ? ((paymentBreakdown.credit / totalAmount) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(paymentBreakdown.credit)}
              </div>
              <div className="text-sm text-gray-600">Credit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
