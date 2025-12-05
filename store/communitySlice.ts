
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Post, Topic } from '../types';
import { communityService } from '../services/communityService';

interface CommunityState {
  posts: Post[];
  trendingTopics: Topic[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CommunityState = {
  posts: [],
  trendingTopics: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('community/fetchPosts', async () => {
  const response = await communityService.getPosts();
  return response;
});

export const fetchTrendingTopics = createAsyncThunk('community/fetchTrendingTopics', async () => {
  const response = await communityService.getTrendingTopics();
  return response;
});

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(fetchTrendingTopics.fulfilled, (state, action) => {
        state.trendingTopics = action.payload;
      });
  },
});

export default communitySlice.reducer;
