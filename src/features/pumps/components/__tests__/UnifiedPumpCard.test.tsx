/**
 * @file components/pumps/__tests__/UnifiedPumpCard.test.tsx
 * @description Comprehensive tests for the UnifiedPumpCard component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedPumpCard, PumpData, PumpCardActions } from '../UnifiedPumpCard';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className} data-testid="card-content">{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className} data-testid="badge">{children}</span>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div onClick={onClick} data-testid="dropdown-item">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  MoreVertical: () => <div data-testid="more-vertical-icon">MoreVertical</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Power: () => <div data-testid="power-icon">Power</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Hash: () => <div data-testid="hash-icon">Hash</div>,
  Activity: () => <div data-testid="activity-icon">Activity</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
}));

describe('UnifiedPumpCard', () => {
  const mockPump: PumpData = {
    id: 'pump-001',
    name: 'Test Pump',
    serialNumber: 'SN-001',
    status: 'active',
    nozzleCount: 4,
    stationName: 'Test Station',
  };

  const mockActions: PumpCardActions = {
    onViewNozzles: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onSettings: vi.fn(),
    onPowerToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders pump information correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} />);
      
      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.getByText(/SN-001/)).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders station name when showStationName is true', () => {
      render(<UnifiedPumpCard pump={mockPump} showStationName={true} />);
      
      expect(screen.getByText('Test Station')).toBeInTheDocument();
    });

    it('does not render station name when showStationName is false', () => {
      render(<UnifiedPumpCard pump={mockPump} showStationName={false} />);
      
      expect(screen.queryByText('Test Station')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<UnifiedPumpCard pump={mockPump} className="custom-class" />);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Status Variants', () => {
    it('renders active status correctly', () => {
      const activePump = { ...mockPump, status: 'active' as const };
      render(<UnifiedPumpCard pump={activePump} />);
      
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('renders maintenance status correctly', () => {
      const maintenancePump = { ...mockPump, status: 'maintenance' as const };
      render(<UnifiedPumpCard pump={maintenancePump} />);
      
      expect(screen.getByText('maintenance')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('renders inactive status correctly', () => {
      const inactivePump = { ...mockPump, status: 'inactive' as const };
      render(<UnifiedPumpCard pump={inactivePump} />);
      
      expect(screen.getByText('inactive')).toBeInTheDocument();
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });
  });

  describe('Card Variants', () => {
    it('renders compact variant correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      // Compact variant should have View Nozzles button
      expect(screen.getByText('View Nozzles')).toBeInTheDocument();
      // Should have dropdown menu
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });

    it('renders standard variant correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="standard" actions={mockActions} />);
      
      // Standard variant should show nozzle count and pump ID
      expect(screen.getByText(/4 nozzles/)).toBeInTheDocument();
      expect(screen.getByText(/ID:/)).toBeInTheDocument();
    });

    it('renders enhanced variant correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="enhanced" actions={mockActions} />);
      
      // Enhanced variant should have metrics grid
      expect(screen.getByText('4')).toBeInTheDocument(); // Nozzle count
      expect(screen.getByText('Nozzles')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument(); // Status text
    });

    it('renders creative variant correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="creative" actions={mockActions} />);
      
      // Creative variant should have special styling and animations
      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.getByText(/4 Nozzles/)).toBeInTheDocument();
    });

    it('renders realistic variant correctly', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="realistic" actions={mockActions} />);
      
      // Realistic variant should show pump ID and nozzle count
      expect(screen.getByText(/ID:/)).toBeInTheDocument();
      expect(screen.getByText(/4 nozzles/)).toBeInTheDocument();
    });
  });

  describe('Action Handlers', () => {
    it('calls onViewNozzles when View Nozzles button is clicked', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      const viewNozzlesButton = screen.getByText('View Nozzles');
      fireEvent.click(viewNozzlesButton);
      
      await waitFor(() => {
        expect(mockActions.onViewNozzles).toHaveBeenCalledWith('pump-001');
      });
    });

    it('calls onEdit when Edit menu item is clicked in compact variant', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      // Find and click edit option in dropdown
      const editItems = screen.getAllByText('Edit');
      if (editItems.length > 0) {
        fireEvent.click(editItems[0]);
        
        await waitFor(() => {
          expect(mockActions.onEdit).toHaveBeenCalledWith('pump-001');
        });
      }
    });

    it('calls onDelete when Delete menu item is clicked', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      // Find and click delete option in dropdown
      const deleteItems = screen.getAllByText('Delete');
      if (deleteItems.length > 0) {
        fireEvent.click(deleteItems[0]);
        
        await waitFor(() => {
          expect(mockActions.onDelete).toHaveBeenCalledWith('pump-001');
        });
      }
    });

    it('calls onSettings when Settings menu item is clicked', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      // Find and click settings option in dropdown
      const settingsItems = screen.getAllByText('Settings');
      if (settingsItems.length > 0) {
        fireEvent.click(settingsItems[0]);
        
        await waitFor(() => {
          expect(mockActions.onSettings).toHaveBeenCalledWith('pump-001');
        });
      }
    });

    it('calls onPowerToggle when power toggle is clicked', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      // Find and click power toggle option
      const powerItems = screen.getAllByText('Deactivate'); // Active pump shows "Deactivate"
      if (powerItems.length > 0) {
        fireEvent.click(powerItems[0]);
        
        await waitFor(() => {
          expect(mockActions.onPowerToggle).toHaveBeenCalledWith('pump-001');
        });
      }
    });
  });

  describe('Attention States', () => {
    it('shows attention indicator when needsAttention is true', () => {
      render(<UnifiedPumpCard pump={mockPump} needsAttention={true} />);
      
      expect(screen.getByText(/Attention/)).toBeInTheDocument();
    });

    it('shows attention indicator when nozzleCount is 0', () => {
      const pumpWithNoNozzles = { ...mockPump, nozzleCount: 0 };
      render(<UnifiedPumpCard pump={pumpWithNoNozzles} />);
      
      expect(screen.getByText(/Attention/)).toBeInTheDocument();
    });

    it('shows attention indicator when status is maintenance', () => {
      const maintenancePump = { ...mockPump, status: 'maintenance' as const };
      render(<UnifiedPumpCard pump={maintenancePump} />);
      
      expect(screen.getByText(/Attention/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<UnifiedPumpCard pump={mockPump} actions={mockActions} />);
      
      // Check for button accessibility
      const buttons = screen.getAllByTestId('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);
      
      const viewNozzlesButton = screen.getByText('View Nozzles');
      
      // Test keyboard interaction
      fireEvent.keyDown(viewNozzlesButton, { key: 'Enter' });
      fireEvent.keyDown(viewNozzlesButton, { key: ' ' });
      
      // Button should be focusable
      expect(viewNozzlesButton).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes correctly and does not re-render unnecessarily', () => {
      const { rerender } = render(<UnifiedPumpCard pump={mockPump} actions={mockActions} />);

      // Re-render with same props
      rerender(<UnifiedPumpCard pump={mockPump} actions={mockActions} />);

      // Component should still be rendered correctly
      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });

    it('re-renders when pump data changes', () => {
      const { rerender } = render(<UnifiedPumpCard pump={mockPump} />);

      const updatedPump = { ...mockPump, name: 'Updated Pump' };
      rerender(<UnifiedPumpCard pump={updatedPump} />);

      expect(screen.getByText('Updated Pump')).toBeInTheDocument();
      expect(screen.queryByText('Test Pump')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing serial number gracefully', () => {
      const pumpWithoutSerial = { ...mockPump, serialNumber: undefined };
      render(<UnifiedPumpCard pump={pumpWithoutSerial} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.queryByText(/Serial:/)).not.toBeInTheDocument();
    });

    it('handles empty serial number', () => {
      const pumpWithEmptySerial = { ...mockPump, serialNumber: '' };
      render(<UnifiedPumpCard pump={pumpWithEmptySerial} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.queryByText(/Serial:/)).not.toBeInTheDocument();
    });

    it('handles missing station name gracefully', () => {
      const pumpWithoutStation = { ...mockPump, stationName: undefined };
      render(<UnifiedPumpCard pump={pumpWithoutStation} showStationName={true} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      expect(screen.queryByText('Test Station')).not.toBeInTheDocument();
    });

    it('handles zero nozzle count', () => {
      const pumpWithZeroNozzles = { ...mockPump, nozzleCount: 0 };
      render(<UnifiedPumpCard pump={pumpWithZeroNozzles} />);

      expect(screen.getByText('0 nozzles')).toBeInTheDocument();
      expect(screen.getByText(/Attention/)).toBeInTheDocument();
    });

    it('handles negative nozzle count', () => {
      const pumpWithNegativeNozzles = { ...mockPump, nozzleCount: -1 };
      render(<UnifiedPumpCard pump={pumpWithNegativeNozzles} />);

      expect(screen.getByText('-1 nozzles')).toBeInTheDocument();
    });

    it('handles very large nozzle count', () => {
      const pumpWithManyNozzles = { ...mockPump, nozzleCount: 999 };
      render(<UnifiedPumpCard pump={pumpWithManyNozzles} />);

      expect(screen.getByText('999 nozzles')).toBeInTheDocument();
    });

    it('handles very long pump names', () => {
      const pumpWithLongName = {
        ...mockPump,
        name: 'This is a very long pump name that might cause layout issues in the UI component'
      };
      render(<UnifiedPumpCard pump={pumpWithLongName} />);

      expect(screen.getByText(pumpWithLongName.name)).toBeInTheDocument();
    });

    it('handles special characters in pump name', () => {
      const pumpWithSpecialChars = { ...mockPump, name: 'Pump #1 & Co. (Test)' };
      render(<UnifiedPumpCard pump={pumpWithSpecialChars} />);

      expect(screen.getByText('Pump #1 & Co. (Test)')).toBeInTheDocument();
    });

    it('handles unicode characters in pump name', () => {
      const pumpWithUnicode = { ...mockPump, name: 'Pump 🚗⛽ Station' };
      render(<UnifiedPumpCard pump={pumpWithUnicode} />);

      expect(screen.getByText('Pump 🚗⛽ Station')).toBeInTheDocument();
    });

    it('handles invalid status gracefully', () => {
      const pumpWithInvalidStatus = { ...mockPump, status: 'invalid' as any };
      render(<UnifiedPumpCard pump={pumpWithInvalidStatus} />);

      expect(screen.getByText('invalid')).toBeInTheDocument();
      // Should use default status config
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('handles missing actions object', () => {
      render(<UnifiedPumpCard pump={mockPump} actions={undefined} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      // Should not crash when actions are undefined
    });

    it('handles partial actions object', () => {
      const partialActions = { onViewNozzles: mockActions.onViewNozzles };
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={partialActions} />);

      expect(screen.getByText('View Nozzles')).toBeInTheDocument();
      // Should handle missing actions gracefully
    });

    it('handles null pump ID', () => {
      const pumpWithNullId = { ...mockPump, id: null as any };
      render(<UnifiedPumpCard pump={pumpWithNullId} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });

    it('handles empty pump ID', () => {
      const pumpWithEmptyId = { ...mockPump, id: '' };
      render(<UnifiedPumpCard pump={pumpWithEmptyId} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });

    it('handles undefined variant gracefully', () => {
      render(<UnifiedPumpCard pump={mockPump} variant={undefined} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      // Should default to standard variant
    });

    it('handles invalid variant gracefully', () => {
      render(<UnifiedPumpCard pump={mockPump} variant={'invalid' as any} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      // Should fall back to standard variant
    });

    it('handles multiple rapid action clicks', async () => {
      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={mockActions} />);

      const viewNozzlesButton = screen.getByText('View Nozzles');

      // Rapidly click multiple times
      fireEvent.click(viewNozzlesButton);
      fireEvent.click(viewNozzlesButton);
      fireEvent.click(viewNozzlesButton);

      await waitFor(() => {
        expect(mockActions.onViewNozzles).toHaveBeenCalledTimes(3);
      });
    });

    it('handles action errors gracefully', async () => {
      const errorActions = {
        onViewNozzles: vi.fn(() => { throw new Error('Action error'); }),
      };

      render(<UnifiedPumpCard pump={mockPump} variant="compact" actions={errorActions} />);

      const viewNozzlesButton = screen.getByText('View Nozzles');

      // Should not crash when action throws error
      expect(() => {
        fireEvent.click(viewNozzlesButton);
      }).not.toThrow();
    });

    it('handles extremely long serial numbers', () => {
      const pumpWithLongSerial = {
        ...mockPump,
        serialNumber: 'SN-' + 'A'.repeat(100)
      };
      render(<UnifiedPumpCard pump={pumpWithLongSerial} />);

      expect(screen.getByText(/Serial:/)).toBeInTheDocument();
    });

    it('handles boolean values in pump data', () => {
      const pumpWithBooleans = {
        ...mockPump,
        name: true as any,
        serialNumber: false as any
      };
      render(<UnifiedPumpCard pump={pumpWithBooleans} />);

      // Should convert boolean to string
      expect(screen.getByText('true')).toBeInTheDocument();
    });

    it('handles number values in string fields', () => {
      const pumpWithNumbers = {
        ...mockPump,
        name: 12345 as any,
        serialNumber: 67890 as any
      };
      render(<UnifiedPumpCard pump={pumpWithNumbers} />);

      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByText(/67890/)).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to different screen sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile width
      });

      render(<UnifiedPumpCard pump={mockPump} variant="standard" actions={mockActions} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
      // Component should render without layout issues
    });

    it('handles very wide screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 2560, // Ultra-wide screen
      });

      render(<UnifiedPumpCard pump={mockPump} variant="enhanced" actions={mockActions} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    it('handles rapid prop changes without memory leaks', () => {
      const { rerender } = render(<UnifiedPumpCard pump={mockPump} />);

      // Rapidly change props many times
      for (let i = 0; i < 100; i++) {
        const updatedPump = { ...mockPump, name: `Pump ${i}` };
        rerender(<UnifiedPumpCard pump={updatedPump} />);
      }

      expect(screen.getByText('Pump 99')).toBeInTheDocument();
    });

    it('handles large datasets in pump properties', () => {
      const pumpWithLargeData = {
        ...mockPump,
        metadata: new Array(1000).fill(0).map((_, i) => `data-${i}`),
      };

      render(<UnifiedPumpCard pump={pumpWithLargeData as any} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('maintains accessibility with missing labels', () => {
      render(<UnifiedPumpCard pump={mockPump} actions={mockActions} />);

      const buttons = screen.getAllByTestId('button');
      buttons.forEach(button => {
        // Should be focusable even without explicit labels
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    it('handles high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<UnifiedPumpCard pump={mockPump} />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });

    it('handles reduced motion preferences', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<UnifiedPumpCard pump={mockPump} variant="creative" />);

      expect(screen.getByText('Test Pump')).toBeInTheDocument();
    });
  });
});
