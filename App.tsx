import React from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Navigation from './src/navigation';
import {PokemonProvider} from './src/store/context';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {HeroProvider} from './src/transition/HeroContext';
import ErrorBoundary from './src/components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ErrorBoundary>
        <PokemonProvider>
          <SafeAreaProvider>
            <HeroProvider>
              <View style={{flex: 1}}>
                <Navigation />
              </View>
            </HeroProvider>
          </SafeAreaProvider>
        </PokemonProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};

export default App;
