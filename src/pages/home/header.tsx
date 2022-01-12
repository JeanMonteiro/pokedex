import React from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

const POKEBALL_DARK = require('../../assets/pokeball_dark.png');

const {width, height} = Dimensions.get('screen');

const POKEBALL_IMAGE_SIZE = (width / 100) * 70;
const EXPANDED_HEADER_HEIGHT = (height / 100) * 15;

export default function header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <Image source={POKEBALL_DARK} style={styles.pokeballDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: (EXPANDED_HEADER_HEIGHT / 100) * 40,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  container: {height: EXPANDED_HEADER_HEIGHT, justifyContent: 'center'},
  pokeballDark: {
    height: POKEBALL_IMAGE_SIZE,
    width: POKEBALL_IMAGE_SIZE,
    position: 'absolute',
    left: width - (POKEBALL_IMAGE_SIZE / 100) * 70,
    opacity: 0.2,
  },
});
