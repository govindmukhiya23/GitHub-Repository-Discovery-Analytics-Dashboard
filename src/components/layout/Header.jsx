import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyIcon from '@mui/icons-material/Key';
import { Link as RouterLink } from 'react-router-dom';
import TokenDialog from '../common/TokenDialog';
import { getStoredToken } from '../../services/githubApi';

export default function Header() {
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [hasToken, setHasToken] = useState(Boolean(getStoredToken()));

  const handleTokenSaved = () => {
    setHasToken(Boolean(getStoredToken()));
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 64 }}>
            {/* Logo & Brand */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                }}
              >
                <TimelineIcon fontSize="medium" />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  GitHub Pulse
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: '#EFF6FF',
                      color: 'primary.main',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: '#BFDBFE',
                    }}
                  >
                    v1.0
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', fontSize: '0.75rem' }}>
                  Repository Discovery & Analytics Dashboard
                </Typography>
              </Box>
            </Box>

            {/* Right Links & Token Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title={hasToken ? 'GitHub Token Active (5,000 req/hr)' : 'Configure GitHub Token (increase to 5,000 req/hr)'}>
                <Button
                  variant={hasToken ? 'outlined' : 'contained'}
                  color={hasToken ? 'success' : 'primary'}
                  size="small"
                  startIcon={<KeyIcon />}
                  onClick={() => setTokenDialogOpen(true)}
                  sx={{
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                  }}
                >
                  {hasToken ? 'Token Active' : 'API Token'}
                </Button>
              </Tooltip>

              <Button
                component={RouterLink}
                to="/"
                variant="text"
                color="inherit"
                size="small"
                sx={{ fontWeight: 600, color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Explore
              </Button>

              <IconButton
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="GitHub"
                size="small"
                sx={{ color: 'text.primary' }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <TokenDialog
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onTokenSaved={handleTokenSaved}
      />
    </>
  );
}
