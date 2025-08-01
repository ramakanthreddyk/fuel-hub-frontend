/**
 * @file components/reconciliation/ImprovedReconciliationCard.tsx
 * @description Simple, clear reconciliation interface
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Calculator, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ReconciliationSummary {
  date: string;
  stationName: string;
  systemCalculated: {
    totalRevenue: number;
    cashSales: number;
    cardSales: number;
    upiSales: number;
    creditSales: number;
  };
  userEntered: {
    cashCollected: number;
    cardCollected: number;
    upiCollected: number;
    totalCollected: number;
  };
  differences: {
    cashDifference: number;
    cardDifference: number;
    upiDifference: number;
    totalDifference: number;
  };
  isReconciled: boolean;
}

interface Props {
  summary: ReconciliationSummary;
  onCloseDay: () => void;
  isClosing?: boolean;
}

export function ImprovedReconciliationCard({ summary, onCloseDay, isClosing = false }: Props) {
  const { systemCalculated, userEntered, differences, isReconciled } = summary;
  
  // Calculate non-credit system total for comparison
  const systemNonCreditTotal = systemCalculated.totalRevenue - systemCalculated.creditSales;
  
  const getDifferenceColor = (amount: number) => {
    if (Math.abs(amount) < 1) return 'text-green-600';
    if (Math.abs(amount) < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifferenceIcon = (amount: number) => {
    if (Math.abs(amount) < 1) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Daily Reconciliation - {summary.stationName}
          </CardTitle>
          {isReconciled ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Day Closed
            </Badge>
          ) : (
            <Badge variant="outline">
              Pending Review
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Date: {summary.date} • Compare system calculations with actual cash collected
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* System vs User Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* System Calculated */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-blue-700 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              System Calculated
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Banknote className="h-3 w-3" />
                  Cash Sales:
                </span>
                <span className="font-mono">{formatCurrency(systemCalculated.cashSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Card Sales:
                </span>
                <span className="font-mono">{formatCurrency(systemCalculated.cardSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  UPI Sales:
                </span>
                <span className="font-mono">{formatCurrency(systemCalculated.upiSales)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total (excl. credit):</span>
                <span className="font-mono">{formatCurrency(systemNonCreditTotal)}</span>
              </div>
              {systemCalculated.creditSales > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Credit Sales:</span>
                  <span className="font-mono">{formatCurrency(systemCalculated.creditSales)}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Entered */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-green-700 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Cash Collected
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Banknote className="h-3 w-3" />
                  Cash:
                </span>
                <span className="font-mono">{formatCurrency(userEntered.cashCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Card:
                </span>
                <span className="font-mono">{formatCurrency(userEntered.cardCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  UPI:
                </span>
                <span className="font-mono">{formatCurrency(userEntered.upiCollected)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Collected:</span>
                <span className="font-mono">{formatCurrency(userEntered.totalCollected)}</span>
              </div>
            </div>
          </div>

          {/* Differences */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-orange-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Differences
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.cashDifference)}
                  Cash:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.cashDifference)}`}>
                  {differences.cashDifference >= 0 ? '+' : ''}{formatCurrency(differences.cashDifference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.cardDifference)}
                  Card:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.cardDifference)}`}>
                  {differences.cardDifference >= 0 ? '+' : ''}{formatCurrency(differences.cardDifference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.upiDifference)}
                  UPI:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.upiDifference)}`}>
                  {differences.upiDifference >= 0 ? '+' : ''}{formatCurrency(differences.upiDifference)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.totalDifference)}
                  Total:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.totalDifference)}`}>
                  {differences.totalDifference >= 0 ? '+' : ''}{formatCurrency(differences.totalDifference)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-800 mb-2">How to Read This:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>System Calculated:</strong> Sales amounts from nozzle readings and fuel prices</li>
            <li>• <strong>Cash Collected:</strong> Actual amounts reported by attendants</li>
            <li>• <strong>Differences:</strong> Collected - System (positive = excess, negative = shortage)</li>
            <li>• <strong>Green:</strong> Perfect match (±₹1), <strong>Yellow:</strong> Small difference (±₹100), <strong>Red:</strong> Large difference</li>
          </ul>
        </div>

        {/* Action Button */}
        {!isReconciled && (
          <div className="flex justify-end">
            <Button 
              onClick={onCloseDay}
              disabled={isClosing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isClosing ? 'Closing Day...' : 'Accept Differences & Close Day'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
