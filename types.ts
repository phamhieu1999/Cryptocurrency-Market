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