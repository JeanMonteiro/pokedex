import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Easing,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

const {height, width} = Dimensions.get('screen');

const sharedElements = [];

export const Detail = ({navigation}) => {
  // sharedElements.push(navigation.params.sharedElements);

  const initialDetailPosition = (height / 100) * 45;
  const finalDetailPosition = (height / 100) * 12;

  const [detailOpened, setDetailOpened] = useState(false);

  const [painelHeight] = useState(new Animated.Value(0));

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

    Animated.spring(painelHeight, {
      toValue: initialDetailPosition,
      bounciness: 1,
      speed: 3,
    }).start();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dy: painelHeight,
      },
    ]),
    onPanResponderGrant: () => {
      if (detailOpened) {
        painelHeight.setOffset(finalDetailPosition);
      } else {
        painelHeight.setOffset(initialDetailPosition);
      }
    },

    onPanResponderRelease: (e, gestureState) => {
      if (!detailOpened) {
        if (gestureState.dy < -100) {
          Animated.timing(painelHeight, {
            duration: 300,
            toValue: finalDetailPosition - initialDetailPosition,
          }).start(() => {
            setDetailOpened(true);
          });
        } else {
          Animated.timing(painelHeight, {
            duration: 300,
            toValue: 0,
          }).start();
        }
      } else {
        if (gestureState.dy > 100) {
          Animated.timing(painelHeight, {
            duration: 300,
            toValue: initialDetailPosition - finalDetailPosition,
          }).start(() => {
            setDetailOpened(false);
          });
        } else {
          Animated.timing(painelHeight, {
            duration: 300,
            toValue: 0,
          }).start();
        }
      }
    },
  });

  return (
    <View style={{backgroundColor: 'red', flex: 1}}>
      <Animated.View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: height / 2 - 220,
          zIndex: 2,
          opacity: painelHeight.interpolate({
            inputRange: [107, 403],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }}>
        <Animated.Image
          source={require('../../assets/pokeball.png')}
          style={{
            ...styles.ball,
            position: 'absolute',
            zIndex: -1,
            opacity: 0.5,
            transform: [
              {
                rotate: pokeballRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}></Animated.Image>

        <SharedElement id="text">
          <View style={{...styles.ball}}>
            <TouchableOpacity
              style={styles.touch}
              onPress={() => {
                Animated.spring(painelHeight, {
                  toValue: 0,
                  bounciness: 1,
                  speed: 3,
                }).start();

                navigation.goBack();
              }}></TouchableOpacity>
          </View>
        </SharedElement>
      </Animated.View>

      <Animated.View
        style={{
          height: painelHeight,
        }}></Animated.View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          backgroundColor: 'white',
        }}></Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    width: 200,
    height: 200,
  },
  touch: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
  },
});

Detail.sharedElements = () => [{id: 'text', animation: 'fade'}];
