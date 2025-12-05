import { Coin, GlobalStats, HistoricalPoint } from '../types';

// Helper to generate random walk data for charts
const generateHistory = (startPrice: number, points: number = 20): HistoricalPoint[] => {
  let currentPrice = startPrice;
  const history: HistoricalPoint[] = [];
  const now = new Date();
  
  for (let i = points; i > 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // Daily points
    // Random volatility between -5% and +5%
    const change = (Math.random() - 0.5) * 0.10; 
    currentPrice = currentPrice * (1 + change);
    history.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice
    });
  }
  // Add current price as last point
  history.push({
    date: now.toISOString().split('T')[0],
    price: startPrice
  });
  
  return history;
};

const COINS_DB: Coin[] = [
  {
    id: 'bitcoin',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 64230.50,
    marketCap: 1200000000000,
    volume24h: 35000000000,
    circulatingSupply: 19650000,
    percentChange1h: 0.12,
    percentChange24h: 2.5,
    percentChange7d: 5.4,
    history: [],
    description: "Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto."
  },
  {
    id: 'ethereum',
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3450.20,
    marketCap: 400000000000,
    volume24h: 15000000000,
    circulatingSupply: 120000000,
    percentChange1h: -0.2,
    percentChange24h: 1.2,
    percentChange7d: 8.1,
    history: [],
    description: "Ethereum is a decentralized open-source blockchain system that features its own cryptocurrency, Ether. ETH works as a platform for numerous other cryptocurrencies, as well as for the execution of decentralized smart contracts."
  },
  {
    id: 'tether',
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    marketCap: 103000000000,
    volume24h: 45000000000,
    circulatingSupply: 103000000000,
    percentChange1h: 0.01,
    percentChange24h: 0.02,
    percentChange7d: -0.01,
    history: [],
    description: "Tether (USDT) is a stablecoin, a type of cryptocurrency which aims to keep cryptocurrency valuations stable."
  },
  {
    id: 'solana',
    rank: 4,
    name: 'Solana',
    symbol: 'SOL',
    price: 145.60,
    marketCap: 65000000000,
    volume24h: 4000000000,
    circulatingSupply: 443000000,
    percentChange1h: 0.5,
    percentChange24h: -1.5,
    percentChange7d: 12.4,
    history: [],
    description: "Solana is a highly functional open source project that banks on blockchain technology's permissionless nature to provide decentralized finance (DeFi) solutions."
  },
  {
    id: 'binance-coin',
    rank: 5,
    name: 'BNB',
    symbol: 'BNB',
    price: 590.10,
    marketCap: 87000000000,
    volume24h: 1200000000,
    circulatingSupply: 149000000,
    percentChange1h: 0.1,
    percentChange24h: 0.8,
    percentChange7d: 2.1,
    history: [],
    description: "BNB is the cryptocurrency coin that powers the Binance ecosystem. As one of the world's most popular utility tokens, not only can you buy or sell BNB like any other cryptocurrency, but BNB comes with a wide range of applications and benefits."
  },
  {
    id: 'xrp',
    rank: 6,
    name: 'XRP',
    symbol: 'XRP',
    price: 0.62,
    marketCap: 34000000000,
    volume24h: 1500000000,
    circulatingSupply: 54800000000,
    percentChange1h: -0.1,
    percentChange24h: -0.5,
    percentChange7d: -1.2,
    history: []
  },
  {
    id: 'usdc',
    rank: 7,
    name: 'USDC',
    symbol: 'USDC',
    price: 1.00,
    marketCap: 32000000000,
    volume24h: 3000000000,
    circulatingSupply: 32000000000,
    percentChange1h: 0.00,
    percentChange24h: 0.00,
    percentChange7d: 0.01,
    history: []
  },
  {
    id: 'cardano',
    rank: 8,
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    marketCap: 16000000000,
    volume24h: 400000000,
    circulatingSupply: 35500000000,
    percentChange1h: 0.2,
    percentChange24h: 1.8,
    percentChange7d: 3.5,
    history: []
  },
  {
    id: 'avalanche',
    rank: 9,
    name: 'Avalanche',
    symbol: 'AVAX',
    price: 35.40,
    marketCap: 13000000000,
    volume24h: 500000000,
    circulatingSupply: 377000000,
    percentChange1h: 0.4,
    percentChange24h: 5.2,
    percentChange7d: 15.6,
    history: []
  },
  {
    id: 'dogecoin',
    rank: 10,
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.16,
    marketCap: 23000000000,
    volume24h: 2000000000,
    circulatingSupply: 143000000000,
    percentChange1h: -0.3,
    percentChange24h: -2.1,
    percentChange7d: 0.5,
    history: []
  }
].map(coin => ({
  ...coin,
  history: generateHistory(coin.price)
}));

export const cryptoService = {
  getCoins: async (): Promise<Coin[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(COINS_DB), 500);
    });
  },

  getCoinById: async (id: string): Promise<Coin | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(COINS_DB.find(c => c.id === id)), 400);
    });
  },

  getGlobalStats: async (): Promise<GlobalStats> => {
    return {
      totalMarketCap: 2450000000000,
      totalVolume24h: 85000000000,
      btcDominance: 52.1,
      ethDominance: 17.4,
      activeCryptos: 9845
    };
  }
};