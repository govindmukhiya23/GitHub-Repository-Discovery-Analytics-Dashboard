import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Button,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export default function ContributorLegend({
  contributors = [],
  visibleContributors = [],
  onToggleContributor,
  onSelectAll,
  onDeselectAll,
}) {
  if (contributors.length === 0) return null;

  const allVisible = visibleContributors.length === contributors.length;

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleAltIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Contributors ({visibleContributors.length}/{contributors.length} visible)
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="text"
            startIcon={<VisibilityIcon fontSize="small" />}
            onClick={() => onSelectAll()}
            disabled={allVisible}
            sx={{ fontSize: '0.75rem', py: 0.25 }}
          >
            Show All
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<VisibilityOffIcon fontSize="small" />}
            onClick={() => onDeselectAll()}
            disabled={visibleContributors.length === 0}
            sx={{ fontSize: '0.75rem', py: 0.25, color: 'text.secondary' }}
          >
            Hide All
          </Button>
        </Stack>
      </Box>

      {/* Contributor chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {contributors.map((c) => {
          const isVisible = visibleContributors.includes(c.login);
          return (
            <Chip
              key={c.login}
              avatar={
                <Avatar
                  src={c.avatarUrl}
                  alt={c.login}
                  sx={{ width: 22, height: 22 }}
                >
                  {c.login.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isVisible ? c.color : '#9CA3AF',
                      display: 'inline-block',
                    }}
                  />
                  <span>{c.login}</span>
                </Box>
              }
              onClick={() => onToggleContributor(c.login)}
              variant={isVisible ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer',
                borderColor: isVisible ? c.color : 'divider',
                backgroundColor: isVisible ? `${c.color}15` : '#F9FAFB',
                color: isVisible ? 'text.primary' : '#9CA3AF',
                fontWeight: isVisible ? 600 : 400,
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isVisible ? `${c.color}25` : '#E5E7EB',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

