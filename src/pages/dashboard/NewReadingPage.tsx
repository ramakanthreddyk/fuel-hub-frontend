/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useParams, useLocation } from 'react-router-dom';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { useNozzle } from '@/hooks/api/useNozzles';
import { usePumps } from '@/hooks/api/usePumps';
import { useStations } from '@/hooks/api/useStations';
import { useFuelStore } from '@/store/fuelStore';
import { useEffect } from 'react';

export default function NewReadingPage() {
  const { nozzleId } = useParams<{ nozzleId: string }>();
  const location = useLocation();
  
  // Get state from Zustand store
  const { selectNozzle, selectPump, selectStation } = useFuelStore();
  
  // Get preselected values from navigation state or derive from nozzle data
  const preselected = location.state?.preselected;
  
  const { data: nozzle } = useNozzle(nozzleId);
  const { data: pumps = [] } = usePumps();
  const { data: stations = [] } = useStations();
  
  // Update store when nozzle data is available
  useEffect(() => {
    if (nozzle) {
      selectNozzle(nozzle.id);
      if (nozzle.pumpId) {
        selectPump(nozzle.pumpId);
        const pump = pumps.find(p => p.id === nozzle.pumpId);
        if (pump?.stationId) {
          selectStation(pump.stationId);
          console.log('[NEW-READING-PAGE] Setting station ID:', pump.stationId);
        }
      }
    }
  }, [nozzle, pumps, selectNozzle, selectPump, selectStation]);
  
  // Also update store from preselected values in location state
  useEffect(() => {
    if (location.state?.preselected) {
      const { stationId, pumpId, nozzleId } = location.state.preselected;
      if (stationId) {
        selectStation(stationId);
        console.log('[NEW-READING-PAGE] Setting station ID from state:', stationId);
      }
      if (pumpId) selectPump(pumpId);
      if (nozzleId) selectNozzle(nozzleId);
    }
  }, [location.state, selectStation, selectPump, selectNozzle]);
  
  // If we have nozzle data but no preselected values, derive them
  let finalPreselected = preselected;
  if (nozzle && !preselected) {
    const pump = pumps.find(p => p.id === nozzle.pumpId);
    const station = stations.find(s => s.id === pump?.stationId);
    
    finalPreselected = {
      stationId: station?.id,
      pumpId: pump?.id,
      nozzleId: nozzle.id
    };
  }
  
  return <ReadingEntryForm preselected={finalPreselected} />;
}
