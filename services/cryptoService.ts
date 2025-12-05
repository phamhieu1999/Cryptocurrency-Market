import { Coin, Exchange, GlobalStats, HistoricalPoint, MarketHighlights } from '../types';

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

// Define raw data for top 100 coins to keep file size manageable
// Format: [id, name, symbol, price, marketCap(B), cmcId, description]
const RAW_DATA: [string, string, string, number, number, number, string?][] = [
  ['bitcoin', 'Bitcoin', 'BTC', 64230.50, 1264, 1, "Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto."],
  ['ethereum', 'Ethereum', 'ETH', 3450.20, 415, 1027, "Ethereum is a decentralized open-source blockchain system that features its own cryptocurrency, Ether. ETH works as a platform for numerous other cryptocurrencies, as well as for the execution of decentralized smart contracts."],
  ['tether', 'Tether', 'USDT', 1.00, 103, 825, "Tether (USDT) is a stablecoin, a type of cryptocurrency which aims to keep cryptocurrency valuations stable."],
  ['binance-coin', 'BNB', 'BNB', 590.10, 87, 1839, "BNB is the cryptocurrency coin that powers the Binance ecosystem."],
  ['solana', 'Solana', 'SOL', 145.60, 65, 5426, "Solana is a highly functional open source project that banks on blockchain technology's permissionless nature to provide decentralized finance (DeFi) solutions."],
  ['usdc', 'USDC', 'USDC', 1.00, 32, 3408],
  ['xrp', 'XRP', 'XRP', 0.62, 34, 52],
  ['dogecoin', 'Dogecoin', 'DOGE', 0.16, 23, 74],
  ['toncoin', 'Toncoin', 'TON', 6.50, 22, 11419],
  ['cardano', 'Cardano', 'ADA', 0.45, 16, 2010],
  ['shiba-inu', 'Shiba Inu', 'SHIB', 0.000025, 14.7, 5994],
  ['avalanche', 'Avalanche', 'AVAX', 47.50, 17.8, 5805],
  ['tron', 'TRON', 'TRX', 0.12, 10.5, 1958],
  ['polkadot', 'Polkadot', 'DOT', 8.50, 12.1, 6636],
  ['bitcoin-cash', 'Bitcoin Cash', 'BCH', 480.20, 9.4, 1831],
  ['chainlink', 'Chainlink', 'LINK', 18.20, 10.7, 1975],
  ['near-protocol', 'NEAR Protocol', 'NEAR', 6.80, 7.1, 6535],
  ['polygon', 'Polygon', 'MATIC', 0.95, 9.3, 3890],
  ['litecoin', 'Litecoin', 'LTC', 85.40, 6.3, 2],
  ['dai', 'Dai', 'DAI', 1.00, 5.3, 4943],
  ['leo-token', 'LEO Token', 'LEO', 5.80, 5.4, 3957],
  ['uniswap', 'Uniswap', 'UNI', 11.50, 6.9, 7083],
  ['internet-computer', 'Internet Computer', 'ICP', 16.50, 7.6, 8916],
  ['ethereum-classic', 'Ethereum Classic', 'ETC', 30.50, 4.4, 1321],
  ['aptos', 'Aptos', 'APT', 14.20, 5.6, 21794],
  ['stacks', 'Stacks', 'STX', 2.80, 4.1, 4847],
  ['mantle', 'Mantle', 'MNT', 1.15, 3.7, 27075],
  ['filecoin', 'Filecoin', 'FIL', 8.50, 4.5, 2280],
  ['render', 'Render', 'RNDR', 10.20, 3.9, 5690],
  ['hedera', 'Hedera', 'HBAR', 0.11, 3.6, 4642],
  ['arbitrum', 'Arbitrum', 'ARB', 1.45, 3.8, 11841],
  ['cosmos', 'Cosmos', 'ATOM', 11.20, 4.3, 3794],
  ['stellar', 'Stellar', 'XLM', 0.13, 3.8, 512],
  ['vechain', 'VeChain', 'VET', 0.04, 3.1, 3077],
  ['maker', 'Maker', 'MKR', 3200.00, 2.9, 1518],
  ['optimism', 'Optimism', 'OP', 3.50, 3.5, 11840],
  ['injective', 'Injective', 'INJ', 35.40, 3.3, 4846],
  ['the-graph', 'The Graph', 'GRT', 0.32, 3.0, 6719],
  ['pepe', 'Pepe', 'PEPE', 0.000007, 2.9, 24478],
  ['first-digital-usd', 'First Digital USD', 'FDUSD', 1.00, 2.8, 26081],
  ['theta-network', 'Theta Network', 'THETA', 2.50, 2.5, 2416],
  ['fantom', 'Fantom', 'FTM', 0.85, 2.4, 3513],
  ['thorchain', 'THORChain', 'RUNE', 7.50, 2.5, 4157],
  ['fetch-ai', 'Fetch.ai', 'FET', 2.80, 2.3, 3773],
  ['arweave', 'Arweave', 'AR', 35.00, 2.3, 5632],
  ['pyth-network', 'Pyth Network', 'PYTH', 0.88, 1.3, 28177],
  ['celestia', 'Celestia', 'TIA', 12.50, 2.1, 22861],
  ['lido-dao', 'Lido DAO', 'LDO', 2.60, 2.3, 8000],
  ['algorand', 'Algorand', 'ALGO', 0.25, 2.0, 4030],
  ['sei', 'Sei', 'SEI', 0.75, 2.0, 23149],
  ['flow', 'Flow', 'FLOW', 1.20, 1.8, 4558],
  ['quant', 'Quant', 'QNT', 115.00, 1.7, 3155],
  ['bitcoin-sv', 'Bitcoin SV', 'BSV', 85.00, 1.6, 3602],
  ['multiversx', 'MultiversX', 'EGLD', 55.00, 1.5, 6892],
  ['axa', 'Axie Infinity', 'AXS', 9.50, 1.3, 6783],
  ['sandbox', 'The Sandbox', 'SAND', 0.60, 1.3, 6210],
  ['aave', 'Aave', 'AAVE', 110.00, 1.6, 7278],
  ['mina', 'Mina', 'MINA', 1.10, 1.2, 8646],
  ['tezos', 'Tezos', 'XTZ', 1.15, 1.1, 2011],
  ['eos', 'EOS', 'EOS', 1.05, 1.1, 1765],
  ['decentraland', 'Decentraland', 'MANA', 0.55, 1.0, 1966],
  ['neo', 'NEO', 'NEO', 18.00, 1.2, 1376],
  ['kava', 'Kava', 'KAVA', 0.85, 0.9, 4846],
  ['conflux', 'Conflux', 'CFX', 0.35, 1.3, 7334],
  ['chiliz', 'Chiliz', 'CHZ', 0.14, 1.2, 4066],
  ['iota', 'IOTA', 'IOTA', 0.30, 0.9, 1720],
  ['gala', 'Gala', 'GALA', 0.05, 1.4, 7080],
  ['blur', 'Blur', 'BLUR', 0.55, 0.8, 23121],
  ['sui', 'Sui', 'SUI', 1.65, 1.9, 20947],
  ['kucoin-token', 'KuCoin Token', 'KCS', 12.00, 1.1, 2087],
  ['trueusd', 'TrueUSD', 'TUSD', 1.00, 1.2, 2563],
  ['bittorrent', 'BitTorrent', 'BTT', 0.0000015, 1.4, 16086],
  ['terra-classic', 'Terra Classic', 'LUNC', 0.00015, 0.8, 4172],
  ['klaytn', 'Klaytn', 'KLAY', 0.25, 0.9, 4256],
  ['pancakeswap', 'PancakeSwap', 'CAKE', 3.50, 0.9, 7186],
  ['curve-dao', 'Curve DAO', 'CRV', 0.65, 0.7, 6538],
  ['zcash', 'Zcash', 'ZEC', 28.00, 0.4, 1437],
  ['maker', 'Maker', 'MKR', 2800, 2.6, 1518],
  ['dash', 'Dash', 'DASH', 35.00, 0.4, 131],
  ['synthetix', 'Synthetix', 'SNX', 3.80, 1.2, 2586],
  ['oasis', 'Oasis Network', 'ROSE', 0.12, 0.8, 7653],
  ['apecoin', 'ApeCoin', 'APE', 1.80, 1.1, 18876],
  ['ecash', 'eCash', 'XEC', 0.00005, 1.0, 10791],
  ['thorchain', 'THORChain', 'RUNE', 7.20, 2.4, 4157],
  ['fantom', 'Fantom', 'FTM', 0.82, 2.3, 3513],
  ['loopring', 'Loopring', 'LRC', 0.35, 0.5, 1934],
  ['enjin', 'Enjin Coin', 'ENJ', 0.45, 0.6, 2130],
  ['compound', 'Compound', 'COMP', 65.00, 0.5, 5692],
  ['gatetoken', 'GateToken', 'GT', 8.50, 0.8, 4269],
  ['trust-wallet', 'Trust Wallet', 'TWT', 1.20, 0.5, 5964],
  ['1inch', '1inch Network', '1INCH', 0.45, 0.5, 8104],
  ['zilliqa', 'Zilliqa', 'ZIL', 0.03, 0.5, 2469],
  ['ravencoin', 'Ravencoin', 'RVN', 0.03, 0.4, 2577],
  ['qtum', 'Qtum', 'QTUM', 3.50, 0.4, 1684],
  ['celo', 'Celo', 'CELO', 0.90, 0.4, 5567],
  ['nem', 'NEM', 'XEM', 0.04, 0.4, 873],
  ['waves', 'Waves', 'WAVES', 2.50, 0.3, 1274],
  ['skale', 'SKALE', 'SKL', 0.08, 0.4, 5691],
  ['harmony', 'Harmony', 'ONE', 0.02, 0.3, 3945],
  ['holotoken', 'Holo', 'HOT', 0.002, 0.4, 2682]
];

