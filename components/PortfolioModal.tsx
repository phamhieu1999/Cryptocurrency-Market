import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addPortfolioItem } from '../store/userSlice';
import { Coin } from '../types';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { coins } = useAppSelector(state => state.crypto);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState('');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin);
    setPricePerCoin(coin.price.toString());
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    dispatch(addPortfolioItem({
      id: Date.now().toString(),
      coinId: selectedCoin.id,
      amount: parseFloat(amount),
      avgBuyPrice: parseFloat(pricePerCoin)
    }));

    // Reset and close
    setStep(1);
    setAmount('');
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 1 ? 'Select Coin' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search coin name or symbol"
                  className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredCoins.map(coin => (
                  <button 
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-bold text-gray-900">{coin.name}</div>
                      <div className="text-xs text-gray-500">{coin.symbol}</div>
                    </div>
                    <div className="ml-auto text-sm font-medium text-gray-900">
                      ${coin.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                 <img src={selectedCoin?.image} className="w-8 h-8 rounded-full" />
                 <span className="font-bold text-lg">{selectedCoin?.name}</span>
                 <span className="text-gray-500">{selectedCoin?.symbol}</span>
                 <button type="button" onClick={() => setStep(1)} className="ml-auto text-sm text-blue-600 font-medium hover:underline">Change</button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  required
                  step="any"
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price Per Coin</label>
                <input 
                  type="number" 
                  required
                  step="any"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={pricePerCoin}
                  onChange={(e) => setPricePerCoin(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                 <span className="text-gray-500 text-sm">Total Spent</span>
                 <span className="font-bold text-gray-900">
                   ${((parseFloat(amount) || 0) * (parseFloat(pricePerCoin) || 0)).toLocaleString()}
                 </span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add Transaction
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};