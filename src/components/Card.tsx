import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
  Image,
} from 'react-native';
import {colors} from '../styles';
import {SharedElement} from 'react-navigation-shared-element';

export default function Card({item, cardSize, navigation}) {
  return (
    <View
      style={{
        width: cardSize,
        height: cardSize,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
          onPress={() => navigation.navigate('Detail', {item})}>
          <Text style={{fontWeight: 'bold', color: '#fff'}}>{item.name}</Text>
          <Animated.Image
            source={require('../assets/pokeball.png')}
            style={{
              width: Math.round(cardSize - (cardSize / 100) * 20),
              height: Math.round(cardSize - (cardSize / 100) * 20),
              position: 'absolute',
              zIndex: -1,
              opacity: 0.2,
            }}
          />
          <SharedElement id={item.id}>
            <Animated.Image
              source={{
                uri: item.img,
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
});
