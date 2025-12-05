import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency } from './Formatters';

interface PriceCellProps {
  price: number;
  className?: string;
}

export const PriceCell: React.FC<PriceCellProps> = ({ price, className = "" }) => {
  const [colorClass, setColorClass] = useState('text-gray-900');
  const prevPrice = useRef(price);

  useEffect(() => {
    if (price > prevPrice.current) {
      // Flash Green
      setColorClass('text-green-600 transition-none');
      // Fade back
      setTimeout(() => setColorClass('text-gray-900 transition-colors duration-700'), 500);
    } else if (price < prevPrice.current) {
      // Flash Red
      setColorClass('text-red-600 transition-none');
      // Fade back
      setTimeout(() => setColorClass('text-gray-900 transition-colors duration-700'), 500);
    }
    prevPrice.current = price;
  }, [price]);

  return (
    <div className={`${colorClass} ${className}`}>
      {formatCurrency(price)}
    </div>
  );
};