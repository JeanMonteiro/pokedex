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
  Extrapolate,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

const {height} = Dimensions.get('screen');

export interface HeaderProps {
  bottomSheetY: Reanimated.SharedValue<number>;
  pokemonName: string;
}

const Header: React.FC<HeaderProps> = ({pokemonName, bottomSheetY}) => {
  const navigation = useNavigation();
  const reanimatedWrapperStyle = useAnimatedStyle(() => ({
    opacity: interpolate(bottomSheetY.value, [448, 350], [0, 1], {
      extrapolateRight: Extrapolate.CLAMP,
    }),
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
