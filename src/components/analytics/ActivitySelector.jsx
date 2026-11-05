import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ACTIVITY_OPTIONS = [
  { value: 'commits', label: 'Commits', desc: 'Total commit count per week' },
  { value: 'additions', label: 'Additions', desc: 'Lines of code added per week' },
  { value: 'deletions', label: 'Deletions', desc: 'Lines of code deleted per week' },
];

export default function ActivitySelector({ activityType, onChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Activity Metric
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Select metric to update both total and contributor charts
          </Typography>
        </Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="activity-type-label">Metric</InputLabel>
        <Select
          labelId="activity-type-label"
          id="activity-type-select"
          value={activityType}
          label="Metric"
          onChange={(e) => onChange(e.target.value)}
          sx={{
            fontWeight: 600,
            backgroundColor: '#F9FAFB',
          }}
        >
          {ACTIVITY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
