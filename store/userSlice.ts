
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PortfolioItem, UserSettings } from '../types';
import { userService } from '../services/userService';

interface UserState {
  watchlist: string[];
  portfolio: PortfolioItem[];
  settings: UserSettings;
}

const initialSettings: UserSettings = {
  displayName: 'Crypto Investor',
  email: 'user@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  currency: 'USD',
  theme: 'light',
  language: 'en',
  bio: '',
  website: '',
  birthdate: '',
  notifications: {
    marketingEmails: false,
    priceAlerts: true,
    securityAlerts: true,
    newsletter: true
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2023-01-01'
  }
};

const initialState: UserState = {
  watchlist: userService.getWatchlist(),
  portfolio: userService.getPortfolio(),
  settings: userService.getSettings() || initialSettings,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      if (state.watchlist.includes(coinId)) {
        state.watchlist = state.watchlist.filter(id => id !== coinId);
      } else {
        state.watchlist.push(coinId);
      }
      userService.updateWatchlist(state.watchlist);
    },
    addPortfolioItem: (state, action: PayloadAction<PortfolioItem>) => {
      state.portfolio.push(action.payload);
      userService.updatePortfolio(state.portfolio);
    },
    removePortfolioItem: (state, action: PayloadAction<string>) => {
      state.portfolio = state.portfolio.filter(item => item.id !== action.payload);
      userService.updatePortfolio(state.portfolio);
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      userService.saveSettings(state.settings);
    }
  },
});

export const { toggleWatchlist, addPortfolioItem, removePortfolioItem, updateSettings } = userSlice.actions;
export default userSlice.reducer;
