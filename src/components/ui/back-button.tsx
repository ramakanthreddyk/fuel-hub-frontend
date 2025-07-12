
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigateBack } from '@/utils/navigation';

interface BackButtonProps {
  /** Fallback route if no history available */
  fallback?: string;
  /** Custom label for the button */
  label?: string;
  /** Button variant */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Additional CSS classes */
  className?: string;
  /** Custom onClick handler */
  onClick?: () => void;
}

/**
 * Universal back button component with smart navigation
 * Uses browser history when available, falls back to specified route
 */
export function BackButton({ 
  fallback = '/dashboard',
  label = 'Back',
  variant = 'outline',
  size = 'sm',
  className = '',
  onClick
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigateBack(navigate, fallback);
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Back</span>
    </Button>
  );
}
