import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FINAL_DETAIL_POSITION, INITIAL_DETAIL_POSITION} from './Detail';

const {height} = Dimensions.get('screen');

export interface HeaderProps {
  painelHeight: any;
  pokemonName: string;
}

const Header: React.FC<HeaderProps> = ({painelHeight, pokemonName}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
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
              Math.round(FINAL_DETAIL_POSITION),
              Math.round(INITIAL_DETAIL_POSITION / 2),
              Math.round(INITIAL_DETAIL_POSITION),
            ],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp',
          }),
        }}>
        {pokemonName}
      </Animated.Text>

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
