import React from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Navigation from './src/navigation';
import MyContext from './src/store/context';
import {PokemonSummary} from './src/model/Pokemon';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {HeroProvider} from './src/transition/HeroContext';

const state = {
  dataBase: [],
  item: null,
  index: null,
  setDatabase: (itens: PokemonSummary[]) => {
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
    <GestureHandlerRootView style={{flex: 1}}>
      <MyContext.Provider value={state}>
        <SafeAreaProvider>
          <HeroProvider>
            <View style={{flex: 1}}>
              <Navigation />
            </View>
          </HeroProvider>
        </SafeAreaProvider>
      </MyContext.Provider>
    </GestureHandlerRootView>
  );
};

export default App;
