import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Easing,
  Image,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  Button,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {colors} from '../../styles/index';
import Tabs from '../../navigation/detailTabs';

const {height, width} = Dimensions.get('screen');
const cardSize = Math.round((width / 100) * 60);

export const Detail = ({navigation}) => {
  const item = navigation.getParam('item');

  const initialDetailPosition = (height / 100) * 35;
  // const finalDetailPosition = (height / 100) * 0;
  const finalDetailPosition = 0;

  const [detailOpened, setDetailOpened] = useState(false);

  const [painelHeight] = useState(new Animated.Value(initialDetailPosition));

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

    //MaybeLater!
    // Animated.spring(painelHeight, {
    //   toValue: initialDetailPosition,
    //   bounciness: 1,
    //   speed: 3,
    // }).start();
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
    },
  });

  return (
    <SafeAreaView style={{backgroundColor: colors[item.type[0]], flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button
          {...{
            title: 'Voltar',
            onPress: () => {
              Animated.spring(painelHeight, {
                toValue: 0,
                bounciness: 1,
                speed: 1,
              }).start();
              navigation.goBack();
            },
          }}
        />
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
              easing: Easing.linear,
            }),
          }}>
          {item.name}
        </Animated.Text>
        <Button {...{title: 'like', onPress: () => {}}} />
      </View>

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
            easing: Easing.linear,
          }),
        }}>
        <Animated.Text
          style={{
            ...styles.nameTitle,
            fontSize: Math.round(height / 22),
          }}>
          {item.name}
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.num,
          }}>{`#${item.num}`}</Animated.Text>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: height / 2 - 180,
          zIndex: 2,
          opacity: 1,
        }}>
        <Animated.Image
          source={require('../../assets/pokeball.png')}
          style={{
            width: cardSize,
            height: cardSize,
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
          }}
        />

        <View>
          <SharedElement id={`${item.id}`}>
            <Animated.Image
              source={{
                uri: item.img,
              }}
              style={{
                width: cardSize,
                height: cardSize,
                opacity: painelHeight.interpolate({
                  inputRange: [
                    Math.round(finalDetailPosition),
                    Math.round(initialDetailPosition / 2),
                    Math.round(initialDetailPosition),
                  ],
                  outputRange: [0, 0, 1],
                  extrapolate: 'clamp',
                  easing: Easing.linear,
                }),
              }}></Animated.Image>
          </SharedElement>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          height: painelHeight,
        }}
      />

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          backgroundColor: 'white',
          overflow: 'visible',
        }}>
        <Tabs />
      </Animated.View>
    </SafeAreaView>
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
    fontWeight: 'normal',
  },
});

// Detail.router = Tabs.router;

Detail.sharedElements = (navigation, otherNavigation, showing) => {
  const item = navigation.getParam('item');
  return [{id: `${item.id}`, animation: 'fade'}];
};
