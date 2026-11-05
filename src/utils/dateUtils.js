import { subDays, format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Returns the YYYY-MM-DD date string for N days ago from now.
 * @param {number} days
 * @returns {string}
 */
export function getStartDateForPeriod(days) {
  const targetDate = subDays(new Date(), days);
  return format(targetDate, 'yyyy-MM-dd');
}

/**
 * Formats a Unix timestamp (seconds) into a readable week label (e.g., 'Oct 12, 2026')
 * @param {number} unixTimestampSeconds
 * @returns {string}
 */
export function formatWeekDate(unixTimestampSeconds) {
  if (!unixTimestampSeconds) return '';
  const date = new Date(unixTimestampSeconds * 1000);
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats an ISO date string (e.g. repo.pushed_at or repo.created_at)
 * into a relative time (e.g. '3 days ago')
 * @param {string} isoString
 * @returns {string}
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return 'recently';
  try {
    const parsed = parseISO(isoString);
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return 'recently';
  }
}

/**
 * Formats numbers into compact representations like 1.2k, 25k, etc.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

