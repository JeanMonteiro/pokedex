import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import {PokemonSummary} from '../../model/Pokemon';
import {RootStackParamList} from '../../navigation/types';
import {useHero} from '../../transition/HeroContext';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from '../../components/Image';
import Tabs from '../../navigation/detailTabs';
import api from '../../services/api';
import {colorForType} from '../../styles/index';
import calc from '../../util/calc';
import ChangePokemonButton from './ChangePokemonButton';
import Header from './Header';
import Info from './Info';

const POKEBALL_IMG = require('../../assets/pokeball.png');

const {height, width} = Dimensions.get('screen');
const CARD_SIZE = calc.percent(width, 50);

export const INITIAL_DETAIL_POSITION = height / 2;
export const FINAL_DETAIL_POSITION = height * 0.85;

export const INITIAL_DETAIL_CARD_SCALE = 0.3;
export const FINAL_DETAIL_CARD_SCALE = 0.8;

export const ITEM_SIZE = width / 2;
export const SPACING = width * 0.25;

const Detail = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(
    () => [INITIAL_DETAIL_POSITION, FINAL_DETAIL_POSITION],
    [],
  );

  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();

  const {item, index, pokemonList} = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Hero transition: the avatar flown in from the list is hidden here until it
  // lands, then revealed in place. See src/transition/HeroContext.tsx.
  const hero = useHero();
  const avatarRef = useRef<View>(null);
  const hasArrived = useRef(false);
  const isLeaving = useRef(false);

  const avatarStyle = useAnimatedStyle(() => ({opacity: hero.settled.value}));

  const handleAvatarLayout = useCallback(() => {
    if (hasArrived.current) {
      return;
    }
    avatarRef.current?.measureInWindow((_x, y, w, h) => {
      if (!w || !h) {
        return;
      }
      hasArrived.current = true;
      // The focused avatar is always horizontally centered on screen, so derive
      // x from the measured width rather than the (possibly pre-scroll) x.
      hero.arrive({x: (width - w) / 2, y, width: w, height: h});
    });
  }, [hero]);

  // Reveal the avatar regardless if the measurement never lands, and clean up
  // the overlay when leaving the screen.
  useEffect(() => {
    const safety = setTimeout(() => {
      if (!hasArrived.current) {
        hero.settle();
      }
    }, 800);
    return () => {
      clearTimeout(safety);
      hero.reset();
    };
  }, [hero]);

  const [painelHeight] = useState(new Animated.Value(INITIAL_DETAIL_POSITION));
  const animatedYPosition = useSharedValue(INITIAL_DETAIL_POSITION);
  // const [avatarX] = useState(new Animated.Value(0));
  const [pokemonListOffset] = useState(new Animated.Value(0));
  const [pokemon, setPokemon] = useState(item);
  const [currentSelection, setCurrentSelection] = useState(index);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [pokeballRotation] = useState(new Animated.Value(0));

  const listRef = useRef(null);

  const loadDetails = async () => {
    setLoadingDetails(true);
    const details = await api.getDetails(pokemonList[currentSelection].num);
    await setPokemon({...pokemonList[currentSelection], ...details});
    setLoadingDetails(false);
  };

  useEffect(() => {
    loadDetails();
  }, [currentSelection]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(pokeballRotation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // On close, fly the avatar back to its card. Only when we're still showing the
  // pokemon we arrived with (the list can be swiped to another) and the entrance
  // actually played — otherwise just let the screen fade out normally.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (isLeaving.current) {
        return; // re-dispatched below: let it through
      }
      if (!hasArrived.current || currentSelection !== index) {
        return;
      }
      const playing = hero.reverse();
      if (!playing) {
        return;
      }
      e.preventDefault();
      isLeaving.current = true;
      // Dismiss now so the screen fades out while the avatar flies; the overlay
      // lives above the navigator and survives the unmount.
      navigation.dispatch(e.data.action);
    });
    return unsubscribe;
  }, [navigation, hero, currentSelection, index]);

  const animatedColor = () => {
    const input = new Array(pokemonList.length)
      .fill(0)
      .map((_, i) => i * width);

    return pokemonListOffset.interpolate({
      inputRange: input,
      outputRange: input.map((value, i) => colorForType(pokemonList[i].type[0])),
    });
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

  const changeSelectedPokemon = useCallback(
    (i: number) => () => {
      if (
        currentSelection + i < 0 ||
        currentSelection + i > pokemonList.length
      ) {
        return;
      }

      listRef.current.scrollToIndex({index: currentSelection + i});
    },
    [currentSelection],
  );

  const renderListItem = ({item: listItem}: {item: PokemonSummary}) => {
    const imageURL = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${listItem.num}.png`;
    const isFocused = listItem.id === item.id;

    return (
      <View>
        <Info
          painelHeight={painelHeight}
          pokemonNum={listItem.num}
          pokemonName={listItem.name}
          types={listItem.type}
        />
        <Reanimated.View style={styles.listItemContainer}>
          {renderBackgroundPokeball()}
          <View
            ref={isFocused ? avatarRef : undefined}
            onLayout={isFocused ? handleAvatarLayout : undefined}
            style={styles.avatarBox}>
            <Reanimated.View style={[styles.avatarFill, avatarStyle]}>
              <Image source={imageURL} style={styles.avatarImage} />
            </Reanimated.View>
          </View>
        </Reanimated.View>
      </View>
    );
  };

  const fadeOutOnPullUpStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedYPosition.value,
        [INITIAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION * 0.87],
        [1, 0],
        {
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            animatedYPosition.value,
            [INITIAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION / 3],
            [0, 100],
            {
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  const changePokemonButtonAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedYPosition.value,
        [INITIAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION * 0.87],
        [1, 0],
        {
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            animatedYPosition.value,
            [INITIAL_DETAIL_POSITION, FINAL_DETAIL_POSITION],
            [height * 0.4, height * 0.5],
            {
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  const getItemLayout = (_: any, idx: number) => ({
    length: width,
    offset: width * idx,
    index: idx,
  });

  return (
    <Animated.View
      style={{
        backgroundColor: animatedColor(),
        paddingTop: insets.top,
        ...styles.container,
      }}>
      <StatusBar barStyle="light-content" />

      <Header
        pokemonName={pokemonList[currentSelection].name}
        bottomSheetY={animatedYPosition}
      />

      <Reanimated.View style={[fadeOutOnPullUpStyle]}>
        <Animated.FlatList
          ref={listRef}
          data={pokemonList}
          horizontal
          renderItem={renderListItem}
          snapToAlignment={'center'}
          snapToInterval={ITEM_SIZE + SPACING * 2}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{
            height: CARD_SIZE + height * 0.2,
          }}
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
            },
          )}
          initialScrollIndex={index}
          nestedScrollEnabled
          getItemLayout={getItemLayout}
          scrollEventThrottle={16}
          keyExtractor={pok => pok.id}
          onMomentumScrollEnd={event =>
            setCurrentSelection(
              Math.round(event.nativeEvent.contentOffset.x / width),
            )
          }
        />
      </Reanimated.View>

      <Animated.View />

      <Reanimated.View
        style={[
          styles.changePokemonButtonContainerLeft,
          changePokemonButtonAnimation,
        ]}>
        <ChangePokemonButton
          direction="chevron-left"
          onPress={changeSelectedPokemon(-1)}
        />
      </Reanimated.View>

      <Reanimated.View
        style={[
          styles.changePokemonButtonContainerRight,
          changePokemonButtonAnimation,
        ]}>
        <ChangePokemonButton
          direction="chevron-right"
          onPress={changeSelectedPokemon(1)}
        />
      </Reanimated.View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        topInset={insets.top}
        animatedPosition={animatedYPosition}>
        {/*
          bottom-sheet v5's BottomSheetView is position:absolute and sized by its
          content, so `flex: 1` collapses it (and the TabView's pager) to height 0.
          Give it the full-open sheet height so the tabs actually render; the sheet
          clips the overflow at the half-open snap.
        */}
        <BottomSheetView style={styles.sheetContent}>
          <Tabs item={{...pokemon}} loading={loadingDetails} />
        </BottomSheetView>
      </BottomSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, height: '100%', zIndex: -999},
  sheetContent: {height: FINAL_DETAIL_POSITION},
  cardContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    overflow: 'visible',
    paddingTop: Math.round((CARD_SIZE / 100) * 21),
    paddingLeft: '5%',
    paddingRight: '5%',
    height: '100%',
  },
  changePokemonButtonContainerLeft: {
    marginLeft: '5%',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBox: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    zIndex: 11,
    marginHorizontal: SPACING,
  },
  avatarFill: {
    width: '100%',
    height: '100%',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default Detail;
