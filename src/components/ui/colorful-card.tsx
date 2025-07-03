
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ColorfulCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}

export function ColorfulCard({ 
  children, 
  className, 
  gradient = "from-white via-blue-50 to-indigo-50",
  hover = true 
}: ColorfulCardProps) {
  return (
    <Card className={cn(
      `bg-gradient-to-br ${gradient} shadow-lg border-0 rounded-2xl overflow-hidden`,
      hover && "hover:shadow-xl hover:scale-[1.02] transition-all duration-200",
      className
    )}>
      {children}
    </Card>
  );
}

export { CardContent, CardHeader };
