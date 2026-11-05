import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRepository: null,
  activityType: 'commits', // 'commits' | 'additions' | 'deletions'
  totalActivity: [],
  contributorActivity: [],
  contributors: [],
  visibleContributors: [],
  loading: false,
  error: null,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setActivityType: (state, action) => {
      state.activityType = action.payload;
    },
    setSelectedRepository: (state, action) => {
      state.selectedRepository = action.payload;
    },
    fetchAnalyticsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAnalyticsSuccess: (state, action) => {
      const { repository, totalActivity, contributorActivity, contributors } = action.payload;
      state.loading = false;
      state.error = null;
      if (repository) {
        state.selectedRepository = repository;
      }
      state.totalActivity = totalActivity;
      state.contributorActivity = contributorActivity;
      state.contributors = contributors;
      // Default: make all returned contributors visible
      state.visibleContributors = contributors.map((c) => c.login);
    },
    fetchAnalyticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleContributorVisibility: (state, action) => {
      const login = action.payload;
      if (state.visibleContributors.includes(login)) {
        state.visibleContributors = state.visibleContributors.filter((l) => l !== login);
      } else {
        state.visibleContributors.push(login);
      }
    },
    setAllContributorsVisible: (state, action) => {
      if (action.payload) {
        state.visibleContributors = state.contributors.map((c) => c.login);
      } else {
        state.visibleContributors = [];
      }
    },
    clearAnalytics: (state) => {
      state.selectedRepository = null;
      state.activityType = 'commits';
      state.totalActivity = [];
      state.contributorActivity = [];
      state.contributors = [];
      state.visibleContributors = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setActivityType,
  setSelectedRepository,
  fetchAnalyticsRequest,
  fetchAnalyticsSuccess,
  fetchAnalyticsFailure,
  toggleContributorVisibility,
  setAllContributorsVisible,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

