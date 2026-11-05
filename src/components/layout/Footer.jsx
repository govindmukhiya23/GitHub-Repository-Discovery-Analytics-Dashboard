import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              GitHub Pulse – Repository Discovery & Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
              Powered by the official GitHub REST API. Built with React, Redux Toolkit, Redux Saga & Highcharts.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              variant="body2"
              underline="hover"
            >
              GitHub API Docs
            </Link>
            <Link
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              variant="body2"
              underline="hover"
            >
              Trending on GitHub
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

