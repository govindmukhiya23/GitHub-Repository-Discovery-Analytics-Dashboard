import { getStartDateForPeriod } from '../utils/dateUtils';

const BASE_URL = 'https://api.github.com';
const apiCache = new Map();

export function getStoredToken() {
  return localStorage.getItem('github_token') || import.meta.env.VITE_GITHUB_TOKEN || '';
}

export function setStoredToken(token) {
  if (token && token.trim()) {
    localStorage.setItem('github_token', token.trim());
  } else {
    localStorage.removeItem('github_token');
  }
  // Clear cache so new authenticated calls take effect immediately
  apiCache.clear();
}

function getHeaders() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = getStoredToken();
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

/**
 * Helper to fetch with gentle 202 retry logic and rate-limit handling.
 */
async function fetchWithRetry(url, maxRetries = 1, retryDelayMs = 1200) {
  // Check cache first
  if (apiCache.has(url)) {
    return apiCache.get(url);
  }

  let attempts = 0;
  while (attempts <= maxRetries) {
    let response;
    try {
      response = await fetch(url, { headers: getHeaders() });
    } catch (netErr) {
      throw new Error(`Network error connecting to GitHub: ${netErr.message}`);
    }

    // Handle GitHub rate limit
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      let resetMsg = '';
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime, 10) * 1000);
        resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}.`;
      }
      const err = new Error(`GitHub API rate limit exceeded.${resetMsg} Please enter a personal access token or wait for reset.`);
      err.isRateLimit = true;
      throw err;
    }

    if (response.status === 404) {
      return [];
    }

    // GitHub returns 202 Accepted while compiling repository statistics in the background
    if (response.status === 202) {
      attempts++;
      if (attempts > maxRetries) {
        // Return empty array instead of failing, allowing partial data or fallback
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      continue;
    }

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `GitHub API error: ${response.status}`);
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

  let response;
  try {
    response = await fetch(url, { headers: getHeaders() });
  } catch (netErr) {
    throw new Error(`Network error connecting to GitHub: ${netErr.message}`);
  }

  if (response.status === 403 || response.status === 429) {
    const resetTime = response.headers.get('x-ratelimit-reset');
    let resetMsg = '';
    if (resetTime) {
      const resetDate = new Date(parseInt(resetTime, 10) * 1000);
      resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}.`;
    }
    const err = new Error(`GitHub API rate limit reached.${resetMsg} Please enter a personal access token or wait for reset.`);
    err.isRateLimit = true;
    throw err;
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
 * Fetches basic repository metadata
 */
export async function fetchRepositoryDetails(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}`;
  const data = await fetchWithRetry(url, 0);
  return data;
}

/**
 * Fetches weekly commit activity for the past year.
 */
export async function fetchCommitActivity(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`;
  const data = await fetchWithRetry(url, 1, 1000);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches weekly code frequency (additions and deletions).
 */
export async function fetchCodeFrequency(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/code_frequency`;
  const data = await fetchWithRetry(url, 1, 1000);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches contributor activity list.
 */
export async function fetchContributors(owner, repo) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
  const data = await fetchWithRetry(url, 1, 1000);
  return Array.isArray(data) ? data : [];
}
