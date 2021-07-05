import React, {useState, useEffect} from 'react';
import {Animated, Image, View, Easing} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import calc from '../../util/calc';

const Avatar = ({
  pokemon,
  panResponder,
  height,
  width,
  cardSize,
  initialDetailPosition,
  finalDetailPosition,
  painelHeight,
  avatarX,
  position,
}) => {
  const getPosition = () => {
    if (position == -1) return {left: cardSize * -1};
    if (position == 0) return {alignSelf: 'center'};
    return {right: cardSize * -1};
  };

  const calcScale = () => {
    if (position == -1)
      return avatarX.interpolate({
        inputRange: [0, Math.round(width / 2 + cardSize / 2)],
        outputRange: [0, 1],
        easing: Easing.out(Easing.circle),
        extrapolate: 'clamp',
      });
    if (position == 1) {
      return avatarX.interpolate({
        inputRange: [Math.round((width / 2 + cardSize / 2) * -1), 0],
        outputRange: [1, 0],
        easing: Easing.circle,
        extrapolate: 'clamp',
      });
    }

    return avatarX.interpolate({
      inputRange: [
        (width / 2 + calc.percent(width, 25)) * -1,
        0,
        width / 2 + calc.percent(width, 25),
      ],
      outputRange: [0.1, 1, 0.1],
      easing: Easing.inOut(Easing.circle),
      extrapolate: 'clamp',
    });
  };

  function getTransform() {
    const transform = [];

    if (position === 0)
      transform.push({
        translateY: painelHeight.interpolate({
          inputRange: [0, Math.round(initialDetailPosition)],
          outputRange: [(-1 * height) / 10, 0],
          extrapolate: 'clamp',
        }),
      });

    transform.push(
      ...[
        {
          translateX: avatarX,
        },
        {
          scale: calcScale(),
        },
      ],
    );
    return transform;
  }

  const [pokeballRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(pokeballRotation, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        flexDirection: 'column',
        position: 'absolute',
        ...getPosition(),
        top: height / 2 - Math.round((cardSize / 100) * 80),
        zIndex: 2,
        opacity: painelHeight.interpolate({
          inputRange: [
            Math.round(finalDetailPosition),
            Math.round(initialDetailPosition / 2),
            Math.round(initialDetailPosition),
          ],
          outputRange: [0, 0, 1],
          extrapolate: 'clamp',
        }),
        transform: getTransform(),
      }}>
      <View style={{alignItems: 'baseline'}}>
        <Animated.Image
          source={require('../../assets/pokeball.png')}
          style={{
            width: cardSize,
            height: cardSize,
            position: 'absolute',
            zIndex: -10,
            opacity: 0.4,
            transform: [
              {
                rotate: pokeballRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
        <SharedElement id={`item.${pokemon.id}.photo`}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokemon.num}.png`,
            }}
            style={{
              width: cardSize - calc.percent(cardSize, 10),
              height: cardSize - calc.percent(cardSize, 10),
              zIndex: 11,
            }}></Image>
        </SharedElement>
      </View>
    </Animated.View>
  );
};

export default Avatar;
