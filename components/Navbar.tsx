import React from 'react';
import { Search, Menu, X, Bitcoin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Learn</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 outline-none border-transparent border"
              />
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
               <span className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900">USD</span>
               <button className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">Log In</button>
               <button className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Sign Up</button>
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
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50">Cryptocurrencies</Link>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Exchanges</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Community</a>
          </div>
        </div>
      )}
    </nav>
  );
};