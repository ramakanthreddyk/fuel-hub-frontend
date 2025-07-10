
import { cn } from '@/lib/utils';
import { FuelLoadingSpinner } from './FuelLoadingSpinner';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return <FuelLoadingSpinner size={size} className={className} text={text} />;
}
