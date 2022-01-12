import {useRoute} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Image from '../../components/Image';
import api from '../../services/api';
import MyContext from '../../store/context';
import {colors} from '../../styles/index';
import calc from '../../util/calc';
import Header from './Header';
import Info from './Info';
import BottomSheet from 'reanimated-bottom-sheet';
import Reanimated, {
  Extrapolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const POKEBALL_IMG = require('../../assets/pokeball.png');

const {height, width} = Dimensions.get('screen');
const cardSize = calc.percent(width, 50);

export const INITIAL_DETAIL_POSITION = (height / 100) * 30;
export const FINAL_DETAIL_POSITION = 0;

export const INITIAL_DETAIL_CARD_SCALE = 0.3;
export const FINAL_DETAIL_CARD_SCALE = 0.8;

export const ITEM_SIZE = width / 2;
export const SPACING = width * 0.25;

const Detail = () => {
  const {setItem, setIndex} = useContext(MyContext);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(() => [300, 450], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const route = useRoute();

  const {item, index, pokemonList} = route.params;

  const painelYReanimated = new Reanimated.Value(0);

  const [detailOpened, setDetailOpened] = useState(false);
  const [painelHeight] = useState(new Animated.Value(INITIAL_DETAIL_POSITION));
  const [painelY] = useState(new Animated.Value(0));
  const sharedVal = useSharedValue(200);
  const [avatarX] = useState(new Animated.Value(0));
  const [nextAvatarX] = useState(new Animated.Value(0));
  const [previousAvatarX] = useState(new Animated.Value(0));
  const [pokemonListOffset] = useState(new Animated.Value(0));
  const [pokemon, setPokemon] = useState(item);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pokeballRotation] = useState(new Animated.Value(0));

  const loadDetails = async () => {
    setIsLoading(true);
    const details = await api.getDetails(pokemon.num);
    await setPokemon({...pokemon, ...details});
    setIsLoading(false);
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
      }),
    ).start();
  }, []);

  const handleYRelease = (e, gestureState) => {
    if (!detailOpened) {
      if (gestureState.dy < -50) {
        Animated.timing(painelY, {
          duration: 300,
          toValue: -INITIAL_DETAIL_POSITION,
          useNativeDriver: false,
        }).start(() => {
          setDetailOpened(true);
        });
      } else {
        Animated.timing(painelY, {
          duration: 300,
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    } else {
      if (gestureState.dy > 50) {
        Animated.timing(painelY, {
          duration: 300,
          toValue: INITIAL_DETAIL_POSITION - FINAL_DETAIL_POSITION,
          useNativeDriver: false,
        }).start(() => {
          setDetailOpened(false);
        });
      } else {
        Animated.timing(painelY, {
          duration: 300,
          toValue: 0,
          useNativeDriver: false,
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
          dy: painelY,
        },
      ],
      {
        useNativeDriver: false,
      },
    ),

    onPanResponderGrant: () => {
      if (detailOpened) {
        painelY.setOffset(FINAL_DETAIL_POSITION);
      } else {
        painelY.setOffset(INITIAL_DETAIL_POSITION);
      }
    },

    onPanResponderRelease: handleYRelease,
  });

  const panResponderAvatar = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: avatarX,
        },
      ],
      {
        useNativeDriver: false,
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
        useNativeDriver: false,
      }).start();
    },
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
      await setItem(pokemonList[index - 1]);
      await setIndex(index - 1);
      await setPokemon(pokemonList[index - 1]);
      avatarX.setValue(0);
      previousAvatarX.setValue(0);
    });
  };

  const nextPokemon = async () => {
    if (index === pokemonList.length - 1) {
      return;
    }
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
      await setItem(pokemonList[index + 1]);
      await setIndex(index + 1);
      avatarX.setValue(0);
      nextAvatarX.setValue(0);
      await setPokemon(pokemonList[index + 1]);
    });
  };

  const animatedColor = () => {
    if (index == 0) {
      return avatarX.interpolate({
        inputRange: [0, width / 2 + cardSize / 2],
        outputRange: [
          colors[pokemon.type[0]],
          colors[pokemonList[index + 1].type[0]],
        ],
      });
    }

    if (index > 0 && index !== pokemonList.length - 1) {
      return avatarX.interpolate({
        inputRange: [
          (width / 2 + cardSize / 2) * -1,
          0,
          width / 2 + cardSize / 2,
        ],
        outputRange: [
          colors[pokemonList[index + 1].type[0]],
          colors[pokemon.type[0]],
          colors[pokemonList[index - 1].type[0]],
        ],
      });
    }
    if (index > 0 && index == pokemonList.length - 1) {
      return avatarX.interpolate({
        inputRange: [(width / 2 + cardSize / 2) * -1, 0],
        outputRange: [
          colors[pokemonList[index - 1].type[0]],
          colors[pokemon.type[0]],
        ],
      });
    }
  };

  const changePokemonButtonAnimation = {
    opacity: painelHeight.interpolate({
      inputRange: [
        FINAL_DETAIL_POSITION,
        calc.percent(INITIAL_DETAIL_POSITION, 90),
      ],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: painelHeight.interpolate({
          inputRange: [FINAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION],
          outputRange: [
            calc.percent(height / 2 - cardSize / 2, 70),
            height / 2 - cardSize / 2,
          ],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const renderBackgroundPokeball = () => {
    const transform = [
      {
        rotate: pokeballRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ];
    return (
      <Animated.Image
        source={POKEBALL_IMG}
        style={{
          ...styles.pokeballBackgroundImage,
          transform,
        }}
      />
    );
  };

  const renderListItem = ({item: listItem, index}) => {
    const inputRange = [
      index * width - width,
      index * width,
      index * width + width,
    ];

    const outputRange = [0.1, 1, 0.1];

    const transform = [
      {
        scale: pokemonListOffset.interpolate({
          inputRange,
          outputRange,
          easing: Easing.inOut(Easing.circle),
          extrapolate: 'clamp',
        }),
      },
    ];

    // const opacity = painelHeight.interpolate({
    //   inputRange: [
    //     FINAL_DETAIL_POSITION,
    //     calc.percent(INITIAL_DETAIL_POSITION, 90),
    //   ],
    //   outputRange: [0, 1],
    //   extrapolate: 'clamp',
    // });

    const opacity = painelY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const imageURL = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${listItem.num}.png`;

    return (
      <Reanimated.View
        style={{
          ...styles.listItemContainer,
          opacity: Reanimated.add(
            0.1,
            Reanimated.multiply(painelYReanimated, 1),
          ),
        }}>
        <Animated.View style={{...styles.listItemContainer, transform}}>
          {renderBackgroundPokeball()}
          <SharedElement id={`item.${listItem.id}.photo`}>
            <Image source={imageURL} style={{...styles.itemImage}} />
          </SharedElement>
        </Animated.View>
      </Reanimated.View>
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: sharedVal.value}],
    };
  });

  return (
    <Animated.View
      style={{
        backgroundColor: animatedColor(),
        // backgroundColor: colors[pokemon.type[index]],
        ...styles.container,
      }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Header painelHeight={painelHeight} pokemonName={pokemon.name} />
      </SafeAreaView>

      <Info
        painelHeight={painelHeight}
        pokemonNum={pokemon.num}
        pokemonName={pokemon.name}
        types={pokemon.type}
      />

      <Animated.FlatList
        data={pokemonList}
        horizontal
        renderItem={renderListItem}
        snapToAlignment={'center'}
        snapToInterval={ITEM_SIZE + SPACING * 2}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{height: cardSize * 1.5}}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {x: pokemonListOffset},
              },
            },
          ],
          {
            useNativeDriver: false,
            listener: e =>
              console.log(
                'e.nativeEvent.contentOffset.x',
                e.nativeEvent.contentOffset.x,
              ),
          },
        )}
        scrollEventThrottle={16}
        keyExtractor={pok => pok.id}
        initialScrollIndex={index}
      />

      <Animated.View />

      {/* <Animated.View
        style={{
          ...styles.changePokemonButtonContainerLeft,
          ...changePokemonButtonAnimation,
        }}>
        <View style={{marginLeft: Math.round(width / 20)}}>
          <ChangePokemonButton
            direction="chevron-left"
            onPress={previousPokemon}
          />
        </View>
      </Animated.View> */}

      {/* <Animated.View
        style={{
          ...styles.changePokemonButtonContainerRight,
          ...changePokemonButtonAnimation,
        }}>
        <ChangePokemonButton direction="chevron-right" onPress={nextPokemon} />
      </Animated.View> */}

      {/* <Animated.View
        {...panResponder.panHandlers}
        style={{
          ...styles.cardContainer,
          transform: [
            {
              translateY: painelY.interpolate({
                inputRange: [FINAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION],
                outputRange: [INITIAL_DETAIL_POSITION * -1, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}> */}
      {/* <Animated.View style={styles.cardContainer}> */}
      {/* <Tabs item={{...pokemon}} /> */}
      {/* </Animated.View> */}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        callbackNode={painelYReanimated}
        renderContent={() => (
          <View style={styles.cardContainer}>
            <Text>Test</Text>
          </View>
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  cardContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    overflow: 'visible',
    paddingTop: Math.round((cardSize / 100) * 21),
    paddingLeft: '5%',
    paddingRight: '5%',
    height: '100%',
  },
  changePokemonButtonContainerLeft: {
    position: 'absolute',
  },
  changePokemonButtonContainerRight: {
    position: 'absolute',
    right: 0,
  },
  pokeballBackgroundImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'absolute',
    zIndex: -10,
    opacity: 0.4,
  },
  listItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    zIndex: 11,
    marginHorizontal: SPACING,
  },
});

export default Detail;
