import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removePortfolioItem } from '../store/userSlice';
import { formatCurrency, PercentChange } from '../components/Formatters';
import { Plus, PieChart, Trash2, TrendingUp, Wallet } from 'lucide-react';
import { PortfolioModal } from '../components/PortfolioModal';
import { Link } from 'react-router-dom';

export const Portfolio = () => {
  const dispatch = useAppDispatch();
  const { portfolio, settings } = useAppSelector(state => state.user);
  const { coins } = useAppSelector(state => state.crypto);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate Portfolio Stats
  let totalBalance = 0;
  let totalCost = 0;
  
  const portfolioData = portfolio.map(item => {
    const coin = coins.find(c => c.id === item.coinId);
    const currentPrice = coin ? coin.price : 0;
    const currentValue = currentPrice * item.amount;
    const costBasis = item.avgBuyPrice * item.amount;
    
    totalBalance += currentValue;
    totalCost += costBasis;

    return {
      ...item,
      coin,
      currentPrice,
      currentValue,
      profit: currentValue - costBasis,
      profitPercent: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0
    };
  });

  const totalProfit = totalBalance - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
       {/* Header Stats */}
       <div className="bg-white border-b border-gray-200 pt-8 pb-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <div className="text-sm text-gray-500 font-medium mb-1">Current Balance</div>
                   <div className="text-4xl font-bold text-gray-900">{formatCurrency(totalBalance)}</div>
                   <div className={`flex items-center gap-2 mt-2 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="font-bold">{totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                         {totalProfitPercent.toFixed(2)}%
                      </span>
                      <span className="text-gray-400 text-sm ml-1">All time</span>
                   </div>
                </div>
                
                <div className="flex gap-3">
                   <button 
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                   >
                      <Plus size={20} /> Add New Asset
                   </button>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {portfolio.length === 0 ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                   <PieChart className="text-blue-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get started with your portfolio!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Track your crypto profits and losses. Add the coins you hold to get started.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                   Add Transaction
                </button>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg">Your Assets</h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Asset</th>
                                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Balance</th>
                                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Value</th>
                                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {portfolioData.map((item) => (
                                 <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <Link to={`/coin/${item.coinId}`} className="flex items-center gap-3">
                                          {item.coin ? (
                                             <img src={item.coin.image} className="w-8 h-8 rounded-full" />
                                          ) : (
                                             <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                          )}
                                          <div>
                                             <div className="font-bold text-gray-900">{item.coin?.name || item.coinId}</div>
                                             <div className="text-xs text-gray-500">{item.coin?.symbol}</div>
                                          </div>
                                       </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                       <div className="text-sm font-medium text-gray-900">{formatCurrency(item.currentPrice)}</div>
                                       <div className={`text-xs ${item.coin && item.coin.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {item.coin?.percentChange24h.toFixed(2)}%
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                       <div className="text-sm font-bold text-gray-900">{item.amount}</div>
                                       <div className="text-xs text-gray-500">{item.coin?.symbol}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                       <div className="text-sm font-bold text-gray-900">{formatCurrency(item.currentValue)}</div>
                                       <div className={`text-xs ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {item.profit >= 0 ? '+' : ''}{formatCurrency(item.profit)} ({item.profitPercent.toFixed(2)}%)
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                       <button 
                                          onClick={() => dispatch(removePortfolioItem(item.id))}
                                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                     <h3 className="font-bold text-gray-900 mb-4">Allocation</h3>
                     {portfolioData.map(item => (
                        <div key={item.id} className="mb-4 last:mb-0">
                           <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">{item.coin?.symbol}</span>
                              <span className="text-gray-500">{((item.currentValue / totalBalance) * 100).toFixed(1)}%</span>
                           </div>
                           <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                 className="bg-blue-500 h-2 rounded-full" 
                                 style={{ width: `${(item.currentValue / totalBalance) * 100}%` }}
                              ></div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-white/20 rounded-lg"><Wallet size={24} /></div>
                         <h3 className="font-bold text-lg">Pro Tip</h3>
                      </div>
                      <p className="text-blue-100 text-sm leading-relaxed mb-4">
                         Diversifying your portfolio across different sectors (DeFi, L1s, Gaming) can help reduce risk.
                      </p>
                      <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors">
                         Read Guide
                      </button>
                  </div>
               </div>
            </div>
          )}
       </div>
       
       <PortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};