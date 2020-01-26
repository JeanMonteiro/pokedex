/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {useScreens} from 'react-native-screens';
import 'react-native-gesture-handler';

useScreens();

import Navigation from './src/navigation';
import MyContext from './src/store/context';
import Pokemon from './src/model/pokemon';

const state = {
  dataBase: [],
  item: null,
  index: null,
  setDatabase: (itens: Pokemon[]) => {
    state.dataBase.push(...itens);
  },
  setItem: pokemon => {
    state.item = pokemon;
  },
  setIndex: index => {
    state.index = index;
  },
};

const App = () => {
  return (
    <MyContext.Provider value={state}>
      <Navigation />
    </MyContext.Provider>
  );
};

export default App;
