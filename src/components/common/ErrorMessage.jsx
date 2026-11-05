import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorMessage({ title = 'Error', message, onRetry }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        my: 3,
        textAlign: 'center',
        borderColor: 'error.light',
        backgroundColor: '#FEF2F2',
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main' }} />
      </Box>
      <Typography variant="h4" color="error.main" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: onRetry ? 2 : 0 }}>
        {message || 'An unexpected error occurred while communicating with the GitHub API.'}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onRetry}
          sx={{ mt: 1 }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );
}
