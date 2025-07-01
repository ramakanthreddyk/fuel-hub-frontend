import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DebugPanelProps {
  title?: string;
  data?: any;
  showByDefault?: boolean;
}

export function DebugPanel({ title = 'Debug Info', data, showByDefault = false }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(showByDefault);

  if (!data) return null;

  return (
    <Card className="mt-4 border-dashed border-gray-300">
      <CardHeader className="py-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}>
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}