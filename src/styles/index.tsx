import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
  monospaceFont: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  },

  container: {
    paddingHorizontal: '5%',
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const colors = {
  Plant: '#72B357',
  Fire: '#DC5E45',
  Water: '#599FEC',
  Psychic: '#D2436D',
  Dragon: '#333F96',
  Ice: '#77E3FB',
  Grass: '#74b264',
  Poison: '#8b31b1',
  Bug: '#a1c661',
  Rock: '#b5a04b',
  Electric: '#F3CA45',
  Normal: '#a9a87e',
  Ground: '#c8c075',
  Dark: '#6d594a',
  Flying: '#a294ea',
  Fighting: '#b33c31',
  Ghost: '#6c5b94',
  default: {
    foregroundText: '#A4A7A9',
    activeText: '#555',
  },
};
