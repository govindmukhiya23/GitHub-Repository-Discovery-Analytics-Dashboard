import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

export default function RepositorySkeleton() {
  return (
    <Card variant="outlined" sx={{ mb: 2, p: 1, backgroundColor: '#FFFFFF' }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          {/* Avatar Skeleton */}
          <Skeleton variant="circular" width={48} height={48} />

          {/* Middle Info Skeleton */}
          <Box flex={1}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="85%" height={20} sx={{ mb: 1.5 }} />
            <Box display="flex" gap={2}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="text" width={120} height={24} />
            </Box>
          </Box>

          {/* Right Arrow Skeleton */}
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </CardContent>
    </Card>
  );
}