const getTags = (symbol: string, name: string): string[] => {
  const tags: string[] = [];
  
  // Categorization Logic
  const s = symbol.toUpperCase();
  const n = name.toLowerCase();

  if (['BTC', 'LTC', 'BCH', 'DOGE', 'BSV', 'ZEC', 'DASH', 'ETC', 'RVN'].includes(s)) {
    tags.push('Mineable', 'PoW');
  } else {
    tags.push('PoS'); // Simplify assumption for demo
  }

  if (['ETH', 'SOL', 'ADA', 'AVAX', 'DOT', 'NEAR', 'MATIC', 'TRX', 'BNB', 'ATOM', 'FTM', 'ALGO', 'SUI', 'APT', 'SEI'].includes(s)) {
    tags.push('Smart Contracts', 'Layer 1');
  }

  if (['UNI', 'AAVE', 'MKR', 'CAKE', 'CRV', 'COMP', '1INCH', 'SNX', 'RUNE', 'LDO', 'INJ'].includes(s)) {
    tags.push('DeFi', 'DEX', 'DAO');
  }

  if (['DOGE', 'SHIB', 'PEPE', 'BONK', 'FLOKI', 'WIF'].includes(s)) {
    tags.push('Meme');
  }

  if (['USDT', 'USDC', 'DAI', 'FDUSD', 'TUSD'].includes(s)) {
    tags.push('Stablecoin');
  }

  if (['AXS', 'SAND', 'MANA', 'GALA', 'ENJ', 'IMX', 'BEAM'].includes(s) || n.includes('game')) {
    tags.push('Gaming', 'Metaverse', 'NFT');
  }

  if (['FET', 'RNDR', 'AGIX', 'OCEAN', 'NEAR', 'TAO'].includes(s)) {
    tags.push('AI');
  }

  if (['ARB', 'OP', 'MATIC', 'MNT', 'IMX', 'STX'].includes(s)) {
    tags.push('Layer 2');
  }
  
  if (tags.length === 1 && tags[0] === 'PoS') {
      // Add generic tags if none specific matched
      tags.push('Utility Token');
  }

  return tags;
};

