import React, {useState, useContext} from 'react';
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
import api from '../../services/api';
import Card from '../../components/Card';
import MyContext from '../../store/context';

const {height, width} = Dimensions.get('screen');
const expandedHeaderHeight = (height / 100) * 15;
const cardSize = Math.round((width / 100) * 40);

export default ({navigation}) => {
  const context = useContext(MyContext);
  const [dataBase, setDataBase] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const pokemonList = await api.list();
      context.setDatabase(pokemonList);
      setDataBase(pokemonList);
    };
    fetchData();
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
      <Card {...{item, cardSize, navigation, index}}></Card>
    </View>
  );

  const pokeListProps: FlatListProperties<Pokemon> = {
    data: dataBase,
    renderItem: renderPokemonItem,
    numColumns: 2,
    keyExtractor: item => item.id,
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
