import React, {useMemo, useRef} from 'react';
import {
  Animated,
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import Image from '../components/Image';
import Pokemon from '../model/Pokemon';
import {colors} from '../styles';
import {useHero} from '../transition/HeroContext';

const POKEBALL_IMAGE = require('../assets/pokeball.png');

export interface ICard {
  item: Pokemon;
  cardSize: number;
  index: number;
  onPress: (item: Pokemon, index: number) => void;
}

const Card: React.FC<ICard> = ({item, cardSize, index, onPress}) => {
  const hero = useHero();
  const avatarRef = useRef<RNImage>(null);

  const imgUrl = useMemo(
    () =>
      `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${item.num}.png`,
    [item],
  );

  const onCardPress = () => {
    const node = avatarRef.current;
    // Measure the avatar in window coords so the overlay can fly from here.
    // Always navigate, even if measuring is unavailable, so the tap never stalls.
    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((x, y, width, height) => {
        if (width && height) {
          hero.begin(imgUrl, {x, y, width, height});
        }
        onPress(item, index);
      });
    } else {
      onPress(item, index);
    }
  };

  return (
    <View>
      <Animated.View
        style={{
          width: cardSize,
          height: cardSize,
        }}>
        <TouchableOpacity
          style={{...styles.touch, backgroundColor: colors[item.type[0]]}}
          onPress={onCardPress}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Image
            source={POKEBALL_IMAGE}
            style={styles.pokeballImageContainer}
          />
          <Reanimated.Image
            ref={avatarRef}
            source={{
              uri: imgUrl,
            }}
            style={{
              height: cardSize - Math.round((cardSize / 100) * 20),
              width: cardSize - Math.round((cardSize / 100) * 20),
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Card;

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
  cardTitle: {fontWeight: 'bold', color: '#fff'},
  pokeballImageContainer: {
    width: '70%',
    height: '70%',
    position: 'absolute',
    zIndex: -1,
    opacity: 0.2,
  },
});
