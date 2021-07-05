import React, {useState, useEffect, useContext} from 'react';
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
// import Tabs from '../../navigation/detailTabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import calc from '../../util/calc';
import api from '../../services/api';
import MyContext from '../../store/context';
import Avatar from './avatar';

const {height, width} = Dimensions.get('screen');
const cardSize = calc.percent(width, 50);

const Detail = ({navigation}) => {
  const {item, index, dataBase, setItem, setIndex} = useContext(MyContext);

  const initialDetailPosition = (height / 100) * 30;
  const finalDetailPosition = 0;

  const [detailOpened, setDetailOpened] = useState(false);
  const [painelHeight] = useState(new Animated.Value(initialDetailPosition));
  const [avatarX] = useState(new Animated.Value(0));
  const [nextAvatarX] = useState(new Animated.Value(0));
  const [previousAvatarX] = useState(new Animated.Value(0));
  const [pokemon, setPokemon] = useState(item);

  const [pokeballRotation] = useState(new Animated.Value(0));

  const loadDetails = async () => {
    const details = await api.getDetails(pokemon.num);
    await setPokemon({...pokemon, ...details});
  };

  useEffect(() => {
    loadDetails();
  }, [pokemon.id]);

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
          useNativeDriver: true,
        }).start(() => {
          setDetailOpened(true);
        });
      } else {
        Animated.timing(painelHeight, {
          duration: 300,
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (gestureState.dy > 50) {
        Animated.timing(painelHeight, {
          duration: 300,
          toValue: initialDetailPosition - finalDetailPosition,
          useNativeDriver: true,
        }).start(() => {
          setDetailOpened(false);
        });
      } else {
        Animated.timing(painelHeight, {
          duration: 300,
          toValue: 0,
          useNativeDriver: true,
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

    onPanResponderMove: Animated.event(
      [
        null,
        {
          dy: painelHeight,
        },
      ],
      {
        useNativeDriver: true,
      },
    ),

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
      Animated.timing(previousAvatarX, {
        duration: 500,
        toValue: width / 2 + cardSize / 2,
        useNativeDriver: false,
      }),
      Animated.timing(avatarX, {
        duration: 500,
        toValue: width / 2 + cardSize / 2,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      await setItem(dataBase[index - 1]);
      await setIndex(index - 1);
      await setPokemon(dataBase[index - 1]);
      avatarX.setValue(0);
      previousAvatarX.setValue(0);
    });
  };

  const nextPokemon = async () => {
    if (index === dataBase.length - 1) return;
    Animated.parallel([
      Animated.timing(nextAvatarX, {
        duration: 500,
        toValue: (width / 2 + cardSize / 2) * -1,
        useNativeDriver: false,
      }),
      Animated.timing(avatarX, {
        duration: 500,
        toValue: (width / 2 + cardSize / 2) * -1,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      await setItem(dataBase[index + 1]);
      await setIndex(index + 1);
      avatarX.setValue(0);
      nextAvatarX.setValue(0);
      await setPokemon(dataBase[index + 1]);
    });
  };

  const panResponderAvatar = PanResponder.create({
    onPanResponderStart: () => {},

    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: avatarX,
        },
      ],
      {
        useNativeDriver: true,
      },
    ),

    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -80) {
        nextPokemon();
        return;
      }
      if (gestureState.dx > 80) {
        previousPokemon();
        return;
      }

      Animated.timing(avatarX, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  const renderTypes = types =>
    types.map(type => (
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
      return avatarX.interpolate({
        inputRange: [0, width / 2 + cardSize / 2],
        outputRange: [
          colors[pokemon.type[0]],
          colors[dataBase[index + 1].type[0]],
        ],
      });
    }

    if (index > 0 && index !== dataBase.length - 1) {
      return avatarX.interpolate({
        inputRange: [
          (width / 2 + cardSize / 2) * -1,
          0,
          width / 2 + cardSize / 2,
        ],
        outputRange: [
          colors[dataBase[index + 1].type[0]],
          colors[pokemon.type[0]],
          colors[dataBase[index - 1].type[0]],
        ],
      });
    }
    if (index > 0 && index == dataBase.length - 1) {
      return avatarX.interpolate({
        inputRange: [(width / 2 + cardSize / 2) * -1, 0],
        outputRange: [
          colors[dataBase[index - 1].type[0]],
          colors[pokemon.type[0]],
        ],
      });
    }
  };

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
                useNativeDriver: false,
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
            {pokemon.name}
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
          {pokemon.name}
        </Animated.Text>

        <Animated.Text
          style={{
            ...styles.num,
          }}>{`#${pokemon.num}`}</Animated.Text>
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
        {renderTypes(pokemon.type)}
      </Animated.View>

      {index > 0 ? (
        <Avatar
          {...{
            avatarX: previousAvatarX,
            cardSize,
            finalDetailPosition,
            height,
            initialDetailPosition,
            painelHeight,
            panResponder: panResponderAvatar,
            pokemon: dataBase[index - 1],
            width,
            position: -1,
          }}
        />
      ) : null}

      <Avatar
        {...{
          avatarX,
          cardSize,
          finalDetailPosition,
          height,
          initialDetailPosition,
          painelHeight,
          panResponder: panResponderAvatar,
          pokemon,
          width,
          position: 0,
        }}
      />

      {index + 1 < dataBase.length ? (
        <Avatar
          {...{
            avatarX: nextAvatarX,
            cardSize,
            finalDetailPosition,
            height,
            initialDetailPosition,
            painelHeight,
            panResponder: panResponderAvatar,
            pokemon: dataBase[index + 1],
            width,
            position: 1,
          }}
        />
      ) : null}

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
        {/* <Tabs item={{...pokemon}} /> */}
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

Detail.sharedElements = navigation => {
  const item = navigation?.params?.item;
  return [`item.${item.id}.photo`];
};

export default Detail;
