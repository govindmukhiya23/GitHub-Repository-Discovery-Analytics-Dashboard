import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import RepositoryCard from './RepositoryCard';
import RepositorySkeleton from './RepositorySkeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

export default function RepositoryList({
  repositories = [],
  loading = false,
  loadingMore = false,
  hasMore = true,
  error = null,
  totalCount = 0,
  onLoadMore,
  onRetry,
  onConfigureToken,
}) {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Intersection Observer for infinite scrolling
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && !loadingMore && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, loading, loadingMore, onLoadMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Initial loading state with skeletons
  if (loading && repositories.length === 0) {
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((key) => (
          <RepositorySkeleton key={key} />
        ))}
      </Box>
    );
  }

  // Error state for initial load
  if (error && repositories.length === 0) {
    return <ErrorMessage message={error} onRetry={onRetry} onConfigureToken={onConfigureToken} />;
  }

  // Empty state
  if (!loading && repositories.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box>
      {/* Repositories count indicator */}
      {totalCount > 0 && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{repositories.length}</strong> of <strong>{totalCount.toLocaleString()}</strong> repositories (sorted by stars)
          </Typography>
        </Box>
      )}

      {/* Repository Cards */}
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}

      {/* Sentinel element for infinite scrolling */}
      <Box ref={sentinelRef} sx={{ height: 20, my: 1 }} />

      {/* Loading More Indicator */}
      {loadingMore && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1.5}
          py={3}
        >
          <CircularProgress size={24} thickness={4} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading more trending repositories...
          </Typography>
        </Box>
      )}

      {/* Inline error when loading more fails */}
      {error && repositories.length > 0 && (
        <Alert
          severity="error"
          sx={{ mt: 2, mb: 2 }}
          action={
            onRetry ? (
              <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }} onClick={onRetry}>
                Retry
              </Box>
            ) : null
          }
        >
          {error}
        </Alert>
      )}

      {/* End of list indicator */}
      {!hasMore && repositories.length > 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            You've reached the end of the available results for this time window.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

