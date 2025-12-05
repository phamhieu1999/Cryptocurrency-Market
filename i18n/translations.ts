import { useAppSelector } from '../store/hooks';

type LanguageCode = 'en' | 'vi';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'cn', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'jp', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'kr', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

const dictionary: Translations = {
  en: {
    'nav.cryptos': 'Cryptocurrencies',
    'nav.exchanges': 'Exchanges',
    'nav.community': 'Community',
    'nav.watchlist': 'Watchlist',
    'nav.portfolio': 'Portfolio',
    'nav.settings': 'Settings',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Log Out',
    'nav.search': 'Search',
    
    'market.cryptos': 'Cryptos',
    'market.exchanges': 'Exchanges',
    'market.cap': 'Market Cap',
    'market.vol': '24h Vol',
    'market.dominance': 'Dominance',
    
    'home.title': "Today's Cryptocurrency Prices by Market Cap",
    'home.subtitle': 'The global crypto market cap is',
    'home.increase': 'increase over the last day',
    'home.decrease': 'decrease over the last day',
    'home.all': 'All',
    'home.customize': 'Customize',
    'home.showing': 'Showing',
    'home.of': 'of',
    'home.coins': 'coins',
    
    'table.name': 'Name',
    'table.price': 'Price',
    'table.1h': '1h %',
    'table.24h': '24h %',
    'table.7d': '7d %',
    'table.marketcap': 'Market Cap',
    'table.volume': 'Volume(24h)',
    'table.supply': 'Circulating Supply',
    'table.chart': 'Last 7 Days',

    'modal.language.title': 'Select Language',
    'modal.language.search': 'Search languages',
  },
  vi: {
    'nav.cryptos': 'Tiền điện tử',
    'nav.exchanges': 'Sàn giao dịch',
    'nav.community': 'Cộng đồng',
    'nav.watchlist': 'Danh sách theo dõi',
    'nav.portfolio': 'Danh mục',
    'nav.settings': 'Cài đặt',
    'nav.login': 'Đăng nhập',
    'nav.signup': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.search': 'Tìm kiếm',
    
    'market.cryptos': 'Tiền ảo',
    'market.exchanges': 'Trao đổi',
    'market.cap': 'Vốn hóa',
    'market.vol': 'KL 24h',
    'market.dominance': 'Thống trị',
    
    'home.title': 'Giá tiền điện tử hôm nay theo vốn hóa thị trường',
    'home.subtitle': 'Vốn hóa thị trường toàn cầu là',
    'home.increase': 'tăng trong ngày qua',
    'home.decrease': 'giảm trong ngày qua',
    'home.all': 'Tất cả',
    'home.customize': 'Tùy chỉnh',
    'home.showing': 'Hiển thị',
    'home.of': 'trên',
    'home.coins': 'đồng tiền',
    
    'table.name': 'Tên',
    'table.price': 'Giá',
    'table.1h': '1g %',
    'table.24h': '24g %',
    'table.7d': '7n %',
    'table.marketcap': 'Vốn hóa',
    'table.volume': 'Khối lượng(24g)',
    'table.supply': 'Lượng cung lưu hành',
    'table.chart': '7 ngày qua',

    'modal.language.title': 'Chọn ngôn ngữ',
    'modal.language.search': 'Tìm kiếm ngôn ngữ',
  }
};

export const useTranslation = () => {
  const settings = useAppSelector((state) => state.user.settings);
  // Default to 'en' if language not supported in dictionary
  const langCode = (dictionary[settings.language] ? settings.language : 'en') as LanguageCode;

  const t = (key: string): string => {
    return dictionary[langCode][key] || key;
  };

  return { t, language: settings.language };
};