import About from '../pages/Detail/About';
import Status from '../pages/Detail/Status';
import Evolution from '../pages/Detail/Evolution';
import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {TabBar, TabView} from 'react-native-tab-view';
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

export default function DetailTabs({item}) {
  const [index, setIndex] = React.useState(0);
  console.log('item', item);

  const [routes] = React.useState([
    {key: 'first', title: 'Sobre'},
    {key: 'second', title: 'Evolução'},
    {key: 'third', title: 'Status'},
  ]);

  const renderScene =
    item1 =>
    ({route}) => {
      switch (route.key) {
        case 'first':
          return <About item={item1} />;
        case 'second':
          return <Evolution item={item1} />;
        case 'third':
          return <Status item={item1} />;
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

const styles = StyleSheet.create({});
