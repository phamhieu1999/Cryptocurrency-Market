import { PortfolioItem, UserSettings } from '../types';

// Keys for localStorage
const WATCHLIST_KEY = 'user_watchlist';
const PORTFOLIO_KEY = 'user_portfolio';
const SETTINGS_KEY = 'user_settings';

export const userService = {
  getWatchlist: (): string[] => {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : ['bitcoin', 'ethereum', 'solana']; // Default mocks
  },

  updateWatchlist: (watchlist: string[]) => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  },

  getPortfolio: (): PortfolioItem[] => {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (data) return JSON.parse(data);
    
    // Default mock portfolio
    return [
      { id: '1', coinId: 'bitcoin', amount: 0.5, avgBuyPrice: 55000 },
      { id: '2', coinId: 'ethereum', amount: 5, avgBuyPrice: 2800 },
    ];
  },

  updatePortfolio: (portfolio: PortfolioItem[]) => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  },

  getSettings: (): UserSettings | null => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};