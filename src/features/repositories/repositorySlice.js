import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedPeriod: 30, // 7, 14, or 30 days
  currentPage: 1,
  loading: false,       // initial page load
  loadingMore: false,   // infinite scroll load
  hasMore: true,
  totalCount: 0,
  error: null,
};

export const repositorySlice = createSlice({
  name: 'repositories',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
      state.currentPage = 1;
      state.items = [];
      state.hasMore = true;
      state.error = null;
    },
    fetchRepositoriesRequest: (state, action) => {
      const { page } = action.payload || {};
      if (page === 1 || !page) {
        state.loading = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    },
    fetchRepositoriesSuccess: (state, action) => {
      const { items, totalCount, page, hasMore } = action.payload;
      state.loading = false;
      state.loadingMore = false;
      state.totalCount = totalCount;
      state.currentPage = page;
      state.hasMore = hasMore;
      state.error = null;

      if (page === 1) {
        state.items = items;
      } else {
        // Prevent duplicate repositories by id
        const existingIds = new Set(state.items.map((r) => r.id));
        const newUniqueItems = items.filter((r) => !existingIds.has(r.id));
        state.items = [...state.items, ...newUniqueItems];
      }
    },
    fetchRepositoriesFailure: (state, action) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload;
    },
    resetRepositories: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
      state.loading = false;
      state.loadingMore = false;
    },
  },
});

export const {
  setPeriod,
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  resetRepositories,
} = repositorySlice.actions;

export default repositorySlice.reducer;
