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
