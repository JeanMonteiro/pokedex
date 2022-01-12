import React from 'react';
import {View} from 'react-native';
// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
// import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
// import {springyFadeIn} from '../transition/springyFadeIn';

import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();

import Home from '../pages/home';
import Detail from '../pages/Detail';

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        mode="modal"
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          // transitionSpec: {
          //   open: {animation: 'timing', config: {duration: 300}},
          //   close: {animation: 'timing', config: {duration: 300}},
          // },
          // cardStyleInterpolator: ({current: {progress}}) => {
          //   return {
          //     cardStyle: {
          //       opacity: progress,
          //     },
          //   };
          // },
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Detail"
          component={Detail}
          sharedElements={route => {
            const {item} = route.params;
            return [
              {
                id: `item.${item.id}.photo`,
                animation: 'fade',
              },
            ];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const stackNavigator = createSharedElementStackNavigator(
//   createStackNavigator,
//   {
//     Home: {
//       screen: Home,
//       navigationOptions: () => ({
//         header: null,
//       }),
//     },
//     Detail: {
//       screen: Detail,
//       navigationOptions: () => ({
//         header: null,
//       }),
//     },
//   },
//   {
//     transitionConfig: () => springyFadeIn(),
//     header: null,
//   },
// );

export default Router;
