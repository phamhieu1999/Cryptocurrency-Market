import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, ChevronLeft, Check, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleWatchlist } from '../store/userSlice';
import { fetchMarketHighlights } from '../store/cryptoSlice';
import { formatCurrency, formatCompactNumber, PercentChange } from '../components/Formatters';
import { Sparkline } from '../components/Sparkline';
import { PriceCell } from '../components/PriceCell';
import { HighlightsSection } from '../components/HighlightsSection';
import { useTranslation } from '../i18n/translations';

export const Home = () => {
  const dispatch = useAppDispatch();
  const { coins, status, highlights, highlightsStatus } = useAppSelector((state) => state.crypto);
  const { watchlist } = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  const loading = status === 'loading' || status === 'idle';

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter & Column Visibility States
  const [activeTimeframe, setActiveTimeframe] = useState<'all' | '1h' | '24h' | '7d'>('all');
  const [activeTab, setActiveTab] = useState('Top');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const customizeRef = useRef<HTMLDivElement>(null);

  const [visibleColumns, setVisibleColumns] = useState({
    price: true,
    percent1h: true,
    percent24h: true,
    percent7d: true,
    marketCap: true,
    volume: true,
    circulatingSupply: true,
    chart: true
  });

  useEffect(() => {
    dispatch(fetchMarketHighlights());
  }, [dispatch]);

  // Handle Timeframe Presets
  useEffect(() => {
    if (activeTimeframe === 'all') {
      setVisibleColumns(prev => ({ ...prev, percent1h: true, percent24h: true, percent7d: true }));
    } else if (activeTimeframe === '1h') {
      setVisibleColumns(prev => ({ ...prev, percent1h: true, percent24h: false, percent7d: false }));
    } else if (activeTimeframe === '24h') {
      setVisibleColumns(prev => ({ ...prev, percent1h: false, percent24h: true, percent7d: false }));
    } else if (activeTimeframe === '7d') {
      setVisibleColumns(prev => ({ ...prev, percent1h: false, percent24h: false, percent7d: true }));
    }
  }, [activeTimeframe]);

  // Close customize dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customizeRef.current && !customizeRef.current.contains(event.target as Node)) {
        setIsCustomizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleColumn = (key: string) => {
    const k = key as keyof typeof visibleColumns;
    setVisibleColumns(prev => ({ ...prev, [k]: !prev[k] }));
    if (['percent1h', 'percent24h', 'percent7d'].includes(key)) {
        // logic for manual toggle
    }
  };

  // Sorting based on Tabs
  const getSortedCoins = () => {
    let sorted = [...coins];
    if (activeTab === 'Gainers') {
      sorted.sort((a, b) => b.percentChange24h - a.percentChange24h);
    } else if (activeTab === 'Trending') {
      // Mock trending by picking specific IDs or random shuffle seeded (using rank for demo)
      sorted.sort((a, b) => (a.rank % 7) - (b.rank % 7));
    } else if (activeTab === 'New') {
      sorted.sort((a, b) => b.rank - a.rank); // Mock new by showing lower rank
    }
    // Default 'Top' is already sorted by rank in initial state
    return sorted;
  };

  // Pagination Logic
  const displayCoins = getSortedCoins();
  const totalPages = Math.ceil(displayCoins.length / itemsPerPage);
  const indexOfLastCoin = currentPage * itemsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - itemsPerPage;
  const currentCoins = displayCoins.slice(indexOfFirstCoin, indexOfLastCoin);

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
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mb-6 overflow-x-auto scrollbar-hide border-b border-gray-100 pb-1">
          {['Top', 'Trending', 'Most Visited', 'New', 'Gainers', 'Real-World Assets'].map(tab => (
             <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`text-base font-bold whitespace-nowrap pb-2 border-b-2 transition-colors ${
                  activeTab === tab 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
             >
                {tab}
             </button>
          ))}
          <button className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 pb-2">
             More <ChevronDown size={14} />
          </button>
        </div>

        {/* Global Highlight Cards */}
        <HighlightsSection highlights={highlights} loading={highlightsStatus === 'loading'} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('home.title')}</h1>
          <p className="text-gray-500 mt-1">{t('home.subtitle')} <span className="text-blue-600 font-medium">$3.14T</span>, a <span className="text-red-600 font-medium">1.34%</span> {t('home.decrease')}.</p>
        </div>

        {/* Filters & Customize */}
        <div className="flex flex-wrap items-center gap-3 mb-6 relative z-20">
          <button 
            onClick={() => setActiveTimeframe('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTimeframe === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            {t('home.all')}
          </button>
          <button 
            onClick={() => setActiveTimeframe('1h')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTimeframe === '1h' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            1h
          </button>
          <button 
            onClick={() => setActiveTimeframe('24h')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTimeframe === '24h' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            24h
          </button>
          <button 
            onClick={() => setActiveTimeframe('7d')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTimeframe === '7d' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            7d
          </button>
          
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          
          <div className="relative" ref={customizeRef}>
            <button 
                onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isCustomizeOpen ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
                {t('home.customize')} <ChevronRight size={14} className={`transition-transform ${isCustomizeOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {/* Customize Dropdown */}
            {isCustomizeOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in duration-100">
                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Toggle Columns
                    </div>
                    <div className="space-y-1">
                        {[
                            { key: 'marketCap', label: t('table.marketcap') },
                            { key: 'volume', label: t('table.volume') },
                            { key: 'circulatingSupply', label: t('table.supply') },
                            { key: 'percent1h', label: t('table.1h') },
                            { key: 'percent24h', label: t('table.24h') },
                            { key: 'percent7d', label: t('table.7d') },
                            { key: 'chart', label: t('table.chart') },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => toggleColumn(item.key)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg group"
                            >
                                <span>{item.label}</span>
                                {visibleColumns[item.key as keyof typeof visibleColumns] && (
                                    <Check size={16} className="text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Coin Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">{t('table.name')}</th>
                  {visibleColumns.price && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table.price')}</th>}
                  {visibleColumns.percent1h && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table.1h')}</th>}
                  {visibleColumns.percent24h && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table.24h')}</th>}
                  {visibleColumns.percent7d && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table.7d')}</th>}
                  {visibleColumns.marketCap && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('table.marketcap')}</th>}
                  {visibleColumns.volume && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('table.volume')}</th>}
                  {visibleColumns.circulatingSupply && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('table.supply')}</th>}
                  {visibleColumns.chart && <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">{t('table.chart')}</th>}
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
                         <Star 
                           size={16} 
                           className={`cursor-pointer hover:scale-110 transition-transform ${watchlist.includes(coin.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} 
                           onClick={() => dispatch(toggleWatchlist(coin.id))}
                         />
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
                      {visibleColumns.price && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <div className="flex justify-end">
                                <PriceCell price={coin.price} />
                            </div>
                        </td>
                      )}
                      {visibleColumns.percent1h && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <PercentChange value={coin.percentChange1h} className="justify-end" />
                        </td>
                      )}
                      {visibleColumns.percent24h && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <PercentChange value={coin.percentChange24h} className="justify-end" />
                        </td>
                      )}
                      {visibleColumns.percent7d && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <PercentChange value={coin.percentChange7d} className="justify-end" />
                        </td>
                      )}
                      {visibleColumns.marketCap && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right hidden md:table-cell">
                            {formatCurrency(coin.marketCap, 0)}
                        </td>
                      )}
                      {visibleColumns.volume && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right hidden lg:table-cell">
                            <div className="text-gray-900">{formatCurrency(coin.volume24h, 0)}</div>
                            <div className="text-xs text-gray-500">{formatCompactNumber(coin.volume24h / coin.price)} {coin.symbol}</div>
                        </td>
                      )}
                      {visibleColumns.circulatingSupply && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 hidden lg:table-cell">
                            <div className="flex flex-col items-end">
                                <span>{formatCompactNumber(coin.circulatingSupply)} {coin.symbol}</span>
                                <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                    <div className="h-1 bg-gray-400 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </td>
                      )}
                      {visibleColumns.chart && (
                        <td className="px-4 py-4 whitespace-nowrap text-right hidden xl:table-cell">
                            <Sparkline data={coin.history} isPositive={coin.percentChange7d >= 0} />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Controls */}
        {!loading && displayCoins.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
             <div>
                {t('home.showing')} {indexOfFirstCoin + 1} - {Math.min(indexOfLastCoin, displayCoins.length)} {t('home.of')} {displayCoins.length} {t('home.coins')}
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