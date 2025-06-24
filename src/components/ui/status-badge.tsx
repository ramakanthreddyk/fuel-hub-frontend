
interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'cancelled' | 'inactive';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    active: "bg-green-100 text-green-800 border-green-200",
    suspended: "bg-amber-100 text-amber-800 border-amber-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
