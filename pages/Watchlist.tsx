import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleWatchlist } from '../store/userSlice';
import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { PriceCell } from '../components/PriceCell';
import { PercentChange, formatCurrency, formatCompactNumber } from '../components/Formatters';
import { Sparkline } from '../components/Sparkline';

export const Watchlist = () => {
  const dispatch = useAppDispatch();
  const { coins } = useAppSelector(state => state.crypto);
  const { watchlist, settings } = useAppSelector(state => state.user);
  
  // Filter coins that are in the watchlist
  const watchlistCoins = coins.filter(coin => watchlist.includes(coin.id));

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-2xl font-bold text-gray-900">Your Watchlist</h1>
             <p className="text-gray-500 mt-1">Track your favorite coins in one place.</p>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                {watchlistCoins.length} Coins
             </div>
          </div>
        </div>

        {watchlistCoins.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
             <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Star className="text-gray-400" size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Your watchlist is empty</h3>
             <p className="text-gray-500 mb-6">Start by clicking the star icon next to any coin to add it here.</p>
             <Link to="/" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                Explore Coins
             </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">24h %</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Volume(24h)</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last 7 Days</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {watchlistCoins.map((coin) => (
                    <tr key={coin.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                         <Star 
                            size={16} 
                            className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => dispatch(toggleWatchlist(coin.id))}
                         />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link to={`/coin/${coin.id}`} className="flex items-center">
                          <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                          <div className="ml-3">
                            <span className="block text-sm font-bold text-gray-900">{coin.name}</span>
                            <span className="block text-xs text-gray-500">{coin.symbol}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <PriceCell price={coin.price} className="font-medium" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <PercentChange value={coin.percentChange24h} className="justify-end" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right hidden md:table-cell">
                          {formatCurrency(coin.marketCap, 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right hidden lg:table-cell">
                          {formatCurrency(coin.volume24h, 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right hidden xl:table-cell">
                          <Sparkline data={coin.history} isPositive={coin.percentChange7d >= 0} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => dispatch(toggleWatchlist(coin.id))}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Remove from watchlist"
                          >
                             <Trash2 size={16} />
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};