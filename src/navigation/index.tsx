import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {springyFadeIn} from '../transition/springyFadeIn';

import Home from '../pages/home';
import {Detail} from '../pages/detail';

const stackNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    Home: {
      screen: Home,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Detail: {
      screen: Detail,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    transitionConfig: () => springyFadeIn(),
    header: null,
  },
);

export default createAppContainer(stackNavigator); //ts-ignore-line
