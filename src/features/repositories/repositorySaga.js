import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
} from './repositorySlice';
import { searchRepositories } from '../../services/githubApi';

function* handleFetchRepositories(action) {
  try {
    const { period, page } = action.payload;
    const perPage = 30;

    const data = yield call(searchRepositories, {
      periodDays: period,
      page,
      perPage,
    });

    const items = data.items || [];
    const totalCount = data.total_count || 0;
    
    // GitHub API hard limit is 1000 items for search results
    const maxAccessible = Math.min(totalCount, 1000);
    const hasMore = items.length === perPage && page * perPage < maxAccessible;

    yield put(
      fetchRepositoriesSuccess({
        items,
        totalCount,
        page,
        hasMore,
      })
    );
  } catch (error) {
    yield put(fetchRepositoriesFailure(error.message || 'An error occurred while fetching repositories.'));
  }
}

export default function* repositorySaga() {
  yield takeLatest(fetchRepositoriesRequest.type, handleFetchRepositories);
}
