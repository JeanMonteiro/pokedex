import About from '../pages/Detail/about';
import Status from '../pages/Detail/status';
import Evolution from '../pages/Detail/evolution';
import {Text} from 'react-native';
import React from 'react';
import {TabBar} from 'react-native-tab-view';

import {TabView} from 'react-native-tab-view';
import {Dimensions} from 'react-native';
import globalStyles, {colors} from '../styles/index';

const renderTabBar = item => props =>
  (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors[item.type[0]]}}
      style={{backgroundColor: 'white'}}
      renderLabel={({route, focused}) => (
        <Text
          style={{
            color: focused
              ? colors.default.activeText
              : colors.default.foregroundText,
            fontWeight: focused ? 'bold' : 'normal',
            fontSize: 12,
            ...globalStyles.monospaceFont,
          }}>
          {route.title}
        </Text>
      )}
    />
  );

const initialLayout = {width: Dimensions.get('window').width};

export default function TabViewExample({item}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Sobre'},
    {key: 'second', title: 'Evolução'},
    {key: 'third', title: 'Status'},
  ]);

  const renderScene =
    item =>
    ({route}) => {
      switch (route.key) {
        case 'first':
          return <About item={item} />;
        case 'second':
          return <Evolution item={item} />;
        case 'third':
          return <Status item={item} />;
        default:
          return null;
      }
    };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene(item)}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar(item)}
      swipeEnabled={true}
    />
  );
}
