import { cn } from "@/lib/utils";

interface FuelLoaderProps {
  className?: string;
  text?: string;
}

export function FuelLoader({ className, text }: FuelLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative w-64 h-80 flex flex-col items-center justify-center">
        {/* Fuel Truck Base */}
        <div className="relative w-56 h-32 bg-white rounded-lg border border-gray-300 shadow-xl flex items-center px-4">
          {/* Truck Cab */}
          <div className="w-12 h-16 bg-blue-600 rounded-md mr-3 shadow-md flex flex-col justify-between py-1">
            <div className="w-3 h-3 bg-white rounded-full mx-auto" />
            <div className="w-8 h-2 bg-white rounded mx-auto" />
          </div>

          {/* Fuel Tank */}
          <div className="flex-1 h-14 bg-gray-100 rounded-full border border-gray-300 px-2 flex items-center shadow-inner">
            <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-loader" />
            </div>
          </div>
        </div>

        {/* Wheels Aligned Below Truck */}
        <div className="absolute top-[168px] left-[48px] flex gap-10">
          <div className="w-5 h-5 bg-black rounded-full shadow-sm" />
          <div className="w-5 h-5 bg-black rounded-full shadow-sm" />
          <div className="w-5 h-5 bg-black rounded-full shadow-sm" />
        </div>
      </div>

      {text && (
        <div className="text-sm text-gray-600 dark:text-gray-300 animate-pulse text-center px-4">
          {text}
        </div>
      )}

      <style jsx>{`
        @keyframes loader {
          0% {
            width: 0%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 0%;
          }
        }

        .animate-loader {
          animation: loader 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
