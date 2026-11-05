import { all, call, put, takeLatest } from 'redux-saga/effects';
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
      repository = yield call(fetchRepositoryDetails, owner, repo);
    }

    // Fetch commit activity, code frequency, and contributors in parallel
    const [commitData, codeFreqData, contributorsData] = yield all([
      call(fetchCommitActivity, owner, repo),
      call(fetchCodeFrequency, owner, repo),
      call(fetchContributors, owner, repo),
    ]);

    const totalActivity = normalizeTotalActivity(commitData, codeFreqData);
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
