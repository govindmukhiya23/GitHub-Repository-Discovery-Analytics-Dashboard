import React, { useMemo } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const METRIC_CONFIG = {
  commits: {
    title: 'Weekly Commits',
    yAxisTitle: 'Number of Commits',
    color: '#2563EB',
    fillColor: 'rgba(37, 99, 235, 0.08)',
  },
  additions: {
    title: 'Weekly Code Additions',
    yAxisTitle: 'Lines of Code Added',
    color: '#16A34A',
    fillColor: 'rgba(22, 163, 74, 0.08)',
  },
  deletions: {
    title: 'Weekly Code Deletions',
    yAxisTitle: 'Lines of Code Deleted',
    color: '#DC2626',
    fillColor: 'rgba(220, 38, 38, 0.08)',
  },
};

export default function TotalActivityChart({ totalActivity = [], activityType = 'commits' }) {
  const config = METRIC_CONFIG[activityType] || METRIC_CONFIG.commits;

  const chartOptions = useMemo(() => {
    const categories = totalActivity.map((item) => item.dateLabel);
    const data = totalActivity.map((item) => item[activityType] || 0);

    return {
      chart: {
        type: 'area',
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
          text: config.yAxisTitle,
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
        enabled: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        borderColor: '#374151',
        borderRadius: 8,
        style: {
          color: '#FFFFFF',
          fontSize: '12px',
        },
        useHTML: true,
        formatter: function () {
          return `
            <div style="padding: 4px;">
              <div style="font-weight: 600; margin-bottom: 4px; color: #9CA3AF;">Week of ${this.x}</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">
                <span style="color:${config.color};">●</span> ${this.y.toLocaleString()} ${activityType}
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        area: {
          color: config.color,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, config.fillColor],
              [1, 'rgba(255, 255, 255, 0.0)'],
            ],
          },
          marker: {
            radius: 3,
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: config.color,
            states: {
              hover: {
                radius: 5,
              },
            },
          },
          lineWidth: 2.5,
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          name: config.title,
          data,
        },
      ],
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
  }, [totalActivity, activityType, config]);

  const hasData = totalActivity.length > 0 && totalActivity.some((item) => (item[activityType] || 0) > 0);

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
        <ShowChartIcon sx={{ color: config.color, fontSize: 24 }} />
        <Box>
          <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Total Activity – {config.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Aggregated repository development activity over the past year (up to 52 weeks)
          </Typography>
        </Box>
      </Box>

      {totalActivity.length === 0 ? (
        <Box py={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No weekly activity data found for this repository.
          </Typography>
        </Box>
      ) : !hasData ? (
        <Box py={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No {activityType} recorded in the available weekly activity period.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', minHeight: 320 }}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      )}
    </Paper>
  );
}
