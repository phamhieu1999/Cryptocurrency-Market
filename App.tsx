import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Navbar } from './components/Navbar';
import { MarketHeader } from './components/MarketHeader';
import { Home } from './pages/Home';
import { CoinDetail } from './pages/CoinDetail';
import { Footer } from './components/Footer';

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
