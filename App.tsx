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
import {Provider} from 'react-redux';
import store from './src/store/index';
import NavigationService from './src/services/NavigationService';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Navigation
          ref={navigatorRef =>
            NavigationService.setTopLevelNavigator(navigatorRef)
          }
        />
      </Provider>
    </>
  );
};

export default App;
