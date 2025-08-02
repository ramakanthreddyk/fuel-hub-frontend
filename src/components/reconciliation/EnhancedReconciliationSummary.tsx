/**
 * @file EnhancedReconciliationSummary.tsx
 * @description Enhanced reconciliation summary with validation and recommendations
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ValidationIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  field?: string;
  suggestedAction?: string;
}

interface ReconciliationSummary {
  date: string;
  stationId: string;
  stationName: string;
  systemCalculated: {
    totalRevenue: number;
    cashSales: number;
    cardSales: number;
    upiSales: number;
    creditSales: number;
    totalVolume: number;
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
    percentageDifference: number;
    isWithinTolerance: boolean;
  };
  isReconciled: boolean;
  validationIssues: ValidationIssue[];
  recommendedActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface EnhancedReconciliationSummaryProps {
  summary: ReconciliationSummary;
  onCloseDay: () => void;
  isClosing: boolean;
}

export function EnhancedReconciliationSummary({ 
  summary, 
  onCloseDay, 
  isClosing 
}: EnhancedReconciliationSummaryProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getValidationIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDifferenceIcon = (difference: number) => {
    if (difference > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (difference < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getDifferenceColor = (difference: number, isWithinTolerance: boolean) => {
    if (difference === 0) return 'text-gray-600';
    if (isWithinTolerance) return difference > 0 ? 'text-green-600' : 'text-orange-600';
    return 'text-red-600';
  };

  const hasErrors = summary.validationIssues.some(issue => issue.type === 'error');
  const canClose = !hasErrors && !summary.isReconciled;

  return (
    <div className="space-y-6">
      {/* Risk Level and Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={getRiskLevelColor(summary.riskLevel)}>
            {getRiskLevelIcon(summary.riskLevel)}
            <span className="ml-1 capitalize">{summary.riskLevel} Risk</span>
          </Badge>
          {summary.differences.isWithinTolerance && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              Within Tolerance
            </Badge>
          )}
        </div>
        
        {summary.isReconciled && (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Day Closed
          </Badge>
        )}
      </div>

      {/* Validation Issues */}
      {summary.validationIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Validation Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.validationIssues.map((issue, index) => (
              <Alert key={index} className={`border-l-4 ${
                issue.type === 'error' ? 'border-l-red-500 bg-red-50' :
                issue.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start gap-2">
                  {getValidationIcon(issue.type)}
                  <div className="flex-1">
                    <AlertDescription className="font-medium">
                      {issue.message}
                    </AlertDescription>
                    {issue.suggestedAction && (
                      <p className="text-sm text-gray-600 mt-1">
                        💡 {issue.suggestedAction}
                      </p>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Differences Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Differences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cash Difference */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash</p>
                <p className={`text-lg font-bold ${getDifferenceColor(summary.differences.cashDifference, summary.differences.isWithinTolerance)}`}>
                  {formatCurrency(Math.abs(summary.differences.cashDifference))}
                </p>
              </div>
              {getDifferenceIcon(summary.differences.cashDifference)}
            </div>

            {/* Card Difference */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Card</p>
                <p className={`text-lg font-bold ${getDifferenceColor(summary.differences.cardDifference, summary.differences.isWithinTolerance)}`}>
                  {formatCurrency(Math.abs(summary.differences.cardDifference))}
                </p>
              </div>
              {getDifferenceIcon(summary.differences.cardDifference)}
            </div>

            {/* UPI Difference */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">UPI</p>
                <p className={`text-lg font-bold ${getDifferenceColor(summary.differences.upiDifference, summary.differences.isWithinTolerance)}`}>
                  {formatCurrency(Math.abs(summary.differences.upiDifference))}
                </p>
              </div>
              {getDifferenceIcon(summary.differences.upiDifference)}
            </div>

            {/* Total Difference */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className={`text-lg font-bold ${getDifferenceColor(summary.differences.totalDifference, summary.differences.isWithinTolerance)}`}>
                  {formatCurrency(Math.abs(summary.differences.totalDifference))}
                </p>
                <p className="text-xs text-gray-500">
                  {summary.differences.percentageDifference.toFixed(2)}%
                </p>
              </div>
              {getDifferenceIcon(summary.differences.totalDifference)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      {summary.recommendedActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.recommendedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Close Day Button */}
      {canClose && (
        <div className="flex justify-end">
          <Button 
            onClick={onCloseDay}
            disabled={isClosing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isClosing ? 'Closing Day...' : 'Close Day'}
          </Button>
        </div>
      )}

      {hasErrors && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            Cannot close day due to validation errors. Please resolve the issues above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
