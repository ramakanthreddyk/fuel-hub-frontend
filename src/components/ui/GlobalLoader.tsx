import { useGlobalLoader } from '@/hooks/useGlobalLoader';
import { FuelLoader } from './FuelLoader';

export function GlobalLoader() {
  const { isLoading, message } = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <FuelLoader size="lg" text={message || 'Loading...'} />
      </div>
    </div>
  );
}