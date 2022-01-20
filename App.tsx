import React from 'react';
import 'react-native-gesture-handler';
import {View} from 'react-native';

import Navigation from './src/navigation';
import MyContext from './src/store/context';
import Pokemon from './src/model/pokemon';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

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

const App: React.FC = () => {
  return (
    <MyContext.Provider value={state}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </MyContext.Provider>
  );
};

export default App;
