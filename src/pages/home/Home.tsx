import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import Card from '../../components/Card';
import {PokemonSummary} from '../../model/Pokemon';
import api from '../../services/api';
import {usePokemonStore} from '../../store/context';
import Header from './header';

const {width} = Dimensions.get('screen');

const cardSize = Math.round((width / 100) * 40);

export default () => {
  const {setDatabase} = usePokemonStore();

  const [pokemonList, setPokemonList] = useState<PokemonSummary[] | null>(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchData = async () => {
      const list = await api.list();
      setPokemonList(list);
      setDatabase(list);
    };
    fetchData();
  }, []);

  const onPressPokemon = useCallback(
    (item: PokemonSummary, index: number) => {
      navigation.navigate('Detail', {index, item, pokemonList});
    },
    [navigation, pokemonList],
  );

  const renderPokemonItem = ({
    item,
    index,
  }: {
    item: PokemonSummary;
    index: number;
  }) => (
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
    <>
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
    </>
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
