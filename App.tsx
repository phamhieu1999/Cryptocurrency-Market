import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuth } from './store/authSlice';
import { fetchCoins, updatePrices, updateHighlights } from './store/cryptoSlice';
import { Navbar } from './components/Navbar';
import { MarketHeader } from './components/MarketHeader';
import { Home } from './pages/Home';
import { CoinDetail } from './pages/CoinDetail';
import { Exchanges } from './pages/Exchanges';
import { Community } from './pages/Community';
import { Watchlist } from './pages/Watchlist';
import { Portfolio } from './pages/Portfolio';
import { Settings } from './pages/Settings';
import { Footer } from './components/Footer';

// Create a wrapper component to handle initial dispatch and tickers
const AppContent = () => {
  const dispatch = useAppDispatch();
  const { coins, highlights } = useAppSelector(state => state.crypto);

  useEffect(() => {
    dispatch(checkAuth());
    // Fetch coins globally so search works on every page
    dispatch(fetchCoins());
  }, [dispatch]);

  // Simulate Real-time Ticker
  useEffect(() => {
    if (coins.length === 0) return;

    const intervalId = setInterval(() => {
      // 1. Update Coin Prices
      const updates: Record<string, number> = {};
      const numberOfUpdates = 8; // Update 8 coins at a time
      
      for (let i = 0; i < numberOfUpdates; i++) {
        const randomIndex = Math.floor(Math.random() * coins.length);
        const coin = coins[randomIndex];
        // Fluctuate between -0.5% and +0.5%
        const volatility = 0.005; 
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        updates[coin.id] = coin.price * change;
      }

      dispatch(updatePrices(updates));

      // 2. Update Market Highlights (Market Cap, Index, RSI, etc.)
      if (highlights) {
         // Random fluctuation factor
         const getFluctuation = (range: number) => (Math.random() * range * 2 - range);

         // Update Market Cap slightly
         const capChangePercent = getFluctuation(0.001); // +/- 0.1%
         const newMarketCap = highlights.marketCap.value * (1 + capChangePercent);

         // Update CMC20 Index slightly
         const indexChangePercent = getFluctuation(0.002); // +/- 0.2%
         const newIndex = highlights.topIndex.value * (1 + indexChangePercent);

         // Occasional updates for others (10% chance)
         let newRsi = highlights.cryptoRsi.value;
         if (Math.random() > 0.9) {
             newRsi = Math.min(100, Math.max(0, newRsi + getFluctuation(2)));
         }
         
         let newFearGreed = highlights.fearAndGreed.value;
         if (Math.random() > 0.9) {
             newFearGreed = Math.round(Math.min(100, Math.max(0, newFearGreed + getFluctuation(3))));
         }

         dispatch(updateHighlights({
             marketCap: { ...highlights.marketCap, value: newMarketCap },
             topIndex: { ...highlights.topIndex, value: newIndex },
             cryptoRsi: { ...highlights.cryptoRsi, value: newRsi },
             fearAndGreed: { ...highlights.fearAndGreed, value: newFearGreed }
         }));
      }

    }, 2000); // Updates every 2 seconds

    return () => clearInterval(intervalId);
  }, [coins, highlights, dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MarketHeader />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/community" element={<Community />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;