
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
      {/* Stats in Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="text-xs font-bold text-blue-700">{formatNumber(transactions)}</div>
          <div className="text-[10px] text-blue-600">Sales Today</div>
        </div>
        <div className="text-center p-1.5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="text-xs font-bold text-purple-700">{activePumps}/{totalPumps}</div>
          <div className="text-[10px] text-purple-600">Active Pumps</div>
        </div>
      </div>
      
      {/* Today's Sales - Full Width Row (moved to bottom) */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100">
        <div className="text-center">
          <div className="text-[10px] font-medium text-green-600 mb-0.5">Status</div>
          <div className="text-xs font-bold text-green-700 capitalize">
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
