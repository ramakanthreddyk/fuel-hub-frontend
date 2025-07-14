import { useNavigate } from 'react-router-dom';
import { useFuelStore } from '@/store/fuelStore';

/**
 * Custom hook for fuel navigation with state management
 * Provides navigation functions that update the Zustand store
 */
export function useFuelNavigation() {
  const navigate = useNavigate();
  const { 
    selectStation, 
    selectPump, 
    selectNozzle,
    resetSelections,
    selectedStationId,
    selectedPumpId,
    selectedNozzleId
  } = useFuelStore();

  /**
   * Navigate to a station and update the store
   */
  const navigateToStation = (stationId: string) => {
    selectStation(stationId);
    navigate(`/dashboard/stations/${stationId}`);
  };

  /**
   * Navigate to a pump and update the store
   */
  const navigateToPump = (pumpId: string, stationId?: string) => {
    if (stationId) {
      selectStation(stationId);
    }
    selectPump(pumpId);
    navigate(`/dashboard/pumps/${pumpId}`);
  };

  /**
   * Navigate to pump nozzles and update the store
   */
  const navigateToPumpNozzles = (pumpId: string, stationId?: string) => {
    if (stationId) {
      selectStation(stationId);
    }
    selectPump(pumpId);
    navigate(`/dashboard/pumps/${pumpId}/nozzles`);
  };

  /**
   * Navigate to a nozzle and update the store
   */
  const navigateToNozzle = (nozzleId: string, pumpId?: string, stationId?: string) => {
    if (stationId) {
      selectStation(stationId);
    }
    if (pumpId) {
      selectPump(pumpId);
    }
    selectNozzle(nozzleId);
    navigate(`/dashboard/nozzles/${nozzleId}`);
  };

  /**
   * Navigate to record a reading for a nozzle
   */
  const navigateToRecordReading = (nozzleId: string, pumpId?: string, stationId?: string) => {
    if (stationId) {
      selectStation(stationId);
    }
    if (pumpId) {
      selectPump(pumpId);
    }
    selectNozzle(nozzleId);
    navigate(`/dashboard/nozzles/${nozzleId}/readings/new`);
  };

  /**
   * Reset selections and navigate to dashboard
   */
  const navigateToDashboard = () => {
    resetSelections();
    navigate('/dashboard');
  };

  return {
    navigateToStation,
    navigateToPump,
    navigateToPumpNozzles,
    navigateToNozzle,
    navigateToRecordReading,
    navigateToDashboard,
    selectedStationId,
    selectedPumpId,
    selectedNozzleId
  };
}