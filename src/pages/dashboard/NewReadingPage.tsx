/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useParams, useLocation } from 'react-router-dom';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { useNozzleDetails } from '@/hooks/api/useNozzleDetails';
import { useFuelStore } from '@/store/fuelStore';
import { useDataStore } from '@/store/dataStore';
import { useEffect, useMemo } from 'react';

export default function NewReadingPage() {
  const { nozzleId, pumpId, stationId } = useParams<{ nozzleId: string; pumpId: string; stationId: string }>();
  const location = useLocation();
  
  // Memoize preselected values to prevent infinite loops
  const preselected = useMemo(() => {
    const navigationPreselected = location.state?.preselected;
    const urlPreselected = {
      stationId: stationId || undefined,
      pumpId: pumpId || undefined,
      nozzleId: nozzleId || undefined
    };
    return navigationPreselected || urlPreselected;
  }, [location.state?.preselected, stationId, pumpId, nozzleId]);
  
  // Use the hook to fetch nozzle details - but disable store updates
  const { nozzle, pump, station, isLoading, error } = useNozzleDetails(nozzleId, false);
  
  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('[NEW-READING-PAGE] Error loading nozzle details:', error);
    }
  }, [error]);
  
  // Memoize final preselected values
  const finalPreselected = useMemo(() => {
    if (nozzle && pump && (!preselected.stationId || !preselected.pumpId)) {
      return {
        stationId: station?.id || preselected.stationId,
        pumpId: pump?.id || preselected.pumpId,
        nozzleId: nozzle.id || preselected.nozzleId
      };
    }
    return preselected;
  }, [nozzle, pump, station, preselected]);
  
  return <ReadingEntryForm preselected={finalPreselected} />;
}
