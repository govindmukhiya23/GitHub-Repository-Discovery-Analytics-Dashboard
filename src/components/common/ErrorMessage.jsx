import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyIcon from '@mui/icons-material/Key';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export default function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  onConfigureToken,
  onLoadSampleData,
}) {
  const isRateLimit = message && message.toLowerCase().includes('rate limit');

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3.5,
        my: 3,
        textAlign: 'center',
        borderColor: isRateLimit ? '#FCD34D' : 'error.light',
        backgroundColor: isRateLimit ? '#FFFBEB' : '#FEF2F2',
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <ErrorOutlineIcon
          sx={{
            fontSize: 44,
            color: isRateLimit ? '#D97706' : 'error.main',
          }}
        />
      </Box>
      <Typography
        variant="h4"
        color={isRateLimit ? '#92400E' : 'error.main'}
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        {isRateLimit ? 'GitHub API Rate Limit Reached' : title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 640, mx: 'auto', mb: 3, lineHeight: 1.6 }}
      >
        {message || 'An unexpected error occurred while communicating with the GitHub API.'}
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
      >
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onRetry}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            Try Again
          </Button>
        )}

        {onConfigureToken && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<KeyIcon />}
            onClick={onConfigureToken}
            sx={{ fontWeight: 600 }}
          >
            Configure Token
          </Button>
        )}

        {onLoadSampleData && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<AutoGraphIcon />}
            onClick={onLoadSampleData}
            sx={{ fontWeight: 600 }}
          >
            Load Sample Activity
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
