import BottomSheet from '@gorhom/bottom-sheet';
import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';
import Image from '../../components/Image';
import Tabs from '../../navigation/DetailTabs';
import api from '../../services/api';
import {colors} from '../../styles/index';
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

  const route = useRoute();

  const {item, index, pokemonList} = route.params;

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

  const animatedColor = () => {
    const input = new Array(pokemonList.length)
      .fill(0)
      .map((_, i) => i * width);

    return pokemonListOffset.interpolate({
      inputRange: input,
      outputRange: input.map((value, i) => colors[pokemonList[i].type[0]]),
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
    i => () => {
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

  const renderListItem = ({item: listItem}) => {
    const imageURL = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${listItem.num}.png`;

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
          <Animated.View style={{...styles.listItemContainer}}>
            <SharedElement id={`item.${listItem.id}.photo`}>
              <Image source={imageURL} style={{...styles.itemImage}} />
            </SharedElement>
          </Animated.View>
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
          extrapolateRight: Extrapolate.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            animatedYPosition.value,
            [INITIAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION / 3],
            [0, 100],
            {
              extrapolateRight: Extrapolate.CLAMP,
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
          extrapolateRight: Extrapolate.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            animatedYPosition.value,
            [INITIAL_DETAIL_POSITION, FINAL_DETAIL_POSITION],
            [height * 0.4, height * 0.5],
            {
              extrapolateRight: Extrapolate.CLAMP,
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
        animatedPosition={animatedYPosition}>
        <Tabs item={{...pokemon}} loading={loadingDetails} />
      </BottomSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, height: '100%', zIndex: -999},
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
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    zIndex: 11,
    marginHorizontal: SPACING,
  },
});

export default Detail;
