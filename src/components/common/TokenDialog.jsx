import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { getStoredToken, setStoredToken } from '../../services/githubApi';

export default function TokenDialog({ open, onClose, onTokenSaved }) {
  const [tokenInput, setTokenInput] = useState(getStoredToken());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setStoredToken(tokenInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      if (onTokenSaved) onTokenSaved();
    }, 600);
  };

  const handleClear = () => {
    setStoredToken('');
    setTokenInput('');
    if (onTokenSaved) onTokenSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <KeyIcon color="primary" />
        Configure GitHub Personal Access Token
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" paragraph>
          GitHub's public API allows only <strong>60 unauthenticated requests/hour</strong> per IP address.
          Entering a free GitHub Personal Access Token increases your limit to <strong>5,000 requests/hour</strong>.
        </Typography>

        <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.8rem' }}>
          <strong>No special scopes required:</strong> A classic token without any checked scopes or a fine-grained token with public repository read permissions is sufficient. Your token is stored only in your browser's local storage.
        </Alert>

        <TextField
          label="GitHub Token (classic or fine-grained)"
          type="password"
          fullWidth
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          size="small"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="https://github.com/settings/tokens/new?description=GitHubPulse&scopes="
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Create a token on GitHub ↗
          </Link>
          {getStoredToken() && (
            <Button color="error" size="small" onClick={handleClear}>
              Remove Token
            </Button>
          )}
        </Box>

        {savedSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Token saved successfully!
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} color="primary">
          Save Token
        </Button>
      </DialogActions>
    </Dialog>
  );
}
