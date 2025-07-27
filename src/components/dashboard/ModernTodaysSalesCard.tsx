
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Fuel, Users, CreditCard } from 'lucide-react';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency, formatVolume } from '@/utils/formatters';

interface ModernTodaysSalesCardProps {
  date?: string;
}

export function ModernTodaysSalesCard({ date }: ModernTodaysSalesCardProps) {
  const { data: todaysSales, isLoading } = useTodaysSales(date);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 sm:h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Revenue",
      shortTitle: "Revenue",
      value: formatCurrency(todaysSales?.totalAmount || 0, { useLakhsCrores: true }),
      mobileValue: formatCurrency(todaysSales?.totalAmount || 0, { useLakhsCrores: true, maximumFractionDigits: 1 }),
      icon: DollarSign,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Volume",
      shortTitle: "Volume",
      value: formatVolume(todaysSales?.totalVolume || 0, 0, true),
      mobileValue: `${todaysSales?.totalVolume >= 1000 ? `${(todaysSales.totalVolume / 1000).toFixed(1)}KL` : `${Math.round(todaysSales?.totalVolume || 0)}L`}`,
      icon: Fuel,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Transactions',
      shortTitle: 'Orders',
      value: (todaysSales?.totalEntries || 0).toString(),
      icon: CreditCard,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Stations',
      shortTitle: 'Stations',
      value: (todaysSales?.salesByStation?.length || 0).toString(),
      icon: Users,
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((metric, index) => (
        <Card key={metric.title} className={`relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group ${metric.bgColor}`}>
          <CardContent className="p-3 sm:p-4">
            {/* Background gradient effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              {/* Icon and Value Row */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${metric.color} shadow-sm`}>
                  <metric.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="text-right flex-1 min-w-0">
                  <div className="text-sm sm:text-2xl font-bold text-gray-900 truncate">
                    <span className="sm:hidden">{metric.mobileValue || metric.value}</span>
                    <span className="hidden sm:inline">{metric.value}</span>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                <span className="sm:hidden">{metric.shortTitle}</span>
                <span className="hidden sm:inline">{metric.title}</span>
              </div>
              
              {/* Optional trend indicator for mobile */}
              <div className="flex items-center gap-1 mt-1 sm:hidden">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
