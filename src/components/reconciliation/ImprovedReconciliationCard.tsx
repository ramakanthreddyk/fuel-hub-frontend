/**
 * @file components/reconciliation/ImprovedReconciliationCard.tsx
 * @description Simple, clear reconciliation interface
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertCircle,
  Calculator,
  Banknote,
  CreditCard,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart,
  BarChart3,
  Target,
  Wallet,
  Receipt,
  ArrowUpCircle,
  ArrowDownCircle,
  Equal
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsiveIconSize,
  getResponsivePadding,
  getResponsiveGap
} from '@/utils/mobileFormatters';

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
    creditGiven?: number;
    totalCollected: number;
  };
  differences: {
    cashDifference: number;
    cardDifference: number;
    upiDifference: number;
    creditDifference?: number;
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
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();

  // Calculate non-credit system total for comparison
  const systemNonCreditTotal = systemCalculated.totalRevenue - systemCalculated.creditSales;

  const getDifferenceColor = (amount: number) => {
    if (Math.abs(amount) < 1) return 'text-green-600';
    if (Math.abs(amount) < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifferenceIcon = (amount: number) => {
    if (amount > 0) return <ArrowUpCircle className="h-4 w-4 text-green-600" />;
    if (amount < 0) return <ArrowDownCircle className="h-4 w-4 text-red-600" />;
    return <Equal className="h-4 w-4 text-gray-400" />;
  };

  const getDifferenceBgColor = (amount: number) => {
    if (Math.abs(amount) < 1) return 'bg-green-50 border-green-200';
    if (Math.abs(amount) < 100) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Calculate accuracy percentage for visual progress
  const accuracyPercentage = systemNonCreditTotal > 0
    ? Math.max(0, 100 - (Math.abs(differences.totalDifference) / systemNonCreditTotal) * 100)
    : 100;

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Header */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{summary.stationName}</h2>
                  <p className="text-xs text-white/80">{summary.date}</p>
                </div>
              </div>
              {isReconciled ? (
                <Badge className="bg-green-500 text-white border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Closed
                </Badge>
              ) : (
                <Badge className="bg-orange-500 text-white border-0">
                  <Target className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>

            {/* Accuracy Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Reconciliation Accuracy</span>
                <span className="text-sm font-bold">{accuracyPercentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={accuracyPercentage}
                className="h-2 bg-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* System vs Collected Comparison */}
        <div className="grid grid-cols-2 gap-3">
          {/* System Calculated */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-blue-800">System</h3>
                  <p className="text-xs text-blue-600">Calculated</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-3 w-3 text-green-600" />
                    <span className="text-xs">Cash</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(systemCalculated.cashSales)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Card</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(systemCalculated.cardSales)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3 w-3 text-purple-600" />
                    <span className="text-xs">UPI</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(systemCalculated.upiSales)}</span>
                </div>

                {systemCalculated.creditSales > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3 w-3 text-orange-600" />
                      <span className="text-xs">Credit</span>
                    </div>
                    <span className="font-bold text-sm">{formatCurrencyMobile(systemCalculated.creditSales)}</span>
                  </div>
                )}

                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-blue-800">Total</span>
                  <span className="font-bold text-lg text-blue-800">{formatCurrencyMobile(systemCalculated.totalRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Collected */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-green-800">Actual</h3>
                  <p className="text-xs text-green-600">Collected</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-3 w-3 text-green-600" />
                    <span className="text-xs">Cash</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(userEntered.cashCollected)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Card</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(userEntered.cardCollected)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3 w-3 text-purple-600" />
                    <span className="text-xs">UPI</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrencyMobile(userEntered.upiCollected)}</span>
                </div>

                {(userEntered.creditGiven || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3 w-3 text-orange-600" />
                      <span className="text-xs">Credit</span>
                    </div>
                    <span className="font-bold text-sm">{formatCurrencyMobile(userEntered.creditGiven || 0)}</span>
                  </div>
                )}

                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-green-800">Total</span>
                  <span className="font-bold text-lg text-green-800">{formatCurrencyMobile(userEntered.totalCollected)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Differences Cards */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-orange-800">Differences</h3>
                <p className="text-xs text-orange-600">System vs Actual</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {differences.creditDifference !== undefined && (
                <div className="col-span-2">
                  <div className={`p-3 rounded-lg border ${getDifferenceBgColor(differences.creditDifference)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Receipt className="h-3 w-3 text-orange-600" />
                        <span className="text-xs font-medium">Credit</span>
                      </div>
                      {getDifferenceIcon(differences.creditDifference)}
                    </div>
                    <p className={`font-bold text-sm ${getDifferenceColor(differences.creditDifference)}`}>
                      {differences.creditDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.creditDifference)}
                    </p>
                  </div>
                </div>
              )}
              <div className={`p-3 rounded-lg border ${getDifferenceBgColor(differences.cashDifference)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Banknote className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium">Cash</span>
                  </div>
                  {getDifferenceIcon(differences.cashDifference)}
                </div>
                <p className={`font-bold text-sm ${getDifferenceColor(differences.cashDifference)}`}>
                  {differences.cashDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.cashDifference)}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${getDifferenceBgColor(differences.cardDifference)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium">Card</span>
                  </div>
                  {getDifferenceIcon(differences.cardDifference)}
                </div>
                <p className={`font-bold text-sm ${getDifferenceColor(differences.cardDifference)}`}>
                  {differences.cardDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.cardDifference)}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${getDifferenceBgColor(differences.upiDifference)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-medium">UPI</span>
                  </div>
                  {getDifferenceIcon(differences.upiDifference)}
                </div>
                <p className={`font-bold text-sm ${getDifferenceColor(differences.upiDifference)}`}>
                  {differences.upiDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.upiDifference)}
                </p>
              </div>

              {differences.creditDifference !== undefined && (
                <div className={`p-3 rounded-lg border ${getDifferenceBgColor(differences.creditDifference)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Receipt className="h-3 w-3 text-orange-600" />
                      <span className="text-xs font-medium">Credit</span>
                    </div>
                    {getDifferenceIcon(differences.creditDifference)}
                  </div>
                  <p className={`font-bold text-sm ${getDifferenceColor(differences.creditDifference)}`}>
                    {differences.creditDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.creditDifference)}
                  </p>
                </div>
              )}

              <div className={`p-3 rounded-lg border-2 ${getDifferenceBgColor(differences.totalDifference)} border-orange-300`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Receipt className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-bold">Total</span>
                  </div>
                  {getDifferenceIcon(differences.totalDifference)}
                </div>
                <p className={`font-bold text-lg ${getDifferenceColor(differences.totalDifference)}`}>
                  {differences.totalDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.totalDifference)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600">
          <CardContent className="p-4">
            <Button
              onClick={onCloseDay}
              disabled={isClosing || isReconciled}
              className="w-full bg-white text-green-700 hover:bg-gray-50 font-bold py-3 text-base"
            >
              {isClosing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                  Closing Day...
                </>
              ) : isReconciled ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Day Already Closed
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Accept & Close Day
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="h-3 w-3 text-blue-600" />
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>System:</strong> Sales from nozzle readings</p>
                <p><strong>Actual:</strong> Cash reported by attendants</p>
                <p><strong>Green:</strong> Perfect match • <strong>Yellow:</strong> Small difference • <strong>Red:</strong> Large difference</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop version (existing layout)
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
                <span className="font-mono">{formatCurrencyMobile(systemCalculated.cashSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Card Sales:
                </span>
                <span className="font-mono">{formatCurrencyMobile(systemCalculated.cardSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  UPI Sales:
                </span>
                <span className="font-mono">{formatCurrencyMobile(systemCalculated.upiSales)}</span>
              </div>
              {systemCalculated.creditSales > 0 && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Receipt className="h-3 w-3" />
                    Credit Sales:
                  </span>
                  <span className="font-mono">{formatCurrencyMobile(systemCalculated.creditSales)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Revenue:</span>
                <span className="font-mono">{formatCurrencyMobile(systemCalculated.totalRevenue)}</span>
              </div>
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
                <span className="font-mono">{formatCurrencyMobile(userEntered.cashCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Card:
                </span>
                <span className="font-mono">{formatCurrencyMobile(userEntered.cardCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  UPI:
                </span>
                <span className="font-mono">{formatCurrencyMobile(userEntered.upiCollected)}</span>
              </div>
              {(userEntered.creditGiven || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Receipt className="h-3 w-3" />
                    Credit Given:
                  </span>
                  <span className="font-mono">{formatCurrencyMobile(userEntered.creditGiven || 0)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Collected:</span>
                <span className="font-mono">{formatCurrencyMobile(userEntered.totalCollected)}</span>
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
                  {differences.cashDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.cashDifference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.cardDifference)}
                  Card:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.cardDifference)}`}>
                  {differences.cardDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.cardDifference)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.upiDifference)}
                  UPI:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.upiDifference)}`}>
                  {differences.upiDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.upiDifference)}
                </span>
              </div>
              {differences.creditDifference !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    {getDifferenceIcon(differences.creditDifference)}
                    Credit:
                  </span>
                  <span className={`font-mono ${getDifferenceColor(differences.creditDifference)}`}>
                    {differences.creditDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.creditDifference)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span className="flex items-center gap-1">
                  {getDifferenceIcon(differences.totalDifference)}
                  Total:
                </span>
                <span className={`font-mono ${getDifferenceColor(differences.totalDifference)}`}>
                  {differences.totalDifference >= 0 ? '+' : ''}{formatCurrencyMobile(differences.totalDifference)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onCloseDay}
            disabled={isClosing || isReconciled}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isClosing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Closing Day...
              </>
            ) : isReconciled ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Day Already Closed
              </>
            ) : (
              'Accept & Close Day'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
