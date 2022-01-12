import React, {useMemo} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Image from '../components/Image';
import {colors} from '../styles';

const POKEBALL_IMAGE = require('../assets/pokeball.png');

export default function Card({item, cardSize, index, onPress}) {
  const imgUrl = useMemo(
    () =>
      `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${item.num}.png`,
    [item],
  );

  const onCardPress = () => onPress(item, index);

  return (
    <View>
      <Animated.View
        style={{
          opacity: item.size.interpolate({
            inputRange: [0, cardSize],
            outputRange: [0, 1],
          }),
          width: item.size,
          height: item.size,
        }}>
        <TouchableOpacity
          style={{...styles.touch, backgroundColor: colors[item.type[0]]}}
          onPress={onCardPress}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Image
            source={POKEBALL_IMAGE}
            style={styles.pokeballImageContainer}
          />
          <SharedElement id={`item.${item.id}.photo`}>
            <Animated.Image
              source={{
                uri: imgUrl,
              }}
              style={{
                height: cardSize - Math.round((cardSize / 100) * 20),
                width: cardSize - Math.round((cardSize / 100) * 20),
                opacity: item.size.interpolate({
                  inputRange: [0, cardSize],
                  outputRange: [
                    0,
                    cardSize - Math.round((cardSize / 100) * 20),
                  ],
                }),
              }}
            />
          </SharedElement>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

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
