import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Products</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blockchain Explorer</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Crypto API</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Crypto Indices</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About us</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms of use</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Request Form</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact Support</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Socials</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Telegram</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; 2024 CryptoMarketCap Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};