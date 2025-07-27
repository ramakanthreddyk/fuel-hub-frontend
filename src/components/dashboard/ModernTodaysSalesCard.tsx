import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Fuel, Users, CreditCard } from 'lucide-react';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency, formatVolume } from '@/utils/formatters';

export function ModernTodaysSalesCard() {
  const { data: todaysSales, isLoading } = useTodaysSales();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(todaysSales?.totalAmount || 0, { useLakhsCrores: true }),
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+12%'
    },
    {
      title: 'Total Volume',
      value: formatVolume(todaysSales?.totalVolume || 0, 1, true),
      icon: Fuel,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+8%'
    },
    {
      title: 'Transactions',
      value: (todaysSales?.totalEntries || 0).toString(),
      icon: CreditCard,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+15%'
    },
    {
      title: 'Active Stations',
      value: (todaysSales?.salesByStation?.length || 0).toString(),
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '100%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={metric.title} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.color}`}>
                <metric.icon className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className={`${metric.bgColor} ${metric.textColor} border-transparent text-xs`}>
                {metric.change}
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}