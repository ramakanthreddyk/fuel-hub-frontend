import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchableStationSelector } from "@/components/filters/SearchableStationSelector";
import { StationComparisonChart } from "@/components/analytics/StationComparisonChart";
import { AdvancedAnalytics } from "@/components/analytics/AdvancedAnalytics";
import { StationRanking } from "@/components/analytics/StationRanking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const queryClient = useQueryClient();
  const [stationId, setStationId] = useState<string>();
  const [stationIds, setStationIds] = useState<string[]>([]);
  const [rankingPeriod, setRankingPeriod] = useState<
    "today" | "week" | "month"
  >("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["analytics"] });
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Business insights and performance metrics"
        actions={
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {/* Station Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Station Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchableStationSelector
            multiple
            selectedValues={stationIds}
            onMultipleChange={setStationIds}
            onChange={() => {}}
            placeholder="Select stations"
          />
          {stationIds.length > 0 ? (
            <StationComparisonChart stationIds={stationIds} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Choose stations to view performance comparison.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Advanced Analytics for a single station */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchableStationSelector
            value={stationId}
            onChange={setStationId}
            placeholder="Select station"
          />
          {stationId ? (
            <AdvancedAnalytics stationId={stationId} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a station to view detailed analytics.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Station Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Station Ranking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-40">
            <Select
              value={rankingPeriod}
              onValueChange={(v) => setRankingPeriod(v as any)}
            >
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
          <StationRanking period={rankingPeriod} />
        </CardContent>
      </Card>

    </div>
  );
}
