
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import type { StationComparison } from '@/api/api-contract';

interface StationComparisonChartProps {
  data: StationComparison[];
  title?: string;
}

export default function StationComparisonChart({ 
  data, 
  title = "Station Performance Comparison" 
}: StationComparisonChartProps) {
  const chartData = data.map(station => ({
    name: station.stationName,
    sales: station.currentPeriod.revenue,
    volume: station.currentPeriod.volume,
    transactions: station.currentPeriod.salesCount,
    growth: station.growth
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar dataKey="volume" fill="#82ca9d" name="Volume" />
              <Bar dataKey="transactions" fill="#ffc658" name="Transactions" />
              <Bar dataKey="growth" fill="#ff7300" name="Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
