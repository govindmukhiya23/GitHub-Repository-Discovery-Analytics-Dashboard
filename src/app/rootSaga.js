import { all } from 'redux-saga/effects';
import repositorySaga from '../features/repositories/repositorySaga';
import analyticsSaga from '../features/analytics/analyticsSaga';

export default function* rootSaga() {
  yield all([
    repositorySaga(),
    analyticsSaga(),
  ]);
}

