import React, {useContext, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import GStyle from '../../styles';
import MyContext from '../../store/context';
import Gstyle, {colors} from '../../styles/index';

export default function about({item}) {
  const context = useContext(MyContext);
  return (
    <View>
      <Text style={{...GStyle.textTitle, marginVertical: 10}}>Descrição</Text>
      <Text>{item.description}</Text>
      <Text style={{...GStyle.textTitle, marginVertical: 10}}>Biologia</Text>
      <View style={styles.inlineContainer}>
        <Text
          style={{
            color: colors.default.foregroundText,
            marginRight: 10,
            width: '40%',
          }}>
          Espécie
        </Text>

        <Text>{item.especie}</Text>
      </View>
      <View style={styles.inlineContainer}>
        <Text
          style={{
            color: colors.default.foregroundText,
            marginRight: 10,
            width: '40%',
          }}>
          Altura
        </Text>
        <Text>{item.height}</Text>
      </View>
      <View style={styles.inlineContainer}>
        <Text
          style={{
            color: colors.default.foregroundText,
            marginRight: 10,
            width: '40%',
          }}>
          Peso
        </Text>
        <Text>{item.weight}</Text>
      </View>
      <View style={styles.inlineContainer}>
        <Text
          style={{
            color: colors.default.foregroundText,
            marginRight: 10,
            width: '40%',
          }}>
          Anatomia
        </Text>
        <Text>{item.anatomia}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: 'row',
  },
});
