import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Detail from '../pages/Detail';
import Home from '../pages/home';

const Stack = createSharedElementStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        mode="modal"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Detail"
          component={Detail}
          sharedElements={(route, _, showing) => {
            const {item} = route.params;
            return showing
              ? [
                  {
                    id: `item.${item.id}.photo`,
                    animation: 'fade',
                  },
                ]
              : undefined;
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
