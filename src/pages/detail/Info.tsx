import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export interface InfoProps {
  painelHeight: any;
  pokemonNum: string;
  pokemonName: string;
  types: string[];
}

const Info: React.FC<InfoProps> = ({pokemonNum, pokemonName, types}) => {
  const renderTypes = () =>
    types.map(type => (
      <View key={type} style={styles.typeContainer}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
    ));

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.nameTitle}>{pokemonName}</Text>
        <Text style={styles.num}>{`#${pokemonNum}`}</Text>
      </View>
      <View style={styles.typesContainer}>{renderTypes()}</View>
    </>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  num: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  nameTitle: {
    color: 'white',
    fontWeight: 'bold',
    overflow: 'visible',
    fontSize: 35,
  },
  typeContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  typesContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
});
