import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AdjustIcon from '@mui/icons-material/Adjust';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useNavigate } from 'react-router-dom';
import { formatNumber, formatRelativeDate } from '../../utils/dateUtils';
import { truncateText } from '../../utils/formatUtils';

export default function RepositoryCard({ repository }) {
  const navigate = useNavigate();

  if (!repository) return null;

  const {
    id,
    name,
    description,
    stargazers_count = 0,
    open_issues_count = 0,
    owner = {},
    html_url,
    created_at,
    pushed_at,
    language,
  } = repository;

  const ownerLogin = owner?.login || 'unknown';
  const avatarUrl = owner?.avatar_url || '';

  const handleCardClick = () => {
    navigate(`/repo/${ownerLogin}/${name}`, { state: { repository } });
  };

  const handleExternalLink = (e) => {
    e.stopPropagation();
    window.open(html_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          textAlign: 'left',
        }}
      >
        {/* Left Section: Owner Avatar */}
        <Box sx={{ mr: 2.5, alignSelf: 'flex-start' }}>
          <Avatar
            src={avatarUrl}
            alt={ownerLogin}
            sx={{
              width: 52,
              height: 52,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            {ownerLogin.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Middle Section: Repository Information */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Repo Name & Owner */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1rem', sm: '1.15rem' },
                fontWeight: 700,
                color: 'primary.main',
                wordBreak: 'break-word',
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              by {ownerLogin}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: description ? 'text.secondary' : '#9CA3AF',
              fontStyle: description ? 'normal' : 'italic',
              mb: 1.5,
              wordBreak: 'break-word',
              lineHeight: 1.5,
            }}
          >
            {description ? truncateText(description, 180) : 'No description provided for this repository.'}
          </Typography>

          {/* Metadata Chips & Badges */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25 }}>
            {/* Stars */}
            <Chip
              icon={<StarOutlineIcon sx={{ fontSize: '1rem !important', color: '#D97706' }} />}
              label={`${formatNumber(stargazers_count)} stars`}
              size="small"
              sx={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FDE68A',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />

            {/* Open Issues */}
            <Chip
              icon={<AdjustIcon sx={{ fontSize: '1rem !important', color: '#059669' }} />}
              label={`${formatNumber(open_issues_count)} issues`}
              size="small"
              sx={{
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                borderColor: '#A7F3D0',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />

            {/* Language (if present) */}
            {language && (
              <Chip
                label={language}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              />
            )}

            {/* Relative Time / Created Date */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                fontSize: '0.75rem',
                ml: { xs: 0, sm: 'auto' },
              }}
            >
              <ScheduleIcon sx={{ fontSize: 14 }} />
              <span>
                {pushed_at ? `Pushed ${formatRelativeDate(pushed_at)}` : `Created ${formatRelativeDate(created_at)}`}
              </span>
            </Box>
          </Box>
        </Box>

        {/* Right Section: External Link & Navigation Arrow */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 2,
            alignSelf: 'center',
          }}
        >
          {html_url && (
            <Tooltip title="View repository on GitHub">
              <IconButton
                size="small"
                onClick={handleExternalLink}
                aria-label="Open in GitHub"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary', backgroundColor: '#F3F4F6' },
                }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="View repository analytics">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', backgroundColor: '#EFF6FF' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActionArea>
    </Card>
  );
}
