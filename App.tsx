
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuth } from './store/authSlice';
import { fetchCoins, updatePrices } from './store/cryptoSlice';
import { Navbar } from './components/Navbar';
import { MarketHeader } from './components/MarketHeader';
import { Home } from './pages/Home';
import { CoinDetail } from './pages/CoinDetail';
import { Exchanges } from './pages/Exchanges';
import { Community } from './pages/Community';
import { Footer } from './components/Footer';

// Create a wrapper component to handle initial dispatch and tickers
const AppContent = () => {
  const dispatch = useAppDispatch();
  const { coins } = useAppSelector(state => state.crypto);

  useEffect(() => {
    dispatch(checkAuth());
    // Fetch coins globally so search works on every page
    dispatch(fetchCoins());
  }, [dispatch]);

  // Simulate Real-time Ticker
  useEffect(() => {
    if (coins.length === 0) return;

    const intervalId = setInterval(() => {
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
    }, 2000); // Updates every 2 seconds

    return () => clearInterval(intervalId);
  }, [coins, dispatch]);

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