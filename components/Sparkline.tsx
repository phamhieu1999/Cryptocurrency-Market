import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { HistoricalPoint } from '../types';

interface SparklineProps {
  data: HistoricalPoint[];
  isPositive: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, isPositive }) => {
  const color = isPositive ? '#16a34a' : '#dc2626'; // green-600 : red-600

  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};