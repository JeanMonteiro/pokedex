import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Card from '../../components/Card';
import Pokemon from '../../model/pokemon';
import api from '../../services/api';
import MyContext from '../../store/context';
import Header from './header';

const {width} = Dimensions.get('screen');

const cardSize = Math.round((width / 100) * 40);

export default () => {
  const {setIndex} = useContext(MyContext);

  const [pokemonList, setPokemonList] = useState<Pokemon[] | null>(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchData = async () => {
      setPokemonList(await api.list());
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (pokemonList) {
      for (let i = 0; i < pokemonList.length; i++) {
        const element = pokemonList[i];
        setTimeout(() => {
          Animated.spring(element.size, {
            toValue: cardSize,
            tension: 1,
            useNativeDriver: false,
          }).start();
        }, i * 200);
      }
    }
  }, [pokemonList]);

  const onPressPokemon = useCallback(
    (item, index) => {
      setIndex(index);
      navigation.navigate('Detail', {index, item, pokemonList});
    },
    [navigation, setIndex, pokemonList],
  );

  const renderPokemonItem = ({item, index}) => (
    <View style={styles.itemCardContainer}>
      <Card
        cardSize={cardSize}
        item={item}
        index={index}
        onPress={onPressPokemon}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <Header />
      <FlatList
        data={pokemonList}
        renderItem={renderPokemonItem}
        numColumns={2}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.01}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemCardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
  },
  list: {
    paddingBottom: '25%',
  },
});
