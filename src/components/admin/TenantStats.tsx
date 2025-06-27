
interface TenantStatsProps {
  stationCount: number;
  userCount: number;
}

export function TenantStats({ stationCount, userCount }: TenantStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{stationCount}</div>
        <div className="text-xs text-muted-foreground font-medium">Stations</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{userCount}</div>
        <div className="text-xs text-muted-foreground font-medium">Users</div>
      </div>
    </div>
  );
}
