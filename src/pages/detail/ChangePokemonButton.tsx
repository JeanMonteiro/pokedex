import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('screen');

interface IChangePokemonButton {
  onPress: () => void;
  direction: 'chevron-right' | 'chevron-left';
}

const ChangePokemonButton: React.FC<IChangePokemonButton> = ({
  onPress,
  direction,
}) => {
  return (
    <TouchableOpacity style={styles.touchableContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name={direction} color="#fff" size={30} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 999,
    height: 50,
    width: 50,
    marginRight: Math.round(width / 20),
    backgroundColor: 'rgba(255,255,255,0.3)',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
});

export default ChangePokemonButton;
