import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Animated,
  FlatList,
  FlatListProperties,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Header from './header';
import Pokemon from '../../model/pokemon';
import Card from '../../components/Card';
import {fetchFromApi} from '../../store/ducks/pokemon';
import {ApplicationStore} from '../../store/index';

const {height, width} = Dimensions.get('screen');
const expandedHeaderHeight = (height / 100) * 15;
const cardSize = Math.round((width / 100) * 40);

export default () => {
  const dataBase = useSelector(
    (state: ApplicationStore) => state.pokemon.database,
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchFromApi());
  }, []);

  React.useEffect(() => {
    for (let i = 0; i < dataBase.length; i++) {
      const element = dataBase[i];
      setTimeout(() => {
        Animated.spring(element.size, {
          toValue: cardSize,
          tension: 1,
        }).start();
      }, i * 200);
    }
  }, [dataBase]);

  const renderPokemonItem = ({item, index}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: '10%',
      }}>
      <Card {...{item, cardSize, index}}></Card>
    </View>
  );

  const pokeListProps: FlatListProperties<Pokemon> = {
    data: dataBase,
    renderItem: renderPokemonItem,
    numColumns: 2,
    keyExtractor: (item) => item.id,
    onEndReachedThreshold: 0.01,
    style: {
      paddingBottom: '25%',
    },
  };

  const renderPokeList = () => <FlatList {...pokeListProps}></FlatList>;

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'}></StatusBar>
      <Header height={expandedHeaderHeight} />
      {renderPokeList()}
    </SafeAreaView>
  );
};
