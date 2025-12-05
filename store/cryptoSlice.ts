import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Coin, GlobalStats } from '../types';
import { cryptoService } from '../services/cryptoService';

interface CryptoState {
  coins: Coin[];
  selectedCoin: Coin | null;
  globalStats: GlobalStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CryptoState = {
  coins: [],
  selectedCoin: null,
  globalStats: null,
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async () => {
  const response = await cryptoService.getCoins();
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

export const { clearSelectedCoin } = cryptoSlice.actions;
export default cryptoSlice.reducer;
