import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, Text, TextStyle, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {PokemonDetail} from '../model/Pokemon';
import About from '../pages/detail/about';
import Evolution from '../pages/detail/evolution';
import Status from '../pages/detail/status';
import globalStyles, {colorForType, colors} from '../styles/index';

const initialLayout = {width: Dimensions.get('window').width};

export interface IDetailTabs {
  item: PokemonDetail;
  loading?: boolean;
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
          indicatorStyle={{backgroundColor: colorForType(item.type[0])}}
          style={styles.tabBar}
        />
      );
    },
    [item.id],
  );

  // react-native-tab-view v4 removed TabBar's `renderLabel`; labels are now
  // provided via commonOptions/options. Without this the default white-ish
  // label renders invisibly on the white tab bar.
  const commonOptions = React.useMemo(
    () => ({
      label: ({route, focused}: {route: {title: string}; focused: boolean}) => (
        <Text style={getLabelStyle(focused)}>{route.title}</Text>
      ),
    }),
    [getLabelStyle],
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
      commonOptions={commonOptions}
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
