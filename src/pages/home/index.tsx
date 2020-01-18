import React, {useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  FlatListProperties,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Header from './header';
import Pokemon from '../../model/pokemon';

const {height, width} = Dimensions.get('screen');

const contractHeaderHeight = (height / 100) * 10;
const expandedHeaderHeight = (height / 100) * 12;

const cardSize = Math.round((width / 100) * 40);

export default ({navigation}) => {
  const [size] = useState(new Animated.Value(0));
  const [pokemons, setPokemons] = useState([
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
    new Pokemon('pikachu'),
  ]);

  React.useEffect(() => {
    Animated.spring(size, {
      toValue: cardSize,
      speed: 1,
      bounciness: 2,
    }).start();
  }, []);

  const renderPokemonItem = ({item, index}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: '10%',
      }}>
      <SharedElement id="text">
        <Animated.View
          style={{
            opacity: size.interpolate({
              inputRange: [0, cardSize],
              outputRange: [0, 1],
            }),
            width: size,
            height: size,
          }}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => navigation.navigate('Detail')}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      </SharedElement>
    </View>
  );

  const pokeListProps: FlatListProperties<Pokemon> = {
    data: pokemons,
    renderItem: renderPokemonItem,
    numColumns: 2,
  };

  const renderPokeList = () => <FlatList {...pokeListProps}></FlatList>;

  return (
    <SafeAreaView>
      <Header height={expandedHeaderHeight} />
      <View>{renderPokeList()}</View>
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
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
  },
});
