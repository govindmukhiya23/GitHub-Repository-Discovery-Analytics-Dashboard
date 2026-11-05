import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  setPeriod,
  fetchRepositoriesRequest,
} from '../features/repositories/repositorySlice';
import DateFilter from '../components/repositories/DateFilter';
import RepositoryList from '../components/repositories/RepositoryList';
import DirectRepoSearch from '../components/repositories/DirectRepoSearch';
import TokenDialog from '../components/common/TokenDialog';

export default function Home() {
  const dispatch = useAppDispatch();
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const {
    items,
    selectedPeriod,
    currentPage,
    loading,
    loadingMore,
    hasMore,
    totalCount,
    error,
  } = useAppSelector((state) => state.repositories);

  // Initial fetch on mount if list is empty
  useEffect(() => {
    if (items.length === 0 && !loading && !error) {
      dispatch(
        fetchRepositoriesRequest({
          period: selectedPeriod,
          page: 1,
        })
      );
    }
  }, [dispatch, items.length, selectedPeriod, loading, error]);

  // Handle date filter change (7, 14, 30 days)
  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === selectedPeriod && items.length > 0) return;
    dispatch(setPeriod(newPeriod));
    dispatch(
      fetchRepositoriesRequest({
        period: newPeriod,
        page: 1,
      })
    );
  };

  // Handle infinite scroll trigger
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      dispatch(
        fetchRepositoriesRequest({
          period: selectedPeriod,
          page: currentPage + 1,
        })
      );
    }
  };

  const handleRetry = () => {
    dispatch(
      fetchRepositoriesRequest({
        period: selectedPeriod,
        page: items.length === 0 ? 1 : currentPage,
      })
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Page Title & Subtitle */}
      <Box sx={{ mb: 4, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            fontWeight: 800,
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          Discover Trending Repositories
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 680,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
          }}
        >
          Explore popular open-source projects created recently, sorted by star count.
          Select any repository to analyze its development velocity, commits, and contributor activity.
        </Typography>
      </Box>

      {/* Direct GitHub URL or Owner/Repo Inspector */}
      <DirectRepoSearch />

      {/* Date Filter */}
      <DateFilter
        selectedPeriod={selectedPeriod}
        onChange={handlePeriodChange}
        disabled={loading}
      />

      {/* Repository List with Infinite Scrolling */}
      <RepositoryList
        repositories={items}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        totalCount={totalCount}
        error={error}
        onLoadMore={handleLoadMore}
        onRetry={handleRetry}
        onConfigureToken={() => setTokenDialogOpen(true)}
      />

      <TokenDialog
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onTokenSaved={handleRetry}
      />
    </Container>
  );
}

