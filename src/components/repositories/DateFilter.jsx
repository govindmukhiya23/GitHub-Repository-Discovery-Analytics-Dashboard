import React from 'react';
import { Box, ButtonGroup, Button, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const FILTER_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 14 Days', value: 14 },
  { label: 'Last 30 Days', value: 30 },
];

export default function DateFilter({ selectedPeriod, onChange, disabled }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Created Within:
        </Typography>
      </Box>

      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="Repository creation date filter"
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: 2,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isSelected = selectedPeriod === opt.value;
          return (
            <Button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              disabled={disabled}
              variant={isSelected ? 'contained' : 'outlined'}
              sx={{
                px: 2,
                py: 0.75,
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? '#FFFFFF' : 'text.primary',
                backgroundColor: isSelected ? 'primary.main' : 'transparent',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: isSelected ? 'primary.dark' : '#F3F4F6',
                  borderColor: 'divider',
                },
              }}
            >
              {opt.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
}

