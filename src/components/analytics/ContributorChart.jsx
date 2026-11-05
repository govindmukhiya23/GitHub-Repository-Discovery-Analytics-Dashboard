import React, { useMemo } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import GroupIcon from '@mui/icons-material/Group';
import ContributorLegend from './ContributorLegend';

const METRIC_LABELS = {
  commits: 'Commits',
  additions: 'Code Additions',
  deletions: 'Code Deletions',
};

export default function ContributorChart({
  contributorActivity = [],
  contributors = [],
  visibleContributors = [],
  activityType = 'commits',
  onToggleContributor,
  onSelectAll,
  onDeselectAll,
}) {
  const metricLabel = METRIC_LABELS[activityType] || 'Commits';

  const chartOptions = useMemo(() => {
    // Determine categories from first contributor with data
    const firstWithData = contributorActivity.find((c) => c.data && c.data.length > 0);
    const categories = firstWithData ? firstWithData.data.map((d) => d.dateLabel) : [];

    // Filter series by visibleContributors
    const series = contributorActivity
      .filter((c) => visibleContributors.includes(c.login))
      .map((c) => ({
        name: c.login,
        color: c.color,
        data: c.data.map((d) => d[activityType] || 0),
        marker: {
          radius: 2.5,
        },
      }));

    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        backgroundColor: '#FFFFFF',
        spacing: [20, 20, 20, 20],
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories,
        tickmarkPlacement: 'on',
        labels: {
          rotation: -45,
          style: {
            fontSize: '11px',
            color: '#656D76',
          },
          step: Math.max(1, Math.floor(categories.length / 10)),
        },
        lineColor: '#D0D7DE',
        tickColor: '#D0D7DE',
      },
      yAxis: {
        title: {
          text: `Weekly ${metricLabel}`,
          style: {
            color: '#656D76',
            fontWeight: '600',
            fontSize: '12px',
          },
        },
        min: 0,
        gridLineColor: '#F3F4F6',
        labels: {
          style: {
            color: '#656D76',
            fontSize: '11px',
          },
        },
      },
      legend: {
        enabled: false, // We use the custom interactive ContributorLegend component
      },
      tooltip: {
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        borderRadius: 8,
        shared: false,
        style: {
          color: '#FFFFFF',
          fontSize: '12px',
        },
        useHTML: true,
        formatter: function () {
          return `
            <div style="padding: 4px;">
              <div style="font-weight: 600; margin-bottom: 4px; color: #9CA3AF;">Week of ${this.x}</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; display: flex; align-items: center; gap: 6px;">
                <span style="color:${this.color}; font-size: 16px;">●</span>
                <span>${this.series.name}:</span>
                <span style="color: #60A5FA;">${this.y.toLocaleString()} ${activityType}</span>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        line: {
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 3,
            },
          },
        },
      },
      series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              xAxis: {
                labels: {
                  step: Math.max(1, Math.floor(categories.length / 5)),
                },
              },
            },
          },
        ],
      },
    };
  }, [contributorActivity, visibleContributors, activityType, metricLabel]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        backgroundColor: '#FFFFFF',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <GroupIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
        <Box>
          <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Contributor Activity – Weekly {metricLabel}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Compare contributions across individual project contributors over time
          </Typography>
        </Box>
      </Box>

      {/* Interactive Contributor Legend */}
      <ContributorLegend
        contributors={contributors}
        visibleContributors={visibleContributors}
        onToggleContributor={onToggleContributor}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />

      {contributors.length === 0 ? (
        <Box py={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No contributor activity data returned by GitHub for this repository.
          </Typography>
        </Box>
      ) : visibleContributors.length === 0 ? (
        <Box py={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            All contributors are currently hidden. Select at least one contributor above to view their activity.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', minHeight: 340 }}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      )}
    </Paper>
  );
}

