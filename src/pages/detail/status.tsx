import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Bar} from 'react-native-progress';
import Pokemon from '../../model/Pokemon';
import GStyles, {colors} from '../../styles/index';

const Status: React.FC<{item: Pokemon}> = ({item}) => {
  const statusList = () => {
    return item.stats?.map((status, index) => (
      <View style={styles.statusContainer} key={index}>
        <Text style={styles.name}>{status.name}</Text>
        <View style={styles.numberProgressContainer}>
          <View style={styles.numberContainer}>
            <Text>{status.value}</Text>
          </View>
          <Bar
            progress={status.value / 100}
            color={colors[item.type[0]]}
            borderWidth={1}
            height={20}
          />
        </View>
      </View>
    ));
  };
  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={GStyles.textTitle}>Status</Text>
      </View>
      <View>{statusList()}</View>
    </>
  );
};

export default Status;

const styles = StyleSheet.create({
  titleContainer: {alignItems: 'center', marginBottom: 10, marginTop: 10},
  numberProgressContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  name: {
    color: colors.default.foregroundText,
    marginRight: 10,
    width: '40%',
  },
  numberContainer: {width: '22%'},
});
