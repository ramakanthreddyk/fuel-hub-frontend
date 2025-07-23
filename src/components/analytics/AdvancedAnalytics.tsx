
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface AdvancedAnalyticsProps {
  data: {
    hourlySales: Array<{
      hour: number;
      sales: number;
      volume: number;
      transactions: number;
    }>;
    fuelPerformance: Array<{
      fuelType: string;
      sales: number;
      volume: number;
      margin: number;
      growth: number;
    }>;
  };
}

export default function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Hourly Sales Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlySales}>
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fuel Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.fuelPerformance}>
                <XAxis dataKey="fuelType" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <Line type="monotone" dataKey="volume" stroke="#82ca9d" />
                <Line type="monotone" dataKey="margin" stroke="#ffc658" />
                <Line type="monotone" dataKey="growth" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
