import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import About from '../pages/detail/about';
import Status from '../pages/detail/status';
import {createAppContainer} from 'react-navigation';

const routeConfig = {
  about: {
    screen: About,
    navigationOptions: () => ({
      tabBarLabel: 'about',
    }),
  },
  status: {
    screen: Status,
    navigationOptions: () => ({
      tabBarLabel: 'status',
    }),
  },
};

export default createAppContainer(
  createMaterialTopTabNavigator(routeConfig, {
    initialRouteName: 'about',
    swipeEnabled: true,
  }),
);
