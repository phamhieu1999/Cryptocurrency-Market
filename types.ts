
export interface HistoricalPoint {
  date: string;
  price: number;
}

export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  history: HistoricalPoint[]; // 7 days of hourly data or daily data
  image: string;
  description?: string;
  tags: string[]; // New: Categories like DeFi, Meme, AI, etc.
}

export interface Exchange {
  id: string;
  rank: number;
  name: string;
  score: number;
  volume24h: number;
  avgLiquidity: number;
  weeklyVisits: number;
  markets: number;
  coins: number;
  fiatSupported: string[];
  image: string;
  history: HistoricalPoint[];
}

export interface GlobalStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptos: number;
}

export interface MarketHighlights {
  marketCap: {
    value: number;
    change: number;
    history: HistoricalPoint[];
  };
  topIndex: { 
    value: number;
    change: number;
    history: HistoricalPoint[];
  };
  fearAndGreed: {
    value: number; // 0-100
    sentiment: string;
    history: number[]; // Last few days
  };
  altcoinSeason: {
    value: number; // 0-100
    status: string;
  };
  cryptoRsi: {
    value: number; // 0-100
    status: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface PortfolioItem {
  id: string;
  coinId: string;
  amount: number;
  avgBuyPrice: number;
}

export interface NotificationPreferences {
  marketingEmails: boolean;
  priceAlerts: boolean;
  securityAlerts: boolean;
  newsletter: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
}

export interface UserSettings {
  displayName: string;
  email: string;
  avatarUrl: string;
  currency: string;
  theme: 'light' | 'dark';
  language: string;
  bio?: string;
  website?: string;
  birthdate?: string;
  notifications: NotificationPreferences;
  security: SecuritySettings;
}

// Community Types
export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  coins: string[]; // Symbols like BTC, ETH
  isLiked?: boolean;
}

export interface Topic {
  id: string;
  name: string;
  postsCount: number;
  isTrending: boolean;
}
