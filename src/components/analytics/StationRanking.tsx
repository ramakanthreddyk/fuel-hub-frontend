
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStationRanking } from '@/hooks/useAnalytics';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface StationRankingProps {
  period?: 'today' | 'week' | 'month';
}

export function StationRanking({ period = 'month' }: StationRankingProps) {
  const { data: rankings = [], isLoading } = useStationRanking(period);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Station Performance Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Station Performance Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((station, index) => (
            <div 
              key={station.stationId || station.id} 
              className={`p-4 rounded-lg border-2 ${getRankColor(index + 1)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{station.stationName || station.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{(station.revenue || station.sales || 0).toLocaleString()} • {station.volume.toLocaleString()}L
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={(station.growth || 0) >= 0 ? 'default' : 'destructive'} className="mb-1">
                    {(station.growth || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(station.growth || 0)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Efficiency: {station.efficiency}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
