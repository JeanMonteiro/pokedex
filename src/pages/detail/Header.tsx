import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Icon from '@react-native-vector-icons/fontawesome/static';

const {height} = Dimensions.get('screen');

// bottomSheetY is the sheet's top-edge Y: ~height/2 at the half-open snap and
// ~height*0.15 at full-open. Keep the title hidden until the final stretch of
// the drag, then fade it in so it's only visible once the sheet is (nearly)
// fully open. Both ends are clamped, so it stays 0 at half-open and reaches 1
// at full-open regardless of device size / safe-area inset.
const TITLE_FULLY_VISIBLE_Y = height * 0.2;
const TITLE_REVEAL_START_Y = height * 0.34;

export interface HeaderProps {
  bottomSheetY: Reanimated.SharedValue<number>;
  pokemonName: string;
}

const Header: React.FC<HeaderProps> = ({pokemonName, bottomSheetY}) => {
  const navigation = useNavigation();
  const reanimatedWrapperStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      bottomSheetY.value,
      [TITLE_FULLY_VISIBLE_Y, TITLE_REVEAL_START_Y],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={30} color="#fff" />
      </TouchableOpacity>
      <Reanimated.View style={reanimatedWrapperStyle}>
        <Text
          style={{
            ...styles.nameTitle,
            fontSize: Math.round(height / 25),
          }}>
          {pokemonName}
        </Text>
      </Reanimated.View>

      <TouchableOpacity>
        <Icon name="heart" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  nameTitle: {
    color: 'white',
    fontWeight: 'bold',
    overflow: 'visible',
  },
});
