import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TokenDialog from '../common/TokenDialog';
import { getStoredToken } from '../../services/githubApi';
import { parseGitHubUrl } from '../../utils/formatUtils';

export default function Header() {
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [hasToken, setHasToken] = useState(Boolean(getStoredToken()));
  const navigate = useNavigate();

  const handleTokenSaved = () => {
    setHasToken(Boolean(getStoredToken()));
  };

  const handleInspect = (e) => {
    if (e) e.preventDefault();
    const raw = searchQuery.trim();
    if (!raw) {
      setSearchError('Please enter a GitHub repository URL or owner/repo.');
      return;
    }

    const parsed = parseGitHubUrl(raw);
    if (!parsed) {
      setSearchError('Invalid format. Enter a full GitHub URL (e.g. https://github.com/facebook/react) or "owner/repo".');
      return;
    }

    setSearchError('');
    setSearchDialogOpen(false);
    setSearchQuery('');
    navigate(`/repo/${parsed.owner}/${parsed.repo}`);
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

            {/* Right Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Tooltip title="Inspect any GitHub repository URL">
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  startIcon={<SearchIcon />}
                  onClick={() => setSearchDialogOpen(true)}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderColor: 'divider',
                    color: 'text.primary',
                  }}
                >
                  Inspect URL
                </Button>
              </Tooltip>

              <Tooltip title={hasToken ? 'GitHub Token Active (5,000 req/hr)' : 'Configure GitHub Token (stored in .env or localStorage)'}>
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
                sx={{ fontWeight: 600, color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' } }}
              >
                Trending
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

      {/* Inspect GitHub URL Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => {
          setSearchDialogOpen(false);
          setSearchError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <GitHubIcon color="primary" />
          Inspect GitHub Repository
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter a GitHub repository URL or <code>owner/repository</code> to analyze its weekly commits, code additions, deletions, and contributor history.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="https://github.com/facebook/react or facebook/react"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchError) setSearchError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInspect();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: searchError ? 1.5 : 0 }}
          />

          {searchError && (
            <Alert severity="warning" sx={{ mt: 1.5, py: 0.5, fontSize: '0.8rem' }}>
              {searchError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setSearchDialogOpen(false);
              setSearchError('');
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleInspect}>
            Analyze Repository
          </Button>
        </DialogActions>
      </Dialog>

      {/* Token Dialog */}
      <TokenDialog
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onTokenSaved={handleTokenSaved}
      />
    </>
  );
}
