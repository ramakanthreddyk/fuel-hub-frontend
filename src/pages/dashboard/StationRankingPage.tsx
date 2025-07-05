import { useState } from 'react';
import { StationRanking } from '@/components/analytics/StationRanking';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StationRankingPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Station Ranking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-40">
            <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <StationRanking period={period} />
        </CardContent>
      </Card>
    </div>
  );
}
