import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AdjustIcon from '@mui/icons-material/Adjust';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  fetchAnalyticsRequest,
  fetchAnalyticsSuccess,
  setActivityType,
  toggleContributorVisibility,
  setAllContributorsVisible,
  clearAnalytics,
} from '../features/analytics/analyticsSlice';
import ActivitySelector from '../components/analytics/ActivitySelector';
import TotalActivityChart from '../components/analytics/TotalActivityChart';
import ContributorChart from '../components/analytics/ContributorChart';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import TokenDialog from '../components/common/TokenDialog';
import { formatNumber, formatRelativeDate } from '../utils/dateUtils';
import { generateSampleAnalytics } from '../utils/chartUtils';

export default function RepositoryDetails() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [isSampleData, setIsSampleData] = useState(false);

  const {
    selectedRepository,
    activityType,
    totalActivity,
    contributorActivity,
    contributors,
    visibleContributors,
    loading,
    error,
  } = useAppSelector((state) => state.analytics);

  const passedRepo = location.state?.repository;

  useEffect(() => {
    if (owner && repo) {
      dispatch(
        fetchAnalyticsRequest({
          owner,
          repo,
          repositoryData: passedRepo || null,
        })
      );
    }

    return () => {
      dispatch(clearAnalytics());
    };
  }, [dispatch, owner, repo, passedRepo]);

  const handleRetry = () => {
    setIsSampleData(false);
    if (owner && repo) {
      dispatch(
        fetchAnalyticsRequest({
          owner,
          repo,
          repositoryData: passedRepo || null,
        })
      );
    }
  };

  const handleLoadSampleData = () => {
    const targetRepo = currentRepo || {
      name: repo,
      owner: { login: owner },
      description: 'Trending repository',
      stargazers_count: 5000,
      open_issues_count: 10,
    };

    const sample = generateSampleAnalytics(targetRepo);
    setIsSampleData(true);
    dispatch(
      fetchAnalyticsSuccess({
        repository: targetRepo,
        totalActivity: sample.totalActivity,
        contributorActivity: sample.contributorActivity,
        contributors: sample.contributors,
      })
    );
  };

  const currentRepo = selectedRepository || passedRepo;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main', backgroundColor: '#EFF6FF' },
          }}
        >
          Back to Repositories
        </Button>
      </Box>

      {/* Repository Header Card */}
      {currentRepo && (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            backgroundColor: '#FFFFFF',
            borderColor: 'divider',
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={currentRepo.owner?.avatar_url}
                alt={currentRepo.owner?.login}
                sx={{
                  width: 56,
                  height: 56,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {(currentRepo.owner?.login || 'R').charAt(0).toUpperCase()}
              </Avatar>

              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.35rem', sm: '1.65rem' },
                    fontWeight: 700,
                    color: 'text.primary',
                    wordBreak: 'break-word',
                  }}
                >
                  <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {currentRepo.owner?.login} /{' '}
                  </Box>
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    {currentRepo.name}
                  </Box>
                </Typography>

                {currentRepo.language && (
                  <Typography variant="body2" color="text.secondary">
                    Primary language: <strong>{currentRepo.language}</strong>
                  </Typography>
                )}
              </Box>
            </Box>

            {currentRepo.html_url && (
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                endIcon={<OpenInNewIcon fontSize="small" />}
                href={currentRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: 'divider',
                  fontWeight: 600,
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                View on GitHub
              </Button>
            )}
          </Box>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: currentRepo.description ? 'text.secondary' : '#9CA3AF',
              fontStyle: currentRepo.description ? 'normal' : 'italic',
              mb: 2.5,
              maxWidth: 900,
              lineHeight: 1.6,
            }}
          >
            {currentRepo.description || 'No description provided for this repository.'}
          </Typography>

          {/* Statistics Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<StarOutlineIcon sx={{ fontSize: '1.1rem !important', color: '#D97706' }} />}
              label={`${formatNumber(currentRepo.stargazers_count)} stars`}
              sx={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FDE68A',
                fontWeight: 600,
              }}
            />

            <Chip
              icon={<AdjustIcon sx={{ fontSize: '1.1rem !important', color: '#059669' }} />}
              label={`${formatNumber(currentRepo.open_issues_count)} open issues`}
              sx={{
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                borderColor: '#A7F3D0',
                fontWeight: 600,
              }}
            />

            {currentRepo.forks_count != null && (
              <Chip
                icon={<ForkRightIcon sx={{ fontSize: '1.1rem !important', color: '#4B5563' }} />}
                label={`${formatNumber(currentRepo.forks_count)} forks`}
                variant="outlined"
                sx={{ borderColor: 'divider', fontWeight: 600, color: 'text.secondary' }}
              />
            )}

            {currentRepo.subscribers_count != null && (
              <Chip
                icon={<VisibilityIcon sx={{ fontSize: '1.1rem !important', color: '#4B5563' }} />}
                label={`${formatNumber(currentRepo.subscribers_count)} watchers`}
                variant="outlined"
                sx={{ borderColor: 'divider', fontWeight: 600, color: 'text.secondary' }}
              />
            )}

            {currentRepo.pushed_at && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  ml: { xs: 0, sm: 'auto' },
                }}
              >
                <ScheduleIcon sx={{ fontSize: 16 }} />
                <span>Last updated {formatRelativeDate(currentRepo.pushed_at)}</span>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Sample Data Banner */}
      {isSampleData && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setIsSampleData(false)}>
          <strong>Preview Mode:</strong> Displaying simulated analytics data for this repository because the GitHub API rate limit was reached. You can view all chart features and contributor controls.
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Loader message="Loading weekly development and contributor activity from GitHub..." />
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage
          title="Could not load analytics"
          message={error}
          onRetry={handleRetry}
          onConfigureToken={() => setTokenDialogOpen(true)}
          onLoadSampleData={handleLoadSampleData}
        />
      )}

      {/* Analytics Content */}
      {!loading && !error && (
        <Box>
          {/* Activity Selector */}
          <Box sx={{ mb: 3 }}>
            <ActivitySelector
              activityType={activityType}
              onChange={(newType) => dispatch(setActivityType(newType))}
            />
          </Box>

          {/* Total Activity Chart */}
          <TotalActivityChart
            totalActivity={totalActivity}
            activityType={activityType}
          />

          {/* Contributor Activity Chart */}
          <ContributorChart
            contributorActivity={contributorActivity}
            contributors={contributors}
            visibleContributors={visibleContributors}
            activityType={activityType}
            onToggleContributor={(login) => dispatch(toggleContributorVisibility(login))}
            onSelectAll={() => dispatch(setAllContributorsVisible(true))}
            onDeselectAll={() => dispatch(setAllContributorsVisible(false))}
          />
        </Box>
      )}

      {/* Token Dialog */}
      <TokenDialog
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onTokenSaved={handleRetry}
      />
    </Container>
  );
}
