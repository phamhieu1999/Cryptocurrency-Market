import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Coin, Exchange, GlobalStats } from '../types';
import { cryptoService } from '../services/cryptoService';

interface CryptoState {
  coins: Coin[];
  exchanges: Exchange[];
  selectedCoin: Coin | null;
  globalStats: GlobalStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  exchangeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CryptoState = {
  coins: [],
  exchanges: [],
  selectedCoin: null,
  globalStats: null,
  status: 'idle',
  exchangeStatus: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async () => {
  const response = await cryptoService.getCoins();
  return response;
});

export const fetchExchanges = createAsyncThunk('crypto/fetchExchanges', async () => {
    const response = await cryptoService.getExchanges();
    return response;
});

export const fetchCoinById = createAsyncThunk('crypto/fetchCoinById', async (id: string) => {
  const response = await cryptoService.getCoinById(id);
  return response;
});

export const fetchGlobalStats = createAsyncThunk('crypto/fetchGlobalStats', async () => {
  const response = await cryptoService.getGlobalStats();
  return response;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    clearSelectedCoin: (state) => {
      state.selectedCoin = null;
      state.detailStatus = 'idle';
    },
    updatePrices: (state, action: PayloadAction<{ [id: string]: number }>) => {
      const updates = action.payload;
      
      // Update items in the list
      state.coins.forEach(coin => {
        if (updates[coin.id]) {
          coin.price = updates[coin.id];
        }
      });

      // Update selected coin if it matches an update
      if (state.selectedCoin && updates[state.selectedCoin.id]) {
        state.selectedCoin.price = updates[state.selectedCoin.id];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Coins
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch coins';
      })
      // Fetch Exchanges
      .addCase(fetchExchanges.pending, (state) => {
        state.exchangeStatus = 'loading';
      })
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        state.exchangeStatus = 'succeeded';
        state.exchanges = action.payload;
      })
      .addCase(fetchExchanges.rejected, (state, action) => {
          state.exchangeStatus = 'failed';
          state.error = action.error.message || 'Failed to fetch exchanges';
      })
      // Fetch Coin By ID
      .addCase(fetchCoinById.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchCoinById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedCoin = action.payload || null;
      })
      .addCase(fetchCoinById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch coin details';
      })
      // Fetch Global Stats
      .addCase(fetchGlobalStats.fulfilled, (state, action) => {
        state.globalStats = action.payload;
      });
  },
});

export const { clearSelectedCoin, updatePrices } = cryptoSlice.actions;
export default cryptoSlice.reducer;