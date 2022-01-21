import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, Text, TextStyle, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import Pokemon from '../model/Pokemon';
import About from '../pages/Detail/About';
import Evolution from '../pages/Detail/Evolution';
import Status from '../pages/Detail/Status';
import globalStyles, {colors} from '../styles/index';

const initialLayout = {width: Dimensions.get('window').width};

export interface IDetailTabs {
  item: Pokemon;
}

const DetailTabs: React.FC<IDetailTabs> = ({item}) => {
  const [index, setIndex] = React.useState(0);

  const getLabelStyle = useCallback(
    (focused: boolean): TextStyle =>
      focused
        ? {
            color: colors.default.activeText,
            fontWeight: 'bold',
            fontSize: 12,
            ...globalStyles.monospaceFont,
          }
        : {
            color: colors.default.foregroundText,
            fontWeight: 'normal',
            fontSize: 12,
            ...globalStyles.monospaceFont,
          },
    [item.id],
  );

  const renderTabBar = useCallback(
    () => props => {
      return (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: colors[item.type[0]]}}
          style={styles.tabBar}
          renderLabel={({route, focused}) => (
            <Text style={getLabelStyle(focused)}>{route.title}</Text>
          )}
        />
      );
    },
    [item.id],
  );

  const [routes] = React.useState([
    {key: '1', title: 'Sobre'},
    {key: '2', title: 'Evolução'},
    {key: '3', title: 'Status'},
  ]);

  const renderScene =
    () =>
    ({route}) => {
      let scene;
      switch (route.key) {
        case '1':
          scene = <About item={item} />;
          break;
        case '2':
          scene = <Evolution item={item} />;
          break;
        case '3':
          scene = <Status item={item} />;
          break;
        default:
          scene = null;
      }
      return <View style={styles.sceneContainer}>{scene}</View>;
    };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene()}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar()}
      swipeEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  sceneContainer: {
    padding: '5%',
  },
});

export default DetailTabs;
