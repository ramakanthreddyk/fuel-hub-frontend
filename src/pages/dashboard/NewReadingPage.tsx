/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useParams, useLocation } from 'react-router-dom';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { useNozzleDetails } from '@/hooks/api/useNozzleDetails';
import { useFuelStore } from '@/store/fuelStore';
import { useEffect } from 'react';

export default function NewReadingPage() {
  const { nozzleId } = useParams<{ nozzleId: string }>();
  const location = useLocation();
  
  // Get state from Zustand store
  const { selectNozzle, selectPump, selectStation } = useFuelStore();
  
  // Get preselected values from navigation state
  const preselected = location.state?.preselected;
  
  // Use the new hook to fetch nozzle details including pump and station
  const { nozzle, pump, station, isLoading } = useNozzleDetails(nozzleId);
  
  // Update store from preselected values in location state
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
  
  // Derive preselected values from nozzle details
  let finalPreselected = preselected;
  if (nozzle && pump && !preselected) {
    finalPreselected = {
      stationId: station?.id,
      pumpId: pump?.id,
      nozzleId: nozzle.id
    };
    
    console.log('[NEW-READING-PAGE] Derived preselected values:', finalPreselected);
  }
  
  return <ReadingEntryForm preselected={finalPreselected} />;
}
