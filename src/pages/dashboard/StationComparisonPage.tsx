
import { useState } from 'react';
import { StationComparisonChart } from '@/components/analytics/StationComparisonChart';
import { SearchableStationSelector } from '@/components/filters/SearchableStationSelector';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StationComparisonPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Station Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchableStationSelector 
            multiple 
            selectedValues={selected} 
            onMultipleChange={setSelected}
            onChange={() => {}} // Add required onChange prop
          />
          {selected.length > 0 && (
            <StationComparisonChart stationIds={selected} period={period} />
          )}
          {selected.length === 0 && (
            <Button variant="outline" disabled>
              Select stations to view comparison
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
