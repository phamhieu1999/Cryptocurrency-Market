import React, { useState, useEffect, useRef } from 'react';
import { MarketHighlights } from '../types';
import { formatCompactNumber } from './Formatters';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';

interface HighlightsSectionProps {
  highlights: MarketHighlights | null;
  loading: boolean;
}

// Internal component for animating values
const AnimatedValue = ({ value, format = (v: number) => v.toString(), className = "" }: { value: number, format?: (v: number) => React.ReactNode, className?: string }) => {
  const [colorClass, setColorClass] = useState('text-gray-900');
  const prevValue = useRef(value);

  useEffect(() => {
    // Only animate if value changed significantly (epsilon check for floats)
    if (Math.abs(value - prevValue.current) > 0.000001) {
        if (value > prevValue.current) {
            setColorClass('text-green-600 transition-none');
            setTimeout(() => setColorClass('text-gray-900 transition-colors duration-700'), 500);
        } else if (value < prevValue.current) {
            setColorClass('text-red-600 transition-none');
            setTimeout(() => setColorClass('text-gray-900 transition-colors duration-700'), 500);
        }
        prevValue.current = value;
    }
  }, [value]);

  return <span className={`${colorClass} ${className}`}>{format(value)}</span>;
};


export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ highlights, loading }) => {
  if (loading || !highlights) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-28 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide mb-8 -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0">
      <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-[1000px] lg:min-w-0">
        
        {/* Market Cap Card */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-1 text-sm font-bold text-gray-900 mb-1">
            Market Cap <ChevronRight size={14} className="text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
                <AnimatedValue value={highlights.marketCap.value} format={formatCompactNumber} />
            </span>
            <span className={`text-xs font-bold ${highlights.marketCap.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {highlights.marketCap.change}%
            </span>
          </div>
          <div className="h-8 mt-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={highlights.marketCap.history}>
                 <defs>
                   <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area type="monotone" dataKey="price" stroke="#dc2626" strokeWidth={2} fill="url(#colorCap)" isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Top Index Card */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[110px]">
           <div className="flex items-center gap-1 text-sm font-bold text-gray-900 mb-1">
            CMC20 <ChevronRight size={14} className="text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
                $
                <AnimatedValue value={highlights.topIndex.value} format={(v) => v.toFixed(2)} />
            </span>
            <span className={`text-xs font-bold ${highlights.topIndex.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {highlights.topIndex.change}%
            </span>
          </div>
          <div className="h-8 mt-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={highlights.topIndex.history}>
                  <defs>
                   <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area type="monotone" dataKey="price" stroke="#dc2626" strokeWidth={2} fill="url(#colorIndex)" isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Fear & Greed Card */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[110px]">
           <div className="flex items-center gap-1 text-sm font-bold text-gray-900 mb-1">
            Fear & Greed <ChevronRight size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between mt-2">
             <div className="relative w-24 h-12">
                 <svg viewBox="0 0 100 50" className="w-full h-full transform overflow-visible">
                    {/* Background Arc */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
                    {/* Color Arc */}
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="url(#gaugeGradient)" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="126" 
                      strokeDashoffset={126 - (126 * highlights.fearAndGreed.value / 100)} 
                      className="transition-all duration-1000 ease-out"
                    />
                     <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                    {/* Needle Ball */}
                    <circle cx="50" cy="50" r="4" fill="#111827" />
                 </svg>
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold">
                    <AnimatedValue value={highlights.fearAndGreed.value} />
                </div>
                <div className="text-xs font-medium text-gray-500">{highlights.fearAndGreed.sentiment}</div>
             </div>
          </div>
        </div>

        {/* Altcoin Season Card */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[110px]">
           <div className="flex items-center gap-1 text-sm font-bold text-gray-900 mb-1">
            Altcoin Season <ChevronRight size={14} className="text-gray-400" />
          </div>
          <div className="mt-2">
             <div className="flex items-end gap-1 mb-2">
                <span className="text-2xl font-bold">
                    <AnimatedValue value={highlights.altcoinSeason.value} />
                </span>
                <span className="text-gray-400 text-sm mb-1">/ 100</span>
             </div>
             <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-visible">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-yellow-100 to-blue-600 opacity-80"></div>
                 <div 
                    className="absolute top-1/2 -mt-2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-sm transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${highlights.altcoinSeason.value}%` }}
                 ></div>
             </div>
             <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                <span>Bitcoin</span>
                <span>Altcoin</span>
             </div>
          </div>
        </div>

        {/* Crypto RSI Card */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col justify-between min-h-[110px]">
           <div className="flex items-center gap-1 text-sm font-bold text-gray-900 mb-1">
            Average Crypto RSI <ChevronRight size={14} className="text-gray-400" />
          </div>
          <div className="mt-2">
              <div className="flex items-end gap-1 mb-2">
                <span className="text-2xl font-bold">
                    <AnimatedValue value={highlights.cryptoRsi.value} format={(v) => v.toFixed(2)} />
                </span>
             </div>
             <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-visible">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-gray-200 to-red-500 opacity-80"></div>
                 <div 
                    className="absolute top-1/2 -mt-2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-sm transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${highlights.cryptoRsi.value}%` }}
                 ></div>
             </div>
             <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                <span>Oversold</span>
                <span>Overbought</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};