
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface CryptoConverterProps {
  symbol: string;
  price: number;
  image: string;
}

export const CryptoConverter: React.FC<CryptoConverterProps> = ({ symbol, price, image }) => {
  const [amount, setAmount] = useState<string>('1');
  const [convertedValue, setConvertedValue] = useState<string>(price.toFixed(2));
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    // Update conversion whenever price changes or initial load
    handleAmountChange(amount);
  }, [price]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const num = parseFloat(value);
    if (isNaN(num)) {
      setConvertedValue('');
      return;
    }

    if (isReverse) {
      // USD to Coin
      setConvertedValue((num / price).toFixed(6));
    } else {
      // Coin to USD
      setConvertedValue((num * price).toFixed(2));
    }
  };

  const toggleDirection = () => {
    setIsReverse(!isReverse);
    // Swap values logic
    setAmount(convertedValue);
    setConvertedValue(amount);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">{symbol} to USD Converter</h3>
      
      <div className="flex flex-col gap-4">
        {/* Input A */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
           <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 font-bold uppercase">{isReverse ? 'USD' : symbol}</span>
           </div>
           <div className="flex items-center gap-3">
              {isReverse ? (
                 <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">$</div>
              ) : (
                 <img src={image} className="w-8 h-8 rounded-full" alt={symbol} />
              )}
              <input 
                 type="number"
                 value={isReverse ? amount : amount} 
                 onChange={(e) => {
                    if(isReverse) {
                        setAmount(e.target.value);
                        const num = parseFloat(e.target.value);
                        setConvertedValue(isNaN(num) ? '' : (num / price).toFixed(6));
                    } else {
                        setAmount(e.target.value);
                        const num = parseFloat(e.target.value);
                        setConvertedValue(isNaN(num) ? '' : (num * price).toFixed(2));
                    }
                 }}
                 className="bg-transparent text-xl font-bold text-gray-900 outline-none w-full"
              />
           </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
           <button 
             onClick={() => {
                 setIsReverse(!isReverse);
                 setAmount(convertedValue);
                 setConvertedValue(amount);
             }}
             className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 shadow-sm"
           >
              <ArrowRightLeft size={16} className="text-gray-500" />
           </button>
        </div>

        {/* Input B */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
           <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 font-bold uppercase">{isReverse ? symbol : 'USD'}</span>
           </div>
           <div className="flex items-center gap-3">
              {isReverse ? (
                 <img src={image} className="w-8 h-8 rounded-full" alt={symbol} />
              ) : (
                 <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">$</div>
              )}
              <input 
                 type="number"
                 value={isReverse ? convertedValue : convertedValue} 
                 onChange={(e) => {
                     // Reverse calculation logic if user types in bottom box
                     if(isReverse) {
                         setConvertedValue(e.target.value);
                         const num = parseFloat(e.target.value);
                         setAmount(isNaN(num) ? '' : (num * price).toFixed(2));
                     } else {
                         setConvertedValue(e.target.value);
                         const num = parseFloat(e.target.value);
                         setAmount(isNaN(num) ? '' : (num / price).toFixed(6));
                     }
                 }}
                 className="bg-transparent text-xl font-bold text-gray-900 outline-none w-full"
              />
           </div>
        </div>
      </div>
       <div className="mt-4 text-xs text-gray-500">
          1 {symbol} = {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
       </div>
    </div>
  );
};
