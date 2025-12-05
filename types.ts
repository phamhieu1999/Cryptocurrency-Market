
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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
