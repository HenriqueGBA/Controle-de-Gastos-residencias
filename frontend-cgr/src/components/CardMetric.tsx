import React from "react";
import { LucideIcon } from "lucide-react";

export interface CardMetricProps {
  name: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  loading?: boolean;
  cardBgColor?: string;
  iconBgColor?: string;
  valueSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};

export const CardMetric: React.FC<CardMetricProps> = ({
  name,
  value,
  icon: Icon,
  iconColor = "text-primary",
  loading = false,
  cardBgColor = "bg-white",
  iconBgColor = "bg-white",
  valueSize = "2xl",
  className = "",
}) => {
  return (
    <div
      className={`border border-gray-200 shadow-md flex items-center gap-3 px-5 py-4 rounded-xl hover:shadow-lg transition-all ${cardBgColor} ${className}`}
    >
      {Icon && (
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 ${iconBgColor}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      )}
      <div className="flex flex-col flex-1 justify-center min-w-0">
        <span className="text-xs text-gray-500 font-semibold">{name}</span>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <span className={`font-bold text-gray-900 break-words ${sizeClasses[valueSize] || ""}`}>
              {value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};