import { getStartDateForPeriod } from '../utils/dateUtils';

const BASE_URL = 'https://api.github.com';
const apiCache = new Map();

function getHeaders() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

/**
 * Helper to fetch with 202 retry logic for stats endpoints and rate-limit handling.
 */
async function fetchWithRetry(url, maxRetries = 3, retryDelayMs = 2000) {
  // Check cache first
  if (apiCache.has(url)) {
    return apiCache.get(url);
  }

  let attempts = 0;
  while (attempts <= maxRetries) {
    const response = await fetch(url, { headers: getHeaders() });

    // Handle GitHub rate limit
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      let resetMsg = '';
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime, 10) * 1000);
        resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}.`;
      }
      throw new Error(`GitHub API rate limit exceeded.${resetMsg} Please wait a moment or configure a personal access token in .env.`);
    }

    if (response.status === 404) {
      throw new Error('Repository or statistics not found on GitHub.');
    }

    // GitHub returns 202 Accepted while compiling repository statistics in the background
    if (response.status === 202) {
      attempts++;
      if (attempts > maxRetries) {
        // Return empty array or throw informative error
        return [];
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      continue;
    }

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    apiCache.set(url, data);
    return data;
  }

  return [];
}

/**
 * Searches repositories created within last N days, sorted by stars descending.
 */
export async function searchRepositories({ periodDays = 30, page = 1, perPage = 30 }) {
  const startDate = getStartDateForPeriod(periodDays);
  const cacheKey = `search_${startDate}_p${page}_pp${perPage}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const query = encodeURIComponent(`created:>${startDate}`);
  const url = `${BASE_URL}/search/repositories?q=${query}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;

  const response = await fetch(url, { headers: getHeaders() });

  if (response.status === 403 || response.status === 429) {
    const resetTime = response.headers.get('x-ratelimit-reset');
    let resetMsg = '';
    if (resetTime) {
      const resetDate = new Date(parseInt(resetTime, 10) * 1000);
      resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}.`;
    }
    throw new Error(`GitHub API rate limit reached.${resetMsg} Please wait or add VITE_GITHUB_TOKEN to .env.`);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch repositories (${response.status})`);
  }

  const data = await response.json();
  const result = {
    items: data.items || [],
    total_count: data.total_count || 0,
    incomplete_results: data.incomplete_results || false,
  };

  apiCache.set(cacheKey, result);
  return result;
}

/**
 * Fetches basic repository metadata (used for direct visits or refresh on details page)
 */
export async function fetchRepositoryDetails(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}`;
  return fetchWithRetry(url, 1, 1000);
}

/**
 * Fetches weekly commit activity for the past year.
 * Returns array of { week: unixTimestamp, total: number, days: number[] }
 */
export async function fetchCommitActivity(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`;
  const data = await fetchWithRetry(url, 3, 2000);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches weekly code frequency (additions and deletions).
 * Returns array of [timestamp, additions, deletions]
 */
export async function fetchCodeFrequency(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/code_frequency`;
  const data = await fetchWithRetry(url, 3, 2000);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches contributor activity list.
 * Returns array of { author: { login, avatar_url }, total, weeks: [{ w, a, d, c }] }
 */
export async function fetchContributors(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
  const data = await fetchWithRetry(url, 3, 2000);
  return Array.isArray(data) ? data : [];
}
