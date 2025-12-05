import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Bitcoin, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { LoginModal } from './LoginModal';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { coins, status } = useAppSelector((state) => state.crypto);

  // Filter coins for search
  const searchResults = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6); // Limit to top 6 results

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsLoginModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsLoginModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleSearchSelect = (coinId: string) => {
      navigate(`/coin/${coinId}`);
      setSearchQuery('');
      setIsSearchFocused(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-full text-white">
                  <Bitcoin size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">CryptoMarketCap</span>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <Link to="/" className="text-gray-900 font-semibold px-3 py-2 text-sm">Cryptocurrencies</Link>
                <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Exchanges</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Community</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden lg:block relative w-64 xl:w-80" ref={searchRef}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search"
                    className="bg-gray-100 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 outline-none border-transparent border"
                  />
                  {/* Search Dropdown */}
                  {isSearchFocused && searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Cryptocurrencies
                        </div>
                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((coin) => (
                                    <li key={coin.id}>
                                        <button 
                                            onClick={() => handleSearchSelect(coin.id)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                        >
                                            <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{coin.name}</span>
                                                <span className="text-xs text-gray-500">{coin.symbol}</span>
                                            </div>
                                            <div className="ml-auto text-xs text-gray-400">
                                                #{coin.rank}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-3">
                 <span className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900">USD</span>
                 
                 {isAuthenticated && user ? (
                   <div className="relative">
                     <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full pr-3 border border-transparent hover:border-gray-200 transition-all"
                     >
                       <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                       <span className="text-sm font-medium text-gray-700">{user.name}</span>
                     </button>

                     {isUserMenuOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                         <div className="px-4 py-2 border-b border-gray-100">
                           <p className="text-xs text-gray-500">Signed in as</p>
                           <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                         </div>
                         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Watchlist</a>
                         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Portfolio</a>
                         <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                         <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                         >
                           <LogOut size={14} /> Log out
                         </button>
                       </div>
                     )}
                     
                     {/* Overlay to close menu when clicking outside */}
                     {isUserMenuOpen && (
                       <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                     )}
                   </div>
                 ) : (
                   <>
                     <button 
                        onClick={openLogin}
                        className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                     >
                       Log In
                     </button>
                     <button 
                        onClick={openSignup}
                        className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                     >
                        Sign Up
                     </button>
                   </>
                 )}
              </div>

              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="px-3 py-2">
                 <input
                    type="text"
                    placeholder="Search coins..."
                    className="w-full bg-gray-100 text-gray-900 rounded-lg p-2 text-sm outline-none border border-transparent focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <div className="mt-2 bg-white rounded-lg shadow-sm border border-gray-200">
                       {searchResults.slice(0, 3).map(coin => (
                         <button 
                            key={coin.id}
                            onClick={() => {
                                handleSearchSelect(coin.id);
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                         >
                             <img src={coin.image} className="w-4 h-4 rounded-full" />
                             <span>{coin.name}</span>
                         </button>
                       ))}
                    </div>
                  )}
              </div>
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50">Cryptocurrencies</Link>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Exchanges</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Community</a>
              
              {!isAuthenticated && (
                <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-2">
                  <button onClick={openLogin} className="w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50">Log In</button>
                  <button onClick={openSignup} className="w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600">Sign Up</button>
                </div>
              )}
              {isAuthenticated && (
                 <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 font-medium">Log Out</button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        initialMode={authMode}
      />
    </>
  );
};