import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGlobalStats } from '../store/cryptoSlice';
import { formatCurrency } from './Formatters';
import { useTranslation } from '../i18n/translations';

export const MarketHeader = () => {
  const dispatch = useAppDispatch();
  const { globalStats: stats } = useAppSelector((state) => state.crypto);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchGlobalStats());
  }, [dispatch]);

  if (!stats) return null;

  return (
    <div className="bg-white border-b border-gray-200 hidden md:block">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <div className="flex gap-1">
            <span className="text-gray-400">{t('market.cryptos')}:</span>
            <span className="text-blue-600 font-medium">{stats.activeCryptos.toLocaleString()}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">{t('market.exchanges')}:</span>
            <span className="text-blue-600 font-medium">742</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">{t('market.cap')}:</span>
            <span className="text-blue-600 font-medium">{formatCurrency(stats.totalMarketCap, 0)}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">{t('market.vol')}:</span>
            <span className="text-blue-600 font-medium">{formatCurrency(stats.totalVolume24h, 0)}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">{t('market.dominance')}:</span>
            <span className="text-blue-600 font-medium">BTC: {stats.btcDominance}% ETH: {stats.ethDominance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};