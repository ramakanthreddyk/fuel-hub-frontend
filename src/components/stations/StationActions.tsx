
/**
 * @file components/stations/StationActions.tsx
 * @description Enhanced action buttons for station cards with improved styling and animations
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ArrowRight } from 'lucide-react';

interface StationActionsProps {
  onView: () => void;
  onDelete: () => void;
}

export function StationActions({ onView, onDelete }: StationActionsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onView}
        className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
        <div className="relative flex items-center justify-center gap-2">
          <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          <span>View Details</span>
          <ArrowRight className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-200" />
        </div>
      </Button>

      <Button
        onClick={onDelete}
        variant="outline"
        className="group/del relative overflow-hidden border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
      >
        <div className="absolute inset-0 bg-red-50/0 group-hover/del:bg-red-50/50 transition-colors duration-300"></div>
        <Trash2 className="h-4 w-4 relative z-10 group-hover/del:scale-110 group-hover/del:rotate-12 transition-all duration-200" />
      </Button>
    </div>
  );
}
