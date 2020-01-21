import React, {useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  FlatList,
  FlatListProperties,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Header from './header';
import Pokemon from '../../model/pokemon';
import api from '../../services/api';
import Card from '../../components/Card';

const {height, width} = Dimensions.get('screen');

const contractHeaderHeight = (height / 100) * 10;

const expandedHeaderHeight = (height / 100) * 15;

const cardSize = Math.round((width / 100) * 40);

const pageSize = 12;

export default ({navigation}) => {
  const [dataBase, setDataBase] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  let onEndReachedCalledDuringMomentum = true;

  React.useEffect(() => {
    const fetchData = async () => {
      setDataBase(await api.list());
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (dataBase.length > 0) {
      setPokemons(dataBase.splice(0, pageSize));
    }
  }, [dataBase]);

  React.useEffect(() => {
    if (pokemons.length > 0) {
      let timeCount = 0;

      const start = page == 1 ? 0 : (page - 1) * pageSize;
      const end = page == 1 ? pageSize - 1 : page * pageSize - 1;

      for (let i = start; i <= end; i++) {
        const element = pokemons[i];
        setTimeout(() => {
          Animated.spring(element.size, {
            toValue: cardSize,
            tension: 1,
          }).start();
        }, timeCount * 150);
        timeCount++;
      }
    }
  }, [pokemons]);

  const renderPokemonItem = ({item, index}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: '10%',
      }}>
      <Card item={item} cardSize={cardSize} navigation={navigation}></Card>
    </View>
  );

  const handleLoadMore = () => {
    if (pokemons.length > 0 && !onEndReachedCalledDuringMomentum) {
      setPage(page + 1);
      onEndReachedCalledDuringMomentum = true;
      setPokemons([...pokemons, ...dataBase.splice(0, pageSize)]);
    }
  };

  const pokeListProps: FlatListProperties<Pokemon> = {
    data: pokemons,
    renderItem: renderPokemonItem,
    numColumns: 2,
    keyExtractor: item => item.id,
    onEndReached: handleLoadMore,
    onEndReachedThreshold: 0.01,
    onMomentumScrollBegin: () => {
      onEndReachedCalledDuringMomentum = false;
    },
    style: {
      paddingBottom: '25%',
    },
  };

  const renderPokeList = () => <FlatList {...pokeListProps}></FlatList>;

  return (
    <SafeAreaView>
      <Header height={expandedHeaderHeight} />
      {renderPokeList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  touch: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
