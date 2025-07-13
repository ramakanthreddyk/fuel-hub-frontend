
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface StationQuickStatsProps {
  totalSales: number;
  transactions: number;
  activePumps: number;
  totalPumps: number;
}

export function StationQuickStats({ 
  totalSales, 
  transactions, 
  activePumps, 
  totalPumps 
}: StationQuickStatsProps) {
  return (
    <div className="space-y-2">
      {/* Today's Sales - Full Width Row */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
        <div className="text-center">
          <div className="text-xs font-medium text-green-600 mb-1">Today's Sales</div>
          <div className="text-lg font-bold text-green-700">
            {formatCurrency(totalSales, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Other Stats in Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="text-sm font-bold text-blue-700">{formatNumber(transactions)}</div>
          <div className="text-xs text-blue-600">Sales</div>
        </div>
        <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="text-sm font-bold text-purple-700">{activePumps}/{totalPumps}</div>
          <div className="text-xs text-purple-600">Pumps</div>
        </div>
      </div>
    </div>
  );
}
