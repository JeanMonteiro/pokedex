import React, {Props} from 'react';
import {View, Text, Image, Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

const pokeballImageSize = (width / 100) * 70;

interface headerProps {
  height: number;
}

export default function header({height}: headerProps) {
  return (
    <View style={{height, justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: (height / 100) * 40,
        }}>
        Pokedex
      </Text>
      <Image
        source={require('../../assets/pokeball_dark.png')}
        style={{
          height: pokeballImageSize,
          width: pokeballImageSize,
          position: 'absolute',
          left: width - (pokeballImageSize / 100) * 70,
          // zIndex: -1,
          opacity: 0.2,
        }}></Image>
    </View>
  );
}
