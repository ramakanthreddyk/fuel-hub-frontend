import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Smartphone, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CashVsSystemComparisonProps {
  systemSales: {
    cashSales: number;
    cardSales: number;
    upiSales: number;
    creditSales: number;
    totalRevenue: number;
  };
  userReported: {
    cashCollected: number;
    cardCollected: number;
    upiCollected: number;
    totalCollected: number;
  };
  date: string;
  stationName: string;
}

export function CashVsSystemComparison({ 
  systemSales, 
  userReported, 
  date, 
  stationName 
}: CashVsSystemComparisonProps) {
  const cashDiff = userReported.cashCollected - systemSales.cashSales;
  const cardDiff = userReported.cardCollected - systemSales.cardSales;
  const upiDiff = userReported.upiCollected - systemSales.upiSales;
  const totalDiff = userReported.totalCollected - (systemSales.totalRevenue - systemSales.creditSales);

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  
  const getDifferenceIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getDifferenceColor = (diff: number) => {
    if (Math.abs(diff) < 1) return 'bg-green-50 text-green-700 border-green-200';
    if (diff > 0) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Cash vs System Reconciliation</h2>
        <p className="text-gray-600">{stationName} - {date}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Cash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">System Sales:</span>
              <span className="font-medium">{formatCurrency(systemSales.cashSales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">User Reported:</span>
              <span className="font-medium">{formatCurrency(userReported.cashCollected)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difference:</span>
                <div className="flex items-center gap-2">
                  {getDifferenceIcon(cashDiff)}
                  <Badge className={getDifferenceColor(cashDiff)}>
                    {cashDiff >= 0 ? '+' : ''}{formatCurrency(cashDiff)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">System Sales:</span>
              <span className="font-medium">{formatCurrency(systemSales.cardSales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">User Reported:</span>
              <span className="font-medium">{formatCurrency(userReported.cardCollected)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difference:</span>
                <div className="flex items-center gap-2">
                  {getDifferenceIcon(cardDiff)}
                  <Badge className={getDifferenceColor(cardDiff)}>
                    {cardDiff >= 0 ? '+' : ''}{formatCurrency(cardDiff)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UPI Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="h-5 w-5" />
              UPI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">System Sales:</span>
              <span className="font-medium">{formatCurrency(systemSales.upiSales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">User Reported:</span>
              <span className="font-medium">{formatCurrency(userReported.upiCollected)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difference:</span>
                <div className="flex items-center gap-2">
                  {getDifferenceIcon(upiDiff)}
                  <Badge className={getDifferenceColor(upiDiff)}>
                    {upiDiff >= 0 ? '+' : ''}{formatCurrency(upiDiff)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Total Reconciliation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">System Total (excl. credit):</p>
              <p className="text-xl font-bold">{formatCurrency(systemSales.totalRevenue - systemSales.creditSales)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">User Reported Total:</p>
              <p className="text-xl font-bold">{formatCurrency(userReported.totalCollected)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Overall Difference:</span>
              <div className="flex items-center gap-3">
                {getDifferenceIcon(totalDiff)}
                <Badge className={`text-lg px-3 py-1 ${getDifferenceColor(totalDiff)}`}>
                  {totalDiff >= 0 ? '+' : ''}{formatCurrency(totalDiff)}
                </Badge>
              </div>
            </div>
            
            {Math.abs(totalDiff) < 1 && (
              <p className="text-sm text-green-600 mt-2 text-center">✓ Reconciliation matches within acceptable range</p>
            )}
            
            {Math.abs(totalDiff) >= 1 && (
              <p className="text-sm text-amber-600 mt-2 text-center">
                ⚠ Difference detected - please review transactions and cash handling
              </p>
            )}
          </div>

          {/* Credit Sales Info */}
          {systemSales.creditSales > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Credit sales of {formatCurrency(systemSales.creditSales)} are excluded from cash reconciliation as they don't involve immediate cash collection.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}