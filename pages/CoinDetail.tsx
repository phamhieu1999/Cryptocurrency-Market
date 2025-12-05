import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCoinById, clearSelectedCoin } from '../store/cryptoSlice';
import { ArrowLeft, ExternalLink, Share2, Star, Info, FileText, Github } from 'lucide-react';
import { formatCurrency, formatCompactNumber, PercentChange } from '../components/Formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PriceCell } from '../components/PriceCell';

export const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedCoin: coin, detailStatus } = useAppSelector((state) => state.crypto);
  const loading = detailStatus === 'loading' || detailStatus === 'idle';

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinById(id));
    }
    return () => {
      dispatch(clearSelectedCoin());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!coin) {
    return <div className="text-center py-20">Coin not found</div>;
  }

  const isPositive = coin.percentChange24h >= 0;
  const chartColor = isPositive ? '#16a34a' : '#dc2626';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <Link to="/" className="hover:text-blue-600">Cryptocurrencies</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Coins</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{coin.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
              <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 font-semibold rounded text-sm">{coin.symbol}</span>
              <div className="ml-auto flex gap-2">
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Star size={18} /></button>
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Share2 size={18} /></button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-end gap-4">
              <PriceCell price={coin.price} className="text-4xl font-bold" />
              <div className={`flex items-center px-2 py-1 rounded-lg text-lg font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <PercentChange value={coin.percentChange24h} />
                <span className="ml-1 text-sm">(24h)</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900">{coin.name} Price Chart ({coin.symbol})</h3>
                 <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-semibold">1D</button>
                    <button className="px-3 py-1 text-gray-500 hover:text-gray-900 text-xs font-medium">7D</button>
                    <button className="px-3 py-1 text-gray-500 hover:text-gray-900 text-xs font-medium">1M</button>
                    <button className="px-3 py-1 text-gray-500 hover:text-gray-900 text-xs font-medium">1Y</button>
                 </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={coin.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="date" 
                        tick={{fontSize: 12, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false}
                        minTickGap={30}
                    />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        tick={{fontSize: 12, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(val) => `$${val.toLocaleString()}`}
                    />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{color: '#111827', fontWeight: 600}}
                        formatter={(value: number) => [formatCurrency(value), 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          {/* Description */}
          {coin.description && (
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h3 className="text-xl font-bold mb-4">About {coin.name}</h3>
                 <p className="text-gray-600 leading-relaxed">{coin.description}</p>
             </div>
          )}

        </div>

        {/* Sidebar Stats (Right Column) */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">{coin.symbol} Statistics</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">Market Cap</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(coin.marketCap)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">Volume (24h)</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(coin.volume24h)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">Circulating Supply</span>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{formatCompactNumber(coin.circulatingSupply)} {coin.symbol}</div>
                        </div>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Rank</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{coin.rank}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Official Links</h3>
                <div className="space-y-3">
                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 p-2 rounded-lg">
                        <ExternalLink size={16} /> Website
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 p-2 rounded-lg">
                        <FileText size={16} /> Whitepaper
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 p-2 rounded-lg">
                        <Github size={16} /> Source Code
                    </a>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};