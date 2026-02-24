import { CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, status = 'neutral', change = null }) {
  const statusColors = {
    neutral: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  };

  const iconColors = {
    neutral: 'text-gray-400',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  };

  return (
    <div className={`${statusColors[status]} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== null && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className={change >= 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        {Icon && <Icon size={24} className={iconColors[status]} />}
      </div>
    </div>
  );
}
