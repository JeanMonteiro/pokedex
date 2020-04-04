import { all } from 'redux-saga/effects'
import pokemon from './pokemon';

const sagas = [...pokemon]

export default function* rootSaga() {
  yield all(sagas)
}
