import {createStore, applyMiddleware, compose, Store} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {rootReducer} from './ducks';
import rootSaga from './sagas';
import reduxLogger from 'redux-logger';
import {State as pokemonState} from './ducks/pokemon'

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, reduxLogger];

const composer = compose(applyMiddleware(...middlewares));

export interface ApplicationStore {
  pokemon: pokemonState
}

const store: Store<ApplicationStore> = createStore(rootReducer, composer);

sagaMiddleware.run(rootSaga);

export default store;
