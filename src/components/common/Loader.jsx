import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ message = 'Loading...' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
    >
      <CircularProgress size={36} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
