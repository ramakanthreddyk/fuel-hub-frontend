/**
 * @file NewReadingPage.tsx
 * @description Form to enter a new reading for a nozzle
 */
import { useParams, useLocation } from 'react-router-dom';
import { ReadingEntryForm } from '@/components/readings/ReadingEntryForm';
import { useNozzle } from '@/hooks/api/useNozzles';
import { usePumps } from '@/hooks/api/usePumps';
import { useStations } from '@/hooks/api/useStations';

export default function NewReadingPage() {
  const { nozzleId } = useParams<{ nozzleId: string }>();
  const location = useLocation();
  
  // Get preselected values from navigation state or derive from nozzle data
  const preselected = location.state?.preselected;
  
  const { data: nozzle } = useNozzle(nozzleId);
  const { data: pumps = [] } = usePumps();
  const { data: stations = [] } = useStations();
  
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
