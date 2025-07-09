
/**
 * @file components/stations/StationActions.tsx
 * @description Action buttons for station card
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

interface StationActionsProps {
  onView: () => void;
  onDelete: () => void;
}

export function StationActions({ onView, onDelete }: StationActionsProps) {
  return (
    <div className="flex gap-3">
      <Button 
        onClick={onView}
        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </Button>
      <Button 
        onClick={onDelete}
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl hover:border-red-400 transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
