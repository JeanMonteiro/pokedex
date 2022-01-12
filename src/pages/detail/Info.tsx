import React from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {FINAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION} from './Detail';

const {height} = Dimensions.get('screen');

export interface InfoProps {
  painelHeight: any;
  pokemonNum: string;
  pokemonName: string;
  types: string[];
}

const Info: React.FC<InfoProps> = ({
  painelHeight,
  pokemonNum,
  pokemonName,
  types,
}) => {
  const renderTypes = () =>
    types.map(type => (
      <View key={type} style={styles.typeContainer}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
    ));

  const transform = [
    {
      translateY: painelHeight.interpolate({
        inputRange: [
          Math.round(FINAL_DETAIL_POSITION),
          20,
          Math.round(INITIAL_DETAIL_POSITION),
        ],
        outputRange: [0, Math.round(height / 15), Math.round(height / 15)],
      }),
    },
  ];

  const opacity = painelHeight.interpolate({
    inputRange: [
      Math.round(FINAL_DETAIL_POSITION),
      Math.round(INITIAL_DETAIL_POSITION / 2),
      Math.round(INITIAL_DETAIL_POSITION),
    ],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        style={{
          ...styles.container,
          // transform,
          opacity,
        }}>
        <Animated.Text
          style={{
            ...styles.nameTitle,
            fontSize: Math.round(height / 22),
          }}>
          {pokemonName}
        </Animated.Text>

        <Animated.Text
          style={{
            ...styles.num,
          }}>{`#${pokemonNum}`}</Animated.Text>
      </Animated.View>

      <Animated.View
        style={{
          ...styles.typesContainer,
          transform,
          opacity,
        }}>
        {renderTypes()}
      </Animated.View>
    </>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '5%',
    borderWidth: 1,
  },
  num: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  nameTitle: {
    color: 'white',
    fontWeight: 'bold',
    overflow: 'visible',
  },
  typeContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
});
