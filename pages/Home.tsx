import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { formatCurrency, formatCompactNumber, PercentChange } from '../components/Formatters';
import { Sparkline } from '../components/Sparkline';

export const Home = () => {
  const { coins, status } = useAppSelector((state) => state.crypto);
  const loading = status === 'loading' || status === 'idle';

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination Logic
  const totalPages = Math.ceil(coins.length / itemsPerPage);
  const indexOfLastCoin = currentPage * itemsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - itemsPerPage;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  // Generate page numbers to display (CoinMarketCap style)
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="pb-12">
      {/* Top Highlights Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Today's Cryptocurrency Prices by Market Cap</h1>
          <p className="text-gray-500 mt-1">The global crypto market cap is <span className="text-blue-600 font-medium">$2.45T</span>, a <span className="text-green-600 font-medium">1.2%</span> increase over the last day.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold transition-colors">All</button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors">1h</button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors">24h</button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors">7d</button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold flex items-center gap-2">
            Customize <ChevronRight size={14} />
          </button>
        </div>

        {/* Coin Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Name</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">1h %</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">24h %</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">7d %</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Volume(24h)</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Circulating Supply</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={11} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  currentCoins.map((coin) => (
                    <tr key={coin.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                         <Star size={16} className="text-gray-300 cursor-pointer hover:text-yellow-400 hover:fill-yellow-400" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{coin.rank}</td>
                      <td className="px-4 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] md:shadow-none">
                        <Link to={`/coin/${coin.id}`} className="flex items-center">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="h-8 w-8 rounded-full" 
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-bold text-gray-900">{coin.name}</span>
                            <span className="block text-xs text-gray-500 md:hidden">{coin.symbol}</span>
                          </div>
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 hidden md:inline-block">
                             {coin.symbol}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(coin.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <PercentChange value={coin.percentChange1h} className="justify-end" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <PercentChange value={coin.percentChange24h} className="justify-end" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                         <PercentChange value={coin.percentChange7d} className="justify-end" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right hidden md:table-cell">
                        {formatCurrency(coin.marketCap, 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right hidden lg:table-cell">
                        <div className="text-gray-900">{formatCurrency(coin.volume24h, 0)}</div>
                        <div className="text-xs text-gray-500">{formatCompactNumber(coin.volume24h / coin.price)} {coin.symbol}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 hidden lg:table-cell">
                        <div className="flex flex-col items-end">
                            <span>{formatCompactNumber(coin.circulatingSupply)} {coin.symbol}</span>
                            {/* Simple Progress Bar for mock supply */}
                            <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                <div className="h-1 bg-gray-400 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right hidden xl:table-cell">
                         <Sparkline data={coin.history} isPositive={coin.percentChange7d >= 0} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Controls */}
        {!loading && coins.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
             <div>
                Showing {indexOfFirstCoin + 1} - {Math.min(indexOfLastCoin, coins.length)} of {coins.length} coins
             </div>
             <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button 
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                      disabled={typeof page !== 'number'}
                      className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage 
                          ? 'bg-blue-600 text-white border border-blue-600' 
                          : typeof page === 'number' 
                            ? 'border border-gray-200 hover:bg-gray-50 text-gray-700' 
                            : 'text-gray-400 cursor-default'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};