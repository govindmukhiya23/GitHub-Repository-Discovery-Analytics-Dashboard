import { formatWeekDate } from './dateUtils';
import { CONTRIBUTOR_COLORS } from './formatUtils';

/**
 * Normalizes commit_activity and code_frequency into a unified chronological array:
 * [{ timestamp, dateLabel, commits, additions, deletions }]
 *
 * If codeFreqData is empty (common for newly created repos or during 202 processing),
 * it aggregates additions/deletions directly from contributorsRaw!
 */
export function normalizeTotalActivity(commitData = [], codeFreqData = [], contributorsRaw = []) {
  const weekMap = new Map();

  // Process commit_activity: [{ week, total, days }]
  if (Array.isArray(commitData)) {
    commitData.forEach((item) => {
      if (item && item.week) {
        weekMap.set(item.week, {
          timestamp: item.week,
          dateLabel: formatWeekDate(item.week),
          commits: item.total || 0,
          additions: 0,
          deletions: 0,
        });
      }
    });
  }

  // Process code_frequency: [[timestamp, additions, deletions], ...]
  let hasCodeFreq = false;
  if (Array.isArray(codeFreqData) && codeFreqData.length > 0) {
    codeFreqData.forEach((entry) => {
      if (Array.isArray(entry) && entry.length >= 3) {
        const [ts, additions, deletions] = entry;
        const existing = weekMap.get(ts) || {
          timestamp: ts,
          dateLabel: formatWeekDate(ts),
          commits: 0,
          additions: 0,
          deletions: 0,
        };

        existing.additions = Math.max(0, additions || 0);
        existing.deletions = Math.abs(deletions || 0);

        weekMap.set(ts, existing);
        hasCodeFreq = true;
      }
    });
  }

  // Fallback: If code_frequency wasn't ready yet from GitHub, sum from contributors!
  if (!hasCodeFreq && Array.isArray(contributorsRaw) && contributorsRaw.length > 0) {
    contributorsRaw.forEach((c) => {
      if (Array.isArray(c.weeks)) {
        c.weeks.forEach((w) => {
          if (w && w.w) {
            const existing = weekMap.get(w.w) || {
              timestamp: w.w,
              dateLabel: formatWeekDate(w.w),
              commits: 0,
              additions: 0,
              deletions: 0,
            };
            existing.commits = Math.max(existing.commits, (existing.commits || 0) + (w.c || 0));
            existing.additions += Math.max(0, w.a || 0);
            existing.deletions += Math.abs(w.d || 0);
            weekMap.set(w.w, existing);
          }
        });
      }
    });
  }

  // Sort chronologically by timestamp
  const sorted = Array.from(weekMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  // Keep up to 52 weeks (1 year)
  return sorted.slice(-52);
}

/**
 * Normalizes contributor data into aligned weekly entries:
 */
export function normalizeContributorActivity(contributorsRaw = [], masterTimeline = []) {
  if (!Array.isArray(contributorsRaw) || contributorsRaw.length === 0) {
    return {
      contributors: [],
      contributorSeries: [],
    };
  }

  // Sort contributors by total commits descending
  const sortedContributors = [...contributorsRaw]
    .filter((c) => c && c.author && c.author.login)
    .sort((a, b) => (b.total || 0) - (a.total || 0));

  // Determine master timestamps from masterTimeline or accumulate all contributor weeks
  let timestamps = masterTimeline.map((item) => item.timestamp);
  if (timestamps.length === 0) {
    const allTs = new Set();
    sortedContributors.forEach((c) => {
      if (Array.isArray(c.weeks)) {
        c.weeks.forEach((w) => allTs.add(w.w));
      }
    });
    timestamps = Array.from(allTs).sort((a, b) => a - b).slice(-52);
  }

  const contributors = [];
  const contributorSeries = [];

  sortedContributors.forEach((contributor, index) => {
    const login = contributor.author.login;
    const avatarUrl = contributor.author.avatar_url;
    const color = CONTRIBUTOR_COLORS[index % CONTRIBUTOR_COLORS.length];

    contributors.push({
      login,
      avatarUrl,
      totalCommits: contributor.total || 0,
      color,
    });

    const weeksMap = new Map();
    if (Array.isArray(contributor.weeks)) {
      contributor.weeks.forEach((w) => {
        weeksMap.set(w.w, {
          commits: w.c || 0,
          additions: Math.max(0, w.a || 0),
          deletions: Math.abs(w.d || 0),
        });
      });
    }

    const seriesData = timestamps.map((ts) => {
      const weekData = weeksMap.get(ts) || { commits: 0, additions: 0, deletions: 0 };
      return {
        timestamp: ts,
        dateLabel: formatWeekDate(ts),
        commits: weekData.commits,
        additions: weekData.additions,
        deletions: weekData.deletions,
      };
    });

    contributorSeries.push({
      login,
      avatarUrl,
      color,
      data: seriesData,
    });
  });

  return {
    contributors,
    contributorSeries,
  };
}

/**
 * Generates high-fidelity simulated sample analytics for preview/demo mode
 * when the unauthenticated GitHub API rate limit is exceeded.
 */
export function generateSampleAnalytics(repo) {
  const repoName = repo?.name || 'repository';
  const ownerLogin = repo?.owner?.login || 'developer';
  const avatarUrl = repo?.owner?.avatar_url || '';

  const now = Math.floor(Date.now() / 1000);
  const weekSeconds = 7 * 24 * 3600;

  const numWeeks = 26; // 6 months of weekly activity
  const timeline = [];

  const devNames = [
    ownerLogin,
    'alex-coder',
    'sarah-dev',
    'chen-tech',
    'jordan-contrib',
  ];

  const contribBase = devNames.slice(0, 4).map((login, idx) => ({
    login,
    avatarUrl: idx === 0 ? avatarUrl : `https://avatars.githubusercontent.com/u/${100000 + idx}?v=4`,
    color: CONTRIBUTOR_COLORS[idx % CONTRIBUTOR_COLORS.length],
    totalCommits: 0,
    multiplier: [1.0, 0.6, 0.4, 0.25][idx],
  }));

  for (let i = numWeeks - 1; i >= 0; i--) {
    const ts = now - i * weekSeconds;
    const baseActivity = Math.floor(Math.sin((numWeeks - i) / 3) * 15) + 20 + Math.floor(Math.random() * 10);
    const commits = Math.max(2, baseActivity);
    const additions = commits * (120 + Math.floor(Math.random() * 80));
    const deletions = Math.floor(additions * (0.15 + Math.random() * 0.25));

    timeline.push({
      timestamp: ts,
      dateLabel: formatWeekDate(ts),
      commits,
      additions,
      deletions,
    });
  }

  const contributorSeries = contribBase.map((contrib) => {
    let devTotalCommits = 0;
    const seriesData = timeline.map((week) => {
      const devCommits = Math.max(0, Math.floor(week.commits * contrib.multiplier * (0.8 + Math.random() * 0.4)));
      const devAdditions = Math.floor(devCommits * (100 + Math.random() * 60));
      const devDeletions = Math.floor(devAdditions * (0.15 + Math.random() * 0.2));
      devTotalCommits += devCommits;

      return {
        timestamp: week.timestamp,
        dateLabel: week.dateLabel,
        commits: devCommits,
        additions: devAdditions,
        deletions: devDeletions,
      };
    });

    contrib.totalCommits = devTotalCommits;

    return {
      login: contrib.login,
      avatarUrl: contrib.avatarUrl,
      color: contrib.color,
      data: seriesData,
    };
  });

  return {
    totalActivity: timeline,
    contributorActivity: contributorSeries,
    contributors: contribBase.map(({ login, avatarUrl, color, totalCommits }) => ({
      login,
      avatarUrl,
      color,
      totalCommits,
    })),
  };
}
