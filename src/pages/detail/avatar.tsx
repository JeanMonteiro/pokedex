import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Animated, Image, View, Easing} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import calc from '../../util/calc';
import {ApplicationStore} from '../../store';

export interface props {
  panResponder: any;
  height: any;
  width: any;
  cardSize: any;
  initialDetailPosition: any;
  finalDetailPosition: any;
  painelHeight: any;
  x: Animated.Value;
  position: number;
}

const Avatar = ({
  panResponder,
  height,
  width,
  cardSize,
  initialDetailPosition,
  finalDetailPosition,
  painelHeight,
  x,
  position,
}: props) => {
  const {selectedPokemon, index, database} = useSelector(
    (state: ApplicationStore) => state.pokemon,
  );

  const getScreenPosition = (): Object => {
    if (position == -1) return {left: cardSize * -1};
    if (position == 0) return {alignSelf: 'center'};
    return {right: cardSize * -1};
  };

  const getNum = () => {
    if (position == -1) return database[index - 1].num;
    if (position == 0) return database[index].num;
    return database[index + 1].num;
  };

  const calcScale = () => {
    if (position == -1)
      return x.interpolate({
        inputRange: [0, Math.round(width / 2 + cardSize / 2)],
        outputRange: [0, 1],
        easing: Easing.out(Easing.circle),
        extrapolate: 'clamp',
      });
    if (position == 1) {
      return x.interpolate({
        inputRange: [Math.round((width / 2 + cardSize / 2) * -1), 0],
        outputRange: [1, 0],
        easing: Easing.circle,
        extrapolate: 'clamp',
      });
    }

    return x.interpolate({
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
          translateX: x,
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
        ...getScreenPosition(),
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
        <SharedElement id={`${index + position}`}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${getNum()}.png`,
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
