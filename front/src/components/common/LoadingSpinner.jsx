import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 'md', message = 'Chargement...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-sky-400`} />
      {message && <p className="text-gray-500 text-sm">{message}</p>}
    </div>
  );
}
