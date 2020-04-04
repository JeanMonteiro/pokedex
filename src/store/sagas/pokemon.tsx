import {put, call, takeLeading, takeEvery} from 'redux-saga/effects';
import {
  ActionTypes,
  doneFetchFromApi,
  fetchDetails as fetchDetailsActionCreator,
  doneDetails,
} from '../ducks/pokemon';
import api from '../../services/api';
import NavigationService from '../../services/NavigationService';

function* fetchFromApi() {
  const response = yield call(api.list);
  yield put(doneFetchFromApi(response));
}

function* fetchDetails(action) {
  const response = yield call(api.getDetails, action.payload);
  yield put(doneDetails(response));
}

export function* watchFetchFromApi() {
  yield takeLeading(ActionTypes.fetchFromApi, fetchFromApi);
}

function* selectPokemon(action) {
  yield put(fetchDetailsActionCreator(action.payload.item.num));
  yield call(NavigationService.navigate, 'Detail', {
    index: action.payload.index,
  });
}

export function* watchSelectPokemon() {
  yield takeEvery(ActionTypes.selectPokemon, selectPokemon);
}

export function* watchFetchDetails() {
  yield takeEvery(ActionTypes.fetchDetails, fetchDetails);
}

function* nextWorker(action) {
  yield put(fetchDetailsActionCreator(action.payload));
}

export function* watchNext() {
  yield takeEvery(ActionTypes.nextPokemon, nextWorker);
}

function* previousWorker(action) {
  yield put(fetchDetailsActionCreator(action.payload));
}

export function* watchPrevious() {
  yield takeEvery(ActionTypes.previousPokemon, previousWorker);
}

export default [
  watchFetchFromApi(),
  watchSelectPokemon(),
  watchFetchDetails(),
  watchNext(),
  watchPrevious(),
];
