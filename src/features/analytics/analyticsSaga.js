import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchAnalyticsRequest,
  fetchAnalyticsSuccess,
  fetchAnalyticsFailure,
} from './analyticsSlice';
import {
  fetchRepositoryDetails,
  fetchCommitActivity,
  fetchCodeFrequency,
  fetchContributors,
} from '../../services/githubApi';
import {
  normalizeTotalActivity,
  normalizeContributorActivity,
} from '../../utils/chartUtils';

function* handleFetchAnalytics(action) {
  try {
    const { owner, repo, repositoryData } = action.payload;

    let repository = repositoryData;
    if (!repository) {
      try {
        repository = yield call(fetchRepositoryDetails, owner, repo);
      } catch (err) {
        if (err.isRateLimit) {
          throw err;
        }
      }
    }

    // Safely query stats endpoints without letting one failure break everything
    let commitData = [];
    let codeFreqData = [];
    let contributorsData = [];
    let rateLimitErr = null;

    try {
      commitData = yield call(fetchCommitActivity, owner, repo);
    } catch (err) {
      if (err.isRateLimit) rateLimitErr = err;
    }

    try {
      codeFreqData = yield call(fetchCodeFrequency, owner, repo);
    } catch (err) {
      if (err.isRateLimit) rateLimitErr = err;
    }

    try {
      contributorsData = yield call(fetchContributors, owner, repo);
    } catch (err) {
      if (err.isRateLimit) rateLimitErr = err;
    }

    // If rate limited and no data could be obtained at all, throw the rate limit error
    if (rateLimitErr && commitData.length === 0 && codeFreqData.length === 0 && contributorsData.length === 0) {
      throw rateLimitErr;
    }

    const totalActivity = normalizeTotalActivity(commitData, codeFreqData, contributorsData);
    const { contributors, contributorSeries } = normalizeContributorActivity(
      contributorsData,
      totalActivity
    );

    yield put(
      fetchAnalyticsSuccess({
        repository,
        totalActivity,
        contributorActivity: contributorSeries,
        contributors,
      })
    );
  } catch (error) {
    yield put(
      fetchAnalyticsFailure(
        error.message || 'Failed to fetch repository development activity.'
      )
    );
  }
}

export default function* analyticsSaga() {
  yield takeLatest(fetchAnalyticsRequest.type, handleFetchAnalytics);
}