// Hydrate raw data into full objects
const COINS_DB: Coin[] = RAW_DATA.map((item, index) => {
  const [id, name, symbol, price, marketCapB, cmcId, description] = item;
  
  // Create randomized realistic variations based on the base price
  const percentChange1h = (Math.random() - 0.5) * 2; // -1% to 1%
  const percentChange24h = (Math.random() - 0.5) * 10; // -5% to 5%
  const percentChange7d = (Math.random() - 0.5) * 20; // -10% to 10%
  
  // Calculate mock volume based on market cap (approx 3-10% of mcap)
  const marketCap = marketCapB * 1000000000;
  const volume24h = marketCap * (0.03 + Math.random() * 0.07);
  
  // Calculate circulating supply
  const circulatingSupply = marketCap / price;

  return {
    id,
    rank: index + 1,
    name,
    symbol,
    price,
    marketCap,
    volume24h,
    circulatingSupply,
    percentChange1h,
    percentChange24h,
    percentChange7d,
    history: generateHistory(price),
    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcId}.png`,
    description: description || `${name} (${symbol}) is a popular cryptocurrency asset.`,
    tags: getTags(symbol, name)
  };
});

const EXCHANGES_DB: Exchange[] = [
  { id: 'binance', rank: 1, name: 'Binance', score: 9.9, volume24h: 15400000000, avgLiquidity: 850, weeklyVisits: 14500000, markets: 1650, coins: 450, fiatSupported: ['USD', 'EUR', 'GBP', 'AUD', 'BRL'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png' },
  { id: 'coinbase', rank: 2, name: 'Coinbase Exchange', score: 8.5, volume24h: 2100000000, avgLiquidity: 780, weeklyVisits: 350000, markets: 550, coins: 245, fiatSupported: ['USD', 'EUR', 'GBP'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png' },
  { id: 'bybit', rank: 3, name: 'Bybit', score: 8.1, volume24h: 4500000000, avgLiquidity: 650, weeklyVisits: 4100000, markets: 850, coins: 550, fiatSupported: ['USD', 'EUR', 'TRY', 'RUB'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png' },
  { id: 'okx', rank: 4, name: 'OKX', score: 7.9, volume24h: 3200000000, avgLiquidity: 620, weeklyVisits: 2800000, markets: 720, coins: 340, fiatSupported: ['USD', 'CNY', 'EUR'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png' },
  { id: 'kraken', rank: 5, name: 'Kraken', score: 7.8, volume24h: 850000000, avgLiquidity: 710, weeklyVisits: 1200000, markets: 680, coins: 230, fiatSupported: ['USD', 'EUR', 'CAD', 'GBP', 'JPY'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png' },
  { id: 'kucoin', rank: 6, name: 'KuCoin', score: 7.2, volume24h: 1100000000, avgLiquidity: 580, weeklyVisits: 1900000, markets: 1400, coins: 850, fiatSupported: ['USD', 'EUR', 'GBP'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/311.png' },
  { id: 'gate-io', rank: 7, name: 'Gate.io', score: 6.9, volume24h: 950000000, avgLiquidity: 520, weeklyVisits: 1500000, markets: 1800, coins: 1700, fiatSupported: ['USD', 'CNY', 'KRW'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/302.png' },
  { id: 'htx', rank: 8, name: 'HTX', score: 6.7, volume24h: 1800000000, avgLiquidity: 540, weeklyVisits: 2100000, markets: 950, coins: 650, fiatSupported: ['USD', 'EUR', 'VND'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/102.png' },
  { id: 'bitfinex', rank: 9, name: 'Bitfinex', score: 6.5, volume24h: 220000000, avgLiquidity: 690, weeklyVisits: 650000, markets: 450, coins: 180, fiatSupported: ['USD', 'EUR', 'GBP', 'JPY'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/79.png' },
  { id: 'mxc', rank: 10, name: 'MEXC', score: 6.4, volume24h: 1300000000, avgLiquidity: 480, weeklyVisits: 1100000, markets: 2100, coins: 1850, fiatSupported: ['USD', 'KRW', 'VND'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/544.png' },
  { id: 'crypto-com', rank: 11, name: 'Crypto.com Exchange', score: 6.3, volume24h: 450000000, avgLiquidity: 610, weeklyVisits: 850000, markets: 350, coins: 250, fiatSupported: ['USD', 'EUR'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1149.png' },
  { id: 'binance-us', rank: 12, name: 'Binance.US', score: 6.1, volume24h: 35000000, avgLiquidity: 520, weeklyVisits: 150000, markets: 120, coins: 150, fiatSupported: ['USD'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/630.png' },
  { id: 'gemini', rank: 13, name: 'Gemini', score: 6.0, volume24h: 85000000, avgLiquidity: 590, weeklyVisits: 250000, markets: 110, coins: 95, fiatSupported: ['USD', 'SGD', 'HKD'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/151.png' },
  { id: 'bitstamp', rank: 14, name: 'Bitstamp', score: 5.9, volume24h: 180000000, avgLiquidity: 650, weeklyVisits: 310000, markets: 160, coins: 85, fiatSupported: ['USD', 'EUR', 'GBP'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/70.png' },
  { id: 'bitget', rank: 15, name: 'Bitget', score: 5.8, volume24h: 1200000000, avgLiquidity: 500, weeklyVisits: 1800000, markets: 600, coins: 550, fiatSupported: ['USD', 'EUR', 'TRY'], image: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/513.png' },
].map(exchange => ({
    ...exchange,
    // Generate mock history for the graph
    history: generateHistory(exchange.volume24h, 7)
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

  getExchanges: async (): Promise<Exchange[]> => {
     return new Promise((resolve) => {
         setTimeout(() => resolve(EXCHANGES_DB), 500);
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
  },

  getMarketHighlights: async (): Promise<MarketHighlights> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          marketCap: {
            value: 3140000000000,
            change: -1.34,
            history: generateHistory(3100000000000, 20)
          },
          topIndex: {
            value: 196.22,
            change: -1.42,
            history: generateHistory(200, 20)
          },
          fearAndGreed: {
            value: 25,
            sentiment: 'Fear',
            history: [30, 28, 25, 26, 25]
          },
          altcoinSeason: {
            value: 23,
            status: 'Bitcoin Season'
          },
          cryptoRsi: {
            value: 48.97,
            status: 'Neutral'
          }
        });
      }, 500);
    });
  }
};