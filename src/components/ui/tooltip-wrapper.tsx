
import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipWrapperProps {
  /** Content to show in tooltip */
  content: string;
  /** Element that triggers the tooltip */
  children: ReactNode;
  /** Tooltip placement */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing tooltip (ms) */
  delayDuration?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}

/**
 * Simplified tooltip wrapper component for consistent tooltip usage
 * 
 * @param content - Text to display in tooltip
 * @param children - Trigger element
 * @param side - Tooltip placement position
 * @param delayDuration - Delay in milliseconds before showing
 * @param disabled - Whether to disable the tooltip
 */
export function TooltipWrapper({ 
  content, 
  children, 
  side = 'top',
  delayDuration = 300,
  disabled = false
}: TooltipWrapperProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
