/**
 * @file QuickReadingButton.tsx
 * @description Floating action button for quick reading entry
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gauge, Plus } from 'lucide-react';
import { QuickReadingModal } from './QuickReadingModal';
import { useAuth } from '@/contexts/AuthContext';

interface QuickReadingButtonProps {
  variant?: 'floating' | 'inline' | 'compact';
  preselected?: {
    stationId?: string;
    pumpId?: string;
    nozzleId?: string;
  };
  className?: string;
}

export function QuickReadingButton({ 
  variant = 'floating', 
  preselected,
  className = '' 
}: QuickReadingButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  // Don't show for superadmin users
  if (user?.role === 'superadmin') {
    return null;
  }

  const handleClick = () => {
    setModalOpen(true);
  };

  if (variant === 'floating') {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleClick}
                size="lg"
                className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 z-50 ${className}`}
              >
                <Gauge className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick Reading Entry</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <QuickReadingModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          preselected={preselected}
        />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleClick}
                size="sm"
                variant="outline"
                className={`flex items-center gap-2 ${className}`}
              >
                <Gauge className="h-4 w-4" />
                Record
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Record Reading</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <QuickReadingModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          preselected={preselected}
        />
      </>
    );
  }

  // Inline variant
  return (
    <>
      <Button
        onClick={handleClick}
        className={`flex items-center gap-2 ${className}`}
      >
        <Plus className="h-4 w-4" />
        Record Reading
      </Button>

      <QuickReadingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        preselected={preselected}
      />
    </>
  );
}

export default QuickReadingButton;
