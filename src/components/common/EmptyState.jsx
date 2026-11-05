import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function EmptyState({
  title = 'No repositories found',
  description = 'There are no repositories matching your current filter criteria. Try selecting a longer time period.',
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 5,
        my: 3,
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h3" color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
        {description}
      </Typography>
    </Paper>
  );
}
