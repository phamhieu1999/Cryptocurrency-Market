import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/authSlice';
import { fetchCoins } from './store/cryptoSlice';
import { Navbar } from './components/Navbar';
import { MarketHeader } from './components/MarketHeader';
import { Home } from './pages/Home';
import { CoinDetail } from './pages/CoinDetail';
import { Footer } from './components/Footer';

// Create a wrapper component to handle initial dispatch
const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    // Fetch coins globally so search works on every page
    dispatch(fetchCoins());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MarketHeader />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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