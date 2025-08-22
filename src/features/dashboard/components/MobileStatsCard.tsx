
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MobileStatsCardProps {
  stats: Array<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
  }>;
}

export function MobileStatsCard({ stats }: MobileStatsCardProps) {
  return (
    <Card className="md:hidden">
      <CardHeader>
        <CardTitle className="text-lg">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color || 'text-muted-foreground'}`} />
              </div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
