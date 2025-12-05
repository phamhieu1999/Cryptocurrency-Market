import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExchanges } from '../store/cryptoSlice';
import { formatCurrency, formatCompactNumber } from '../components/Formatters';
import { Sparkline } from '../components/Sparkline';
import { Info } from 'lucide-react';

export const Exchanges = () => {
  const dispatch = useAppDispatch();
  const { exchanges, exchangeStatus } = useAppSelector((state) => state.crypto);
  const loading = exchangeStatus === 'loading' || exchangeStatus === 'idle';

  useEffect(() => {
    dispatch(fetchExchanges());
  }, [dispatch]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-600';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Top Cryptocurrency Spot Exchanges</h1>
          <p className="text-gray-500 mt-1">
            CoinMarketCap ranks and scores exchanges based on traffic, liquidity, trading volumes, and confidence in the legitimacy of trading volumes reported.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Exchange</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Trading Volume(24h)</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Avg. Liquidity</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Weekly Visits</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell"># Markets</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell"># Coins</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Fiat Supported</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Volume Graph (7d)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 15 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={10} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  exchanges.map((exchange) => (
                    <tr key={exchange.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{exchange.rank}</td>
                      <td className="px-4 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] md:shadow-none">
                        <div className="flex items-center">
                          <img 
                            src={exchange.image} 
                            alt={exchange.name} 
                            className="h-8 w-8 rounded-full" 
                          />
                          <span className="ml-3 block text-sm font-bold text-gray-900">{exchange.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                         <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-white text-xs font-bold ${getScoreColor(exchange.score)}`}>
                             {exchange.score}
                         </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(exchange.volume24h, 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right hidden md:table-cell">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">{exchange.avgLiquidity}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 hidden lg:table-cell">
                        {formatCompactNumber(exchange.weeklyVisits)}
                      </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 hidden lg:table-cell">
                        {exchange.markets}
                      </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 hidden lg:table-cell">
                        {exchange.coins}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                         <div className="truncate max-w-[150px]" title={exchange.fiatSupported.join(', ')}>
                             {exchange.fiatSupported.join(', ')}
                         </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right hidden xl:table-cell">
                         <Sparkline data={exchange.history} isPositive={true} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};