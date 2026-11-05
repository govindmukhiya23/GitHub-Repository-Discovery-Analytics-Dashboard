import { formatWeekDate } from './dateUtils';
import { CONTRIBUTOR_COLORS } from './formatUtils';

/**
 * Normalizes commit_activity and code_frequency into a unified chronological array:
 * [{ timestamp, dateLabel, commits, additions, deletions }]
 */
export function normalizeTotalActivity(commitData = [], codeFreqData = []) {
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
  if (Array.isArray(codeFreqData)) {
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
        // Deletions are returned as negative integers from GitHub API
        existing.deletions = Math.abs(deletions || 0);

        weekMap.set(ts, existing);
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
 * Returns: {
 *   contributors: [{ login, avatarUrl, totalCommits, color }],
 *   timeline: [unixTimestamps...],
 *   contributorSeries: [{ login, avatarUrl, color, data: [{ timestamp, commits, additions, deletions }] }]
 * }
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

    // Create a map of the contributor's weeks for O(1) lookups
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

    // Align against the master timeline, filling missing weeks with 0
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
