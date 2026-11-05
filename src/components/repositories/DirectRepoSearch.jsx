import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  InputAdornment,
  Alert,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';
import { parseGitHubUrl } from '../../utils/formatUtils';

const QUICK_EXAMPLES = [
  'facebook/react',
  'vitejs/vite',
  'torvalds/linux',
  'vercel/next.js',
];

export default function DirectRepoSearch() {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleInspect = (target) => {
    const raw = (target || inputVal).trim();
    if (!raw) {
      setErrorMsg('Please enter a GitHub repository URL or owner/repo.');
      return;
    }

    const parsed = parseGitHubUrl(raw);
    if (!parsed) {
      setErrorMsg('Invalid format. Enter a full GitHub URL (e.g., https://github.com/facebook/react) or "owner/repo" (e.g., facebook/react).');
      return;
    }

    setErrorMsg('');
    navigate(`/repo/${parsed.owner}/${parsed.repo}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInspect();
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3 },
        mb: 4,
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <InsightsIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
          Inspect Any GitHub Repository
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Paste any public GitHub repository URL or format like <code>owner/repository</code> to analyze its commits, code frequency, and contributors.
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleInspect();
        }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="https://github.com/facebook/react or facebook/react"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GitHubIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#F9FAFB',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          sx={{
            minWidth: 140,
            py: 1,
            px: 2.5,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Analyze
        </Button>
      </Box>

      {errorMsg && (
        <Alert severity="warning" sx={{ mb: 2, py: 0.5, fontSize: '0.825rem' }}>
          {errorMsg}
        </Alert>
      )}

      {/* Quick Example Suggestions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Quick Examples:
        </Typography>
        {QUICK_EXAMPLES.map((example) => (
          <Chip
            key={example}
            label={example}
            size="small"
            clickable
            onClick={() => {
              setInputVal(example);
              handleInspect(example);
            }}
            sx={{
              fontSize: '0.75rem',
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              '&:hover': {
                backgroundColor: '#EFF6FF',
                borderColor: '#BFDBFE',
                color: 'primary.main',
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}

