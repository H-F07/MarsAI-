import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function Alert({ type = 'info', title, message, onClose }) {
  const typeConfig = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-500' },
    success: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-500' },
    danger: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, iconColor: 'text-red-500' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-3`}>
      <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}
