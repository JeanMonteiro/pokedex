import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ApplicationStore} from '../../store';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Easing,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {colors} from '../../styles/index';
import Tabs from '../../navigation/detailTabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import calc from '../../util/calc';
import Avatar from './avatar';
import {
  nextPokemon as nextPokemonActionCreator,
  previousPokemon as previousPokemonActionCreator,
} from '../../store/ducks/pokemon';

const {height, width} = Dimensions.get('screen');
const cardSize = calc.percent(width, 50);
const initialDetailPosition = (height / 100) * 30;
const finalDetailPosition = 0;

const transitionType = {
  PREVIOUS: 0,
  NEXT: 1,
};

export const Detail = ({navigation}) => {
  const {database, index, selectedPokemon} = useSelector(
    (state: ApplicationStore) => state.pokemon,
  );

  const dispatch = useDispatch();

  const [detailOpened, setDetailOpened] = useState(false);
  const [painelHeight] = useState(new Animated.Value(initialDetailPosition));

  //3 Avatars will be rendered considering this values and the array order
  const [animatedValuesX, setAnimatedValuesX] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  const [pokeballRotation] = useState(new Animated.Value(0));

  let isTransitioning: number = null;

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

  const handleYRelease = (e, gestureState) => {
    if (!detailOpened) {
      if (gestureState.dy < -50) {
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
      if (gestureState.dy > 50) {
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
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gestureState) => {
      if (detailOpened && gestureState.dy > 0) {
        return true;
      }
      if (!detailOpened && gestureState.dy < 0) {
        return true;
      }
      return false;
    },

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

    onPanResponderRelease: handleYRelease,
  });

  const previousPokemon = () => {
    if (index === 0) return;
    Animated.parallel([
      Animated.timing(animatedValuesX[0], {
        duration: 500,
        toValue: width / 2 + cardSize / 2,
      }),
      Animated.timing(animatedValuesX[1], {
        duration: 500,
        toValue: width / 2 + cardSize / 2,
      }),
    ]).start(() => {
      dispatch(previousPokemonActionCreator(selectedPokemon.num))
    });
  };

  const nextPokemon = async () => {
    if (index === database.length - 1) return;
    isTransitioning = transitionType.NEXT; //sync
    Animated.parallel([
      Animated.timing(animatedValuesX[2], {
        duration: 500,
        toValue: (width / 2 + cardSize / 2) * -1,
      }),
      Animated.timing(animatedValuesX[1], {
        duration: 500,
        toValue: (width / 2 + cardSize / 2) * -1,
      }),
    ]).start(() => {
      dispatch(nextPokemonActionCreator(selectedPokemon.num));
    });
    // animatedValuesX.forEach((animatedValue) => animatedValue.setValue(0));
    // async () =>
    //   dispatch(nextPokemonActionCreator(selectedPokemon.num)),
  };

  const panResponderAvatar = PanResponder.create({
    onPanResponderStart: () => {},

    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: animatedValuesX[1],
      },
    ]),

    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -80) {
        nextPokemon();
        return;
      }
      if (gestureState.dx > 80) {
        previousPokemon();
        return;
      }

      Animated.timing(animatedValuesX[1], {
        duration: 300,
        toValue: 0,
      }).start();
    },
  });

  const renderTypes = (types) =>
    types.map((type) => (
      <View
        key={type}
        style={{
          backgroundColor: 'rgba(255,255,255,0.3)',
          alignSelf: 'center',
          padding: 5,
          borderRadius: 10,
          marginRight: 10,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', alignSelf: 'center'}}>
          {type}
        </Text>
      </View>
    ));

  const animatedColor = () => {
    if (index == 0) {
      return animatedValuesX[1].interpolate({
        inputRange: [0, width / 2 + cardSize / 2],
        outputRange: [
          colors[database[index].type[0]],
          colors[database[index + 1].type[0]],
        ],
      });
    }

    if (index > 0 && index !== database.length - 1) {
      return animatedValuesX[1].interpolate({
        inputRange: [
          (width / 2 + cardSize / 2) * -1,
          0,
          width / 2 + cardSize / 2,
        ],
        outputRange: [
          colors[database[index + 1].type[0]],
          colors[database[index].type[0]],
          colors[database[index - 1].type[0]],
        ],
      });
    }
    if (index > 0 && index == database.length - 1) {
      return animatedValuesX[1].interpolate({
        inputRange: [(width / 2 + cardSize / 2) * -1, 0],
        outputRange: [
          colors[database[index - 1].type[0]],
          colors[database[index].type[0]],
        ],
      });
    }
  };

  const renderAvatar = (animatedValue: Animated.Value, i: number) => {
    if (i === 0 && index === 0) return null;
    if (i === 2 && index === database.length) return null;
    return (
      <Avatar
        {...{
          key: i,
          x: animatedValue,
          cardSize,
          finalDetailPosition,
          height,
          initialDetailPosition,
          painelHeight,
          panResponder: panResponderAvatar,
          width,
          position: i - 1,
        }}
      />
    );
  };
  console.log('rendering again');
  return (
    <Animated.View
      style={{
        backgroundColor: animatedColor(),
        flex: 1,
      }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}>
          <TouchableOpacity
            onPress={() => {
              Animated.spring(painelHeight, {
                toValue: 0,
                bounciness: 1,
                speed: 1,
              }).start();
              navigation.goBack();
            }}>
            <Icon name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Animated.Text
            style={{
              ...styles.nameTitle,
              fontSize: Math.round(height / 25),
              opacity: painelHeight.interpolate({
                inputRange: [
                  Math.round(finalDetailPosition),
                  Math.round(initialDetailPosition / 2),
                  Math.round(initialDetailPosition),
                ],
                outputRange: [1, 0, 0],
                extrapolate: 'clamp',
              }),
            }}>
            {selectedPokemon.name}
          </Animated.Text>

          <TouchableOpacity>
            <Icon name="heart" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Animated.View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          height: painelHeight.interpolate({
            inputRange: [
              Math.round(finalDetailPosition),
              20,
              Math.round(initialDetailPosition),
            ],
            outputRange: [0, Math.round(height / 15), Math.round(height / 15)],
          }),
          opacity: painelHeight.interpolate({
            inputRange: [
              Math.round(finalDetailPosition),
              Math.round(initialDetailPosition / 2),
              Math.round(initialDetailPosition),
            ],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
          }),
        }}>
        <Animated.Text
          style={{
            ...styles.nameTitle,
            fontSize: Math.round(height / 22),
          }}>
          {selectedPokemon.name}
        </Animated.Text>

        <Animated.Text
          style={{
            ...styles.num,
          }}>{`#${selectedPokemon.num}`}</Animated.Text>
      </Animated.View>

      <Animated.View
        style={{
          flexDirection: 'row',
          paddingLeft: '5%',
          paddingRight: '5%',
          height: painelHeight.interpolate({
            inputRange: [
              Math.round(finalDetailPosition),
              20,
              Math.round(initialDetailPosition),
            ],
            outputRange: [0, Math.round(height / 15), Math.round(height / 15)],
          }),

          opacity: painelHeight.interpolate({
            inputRange: [
              Math.round(finalDetailPosition),
              Math.round(initialDetailPosition / 2),
              Math.round(initialDetailPosition),
            ],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
          }),
        }}>
        {renderTypes(selectedPokemon.type)}
      </Animated.View>

      {animatedValuesX.map((animatedValue, animatedValuesIndex) =>
        renderAvatar(animatedValue, animatedValuesIndex),
      )}

      <Animated.View
        style={{
          height: painelHeight,
        }}
      />

      <Animated.View
        style={{
          opacity: painelHeight.interpolate({
            inputRange: [
              finalDetailPosition,
              calc.percent(initialDetailPosition, 90),
            ],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          position: 'absolute',
          transform: [
            {
              translateY: painelHeight.interpolate({
                inputRange: [finalDetailPosition, initialDetailPosition],
                outputRange: [
                  calc.percent(height / 2 - cardSize / 2, 70),
                  height / 2 - cardSize / 2,
                ],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <TouchableOpacity
          style={{
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: 999,
            height: 50,
            width: 50,
            marginLeft: Math.round(width / 20),
            backgroundColor: 'rgba(255,255,255,0.3)',
            flex: 1,
          }}
          onPress={() => {
            previousPokemon();
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              flex: 1,
            }}>
            <Icon name="chevron-left" color="#fff" size={30} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          right: 0,
          opacity: painelHeight.interpolate({
            inputRange: [
              finalDetailPosition,
              calc.percent(initialDetailPosition, 90),
            ],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          position: 'absolute',
          transform: [
            {
              translateY: painelHeight.interpolate({
                inputRange: [finalDetailPosition, initialDetailPosition],
                outputRange: [
                  calc.percent(height / 2 - cardSize / 2, 70),
                  height / 2 - cardSize / 2,
                ],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <TouchableOpacity
          style={{
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: 999,
            height: 50,
            width: 50,
            marginRight: Math.round(width / 20),
            backgroundColor: 'rgba(255,255,255,0.3)',
            flex: 1,
          }}
          onPress={() => {
            nextPokemon();
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              flex: 1,
            }}>
            <Icon name="chevron-right" color="#fff" size={30} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          backgroundColor: 'white',
          overflow: 'visible',
          paddingTop: Math.round((cardSize / 100) * 21),
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
        <Tabs item={{...selectedPokemon}} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  nameTitle: {
    color: 'white',
    fontWeight: 'bold',
    overflow: 'visible',
  },
  container: {
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  num: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

Detail.sharedElements = (navigation) => {
  const index = navigation.getParam('index');
  console.log(index);
  return [{id: `${index}`, animation: 'fade'}];
};
