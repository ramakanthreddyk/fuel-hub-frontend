/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useParams, useLocation } from 'react-router-dom';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { useNozzleDetails } from '@/hooks/api/useNozzleDetails';
import { useFuelStore } from '@/store/fuelStore';
import { useDataStore } from '@/store/dataStore';
import { useEffect } from 'react';

export default function NewReadingPage() {
  const { nozzleId, pumpId, stationId } = useParams<{ nozzleId: string; pumpId: string; stationId: string }>();
  const location = useLocation();
  
  // Get preselected values from navigation state or URL params
  const navigationPreselected = location.state?.preselected;
  const urlPreselected = {
    stationId: stationId || undefined,
    pumpId: pumpId || undefined,
    nozzleId: nozzleId || undefined
  };
  
  const preselected = navigationPreselected || urlPreselected;
  
  // Log the preselected values for debugging
  console.log('[NEW-READING-PAGE] URL params:', { stationId, pumpId, nozzleId });
  console.log('[NEW-READING-PAGE] Preselected values:', preselected);
  
  // Use the hook to fetch nozzle details - but disable store updates
  const { nozzle, pump, station, isLoading, error } = useNozzleDetails(nozzleId, false);
  
  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('[NEW-READING-PAGE] Error loading nozzle details:', error);
    }
  }, [error]);
  
  // Derive final preselected values
  let finalPreselected = preselected;
  
  // If we have nozzle data but no preselected values, derive them
  if (nozzle && pump && (!preselected.stationId || !preselected.pumpId)) {
    finalPreselected = {
      stationId: station?.id || preselected.stationId,
      pumpId: pump?.id || preselected.pumpId,
      nozzleId: nozzle.id || preselected.nozzleId
    };
    
    console.log('[NEW-READING-PAGE] Derived preselected values:', finalPreselected);
  }
  
  return <ReadingEntryForm preselected={finalPreselected} />;
}
