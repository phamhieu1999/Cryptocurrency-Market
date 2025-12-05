import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const formatCurrency = (value: number, minimumFractionDigits = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

export const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(number);
};

interface PercentChangeProps {
  value: number;
  className?: string;
}

export const PercentChange: React.FC<PercentChangeProps> = ({ value, className = "" }) => {
  const isPositive = value >= 0;
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} ${className}`}>
      {isPositive ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
      <span className="font-semibold">{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
};