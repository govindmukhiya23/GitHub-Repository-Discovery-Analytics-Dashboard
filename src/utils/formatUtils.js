/**
 * Truncates text with an ellipsis if it exceeds maxLength.
 */
export function truncateText(text, maxLength = 140) {
  if (!text) return 'No description provided';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Returns a highcharts-compatible color palette for contributors
 */
export const CONTRIBUTOR_COLORS = [
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#E11D48', // Rose
  '#0EA5E9', // Sky
];

/**
 * Parses a GitHub URL or "owner/repo" string into { owner, repo }.
 * Supported formats:
 * - https://github.com/facebook/react
 * - http://github.com/facebook/react
 * - github.com/facebook/react
 * - facebook/react
 * - https://github.com/facebook/react.git
 * - https://github.com/facebook/react/tree/main
 */
export function parseGitHubUrl(input) {
  if (!input || typeof input !== 'string') return null;

  let cleaned = input.trim();

  // Remove protocol
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, '');

  // Remove git ssh prefix if any
  cleaned = cleaned.replace(/^git@github\.com:/, '');

  // Remove github.com/ prefix
  cleaned = cleaned.replace(/^github\.com\//, '');

  // Remove leading or trailing slashes
  cleaned = cleaned.replace(/^\/+|\/+$/g, '');

  const parts = cleaned.split('/').filter(Boolean);

  if (parts.length >= 2) {
    const owner = parts[0].trim();
    const repo = parts[1].replace(/\.git$/, '').trim();

    // Basic validity check: owner and repo should not contain invalid characters
    if (/^[a-zA-Z0-9_\-\.]+$/.test(owner) && /^[a-zA-Z0-9_\-\.]+$/.test(repo)) {
      return { owner, repo };
    }
  }

  return null;
}
