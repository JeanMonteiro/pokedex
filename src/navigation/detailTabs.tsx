import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import About from '../pages/detail/about';
import Status from '../pages/detail/status';
import Evolution from '../pages/detail/evolution';
import {createAppContainer, CreateNavigatorConfig} from 'react-navigation';
import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {TabBar} from 'react-native-tab-view';

import {TabView, SceneMap} from 'react-native-tab-view';
import {Dimensions} from 'react-native';
import {colors} from '../styles/index';

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: 'red'}}
    style={{backgroundColor: 'white'}}
    renderLabel={({route, focused}) => (
      <Text
        style={{
          color: focused
            ? colors.default.activeText
            : colors.default.foregroundText,
          fontWeight: focused ? 'bold' : 'normal',
          fontSize: 12,
        }}>
        {route.title}
      </Text>
    )}
  />
);

const initialLayout = {width: Dimensions.get('window').width};

const FirstRoute = () => {
  return (
    <View style={[styles.scene, {backgroundColor: '#fff'}]}>
      <About></About>
    </View>
  );
};

const SecondRoute = () => {
  return (
    <View style={[styles.scene, {backgroundColor: '#fff'}]}>
      <Evolution></Evolution>
    </View>
  );
};

const Terceiro = () => {
  return (
    <View style={[styles.scene, {backgroundColor: '#fff'}]}>
      <Status></Status>
    </View>
  );
};

export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Sobre'},
    {key: 'second', title: 'Evolução'},
    {key: 'tres', title: 'Status'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    tres: Terceiro,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

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

// export default createAppContainer(
//   createMaterialTopTabNavigator(routeConfig, {
//     initialRouteName: 'about',
//     swipeEnabled: true,
//   })
// );

// export default createMaterialTopTabNavigator(routeConfig, {
//   initialRouteName: 'about',
//   swipeEnabled: true,
// });
