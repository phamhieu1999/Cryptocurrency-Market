
import { Post, Topic } from '../types';

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: {
      id: 'a1',
      name: 'Bitcoin Archive',
      handle: '@BTC_Archive',
      avatar: 'https://ui-avatars.com/api/?name=Bitcoin+Archive&background=F7931A&color=fff',
      isVerified: true
    },
    content: 'Bitcoin has officially broken the $64k resistance level! 🚀 Next stop $70k? What are your thoughts on this sudden pump? #Bitcoin #Crypto',
    timestamp: '2h ago',
    likes: 12500,
    comments: 450,
    reposts: 1200,
    coins: ['BTC'],
    isLiked: false
  },
  {
    id: 'p2',
    author: {
      id: 'a2',
      name: 'Vitalik Buterin',
      handle: '@VitalikButerin',
      avatar: 'https://ui-avatars.com/api/?name=Vitalik+Buterin&background=627EEA&color=fff',
      isVerified: true
    },
    content: 'Just published a new roadmap for Ethereum scaling. Layer 2 solutions are looking more promising than ever. We are focusing on reducing gas fees for everyone.',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696fa4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    timestamp: '5h ago',
    likes: 28000,
    comments: 1200,
    reposts: 5600,
    coins: ['ETH'],
    isLiked: true
  },
  {
    id: 'p3',
    author: {
      id: 'a3',
      name: 'Solana Legend',
      handle: '@SolanaLegend',
      avatar: 'https://ui-avatars.com/api/?name=Solana+Legend&background=14F195&color=fff',
      isVerified: false
    },
    content: '$SOL volume is flipping ETH on decentralized exchanges today. The meme coin season on Solana is bringing massive liquidity.',
    timestamp: '15m ago',
    likes: 850,
    comments: 120,
    reposts: 200,
    coins: ['SOL'],
    isLiked: false
  },
  {
    id: 'p4',
    author: {
      id: 'a4',
      name: 'Crypto Whale',
      handle: '@CryptoWhale',
      avatar: 'https://ui-avatars.com/api/?name=Crypto+Whale&background=000&color=fff',
      isVerified: true
    },
    content: 'Just bought the dip. 🐳 Accumulating more Altcoins before the major altseason begins. My top picks are $DOT, $ADA and $AVAX.',
    timestamp: '1d ago',
    likes: 5400,
    comments: 890,
    reposts: 450,
    coins: ['DOT', 'ADA', 'AVAX'],
    isLiked: false
  },
  {
      id: 'p5',
      author: {
        id: 'a5',
        name: 'CZ Binance',
        handle: '@cz_binance',
        avatar: 'https://ui-avatars.com/api/?name=CZ&background=F3BA2F&color=fff',
        isVerified: true
      },
      content: 'Funds are SAFU.',
      timestamp: '2d ago',
      likes: 45000,
      comments: 2300,
      reposts: 8900,
      coins: ['BNB'],
      isLiked: true
    }
];

const MOCK_TOPICS: Topic[] = [
  { id: 't1', name: 'Bitcoin', postsCount: 125000, isTrending: true },
  { id: 't2', name: 'SolanaSummer', postsCount: 45000, isTrending: true },
  { id: 't3', name: 'Airdrop', postsCount: 32000, isTrending: true },
  { id: 't4', name: 'Memecoins', postsCount: 28000, isTrending: false },
  { id: 't5', name: 'Regulation', postsCount: 15000, isTrending: false },
  { id: 't6', name: 'ETF', postsCount: 56000, isTrending: true },
];

export const communityService = {
  getPosts: async (): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_POSTS), 600);
    });
  },

  getTrendingTopics: async (): Promise<Topic[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TOPICS), 400);
    });
  }
};
