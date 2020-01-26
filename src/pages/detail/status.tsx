import React from 'react';
import {View, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import GStyles, {colors} from '../../styles/index';

export default function status({item}) {
  const statusList = item => {
    return item.stats?.map((status, index) => (
      <View style={{flexDirection: 'row', marginBottom: 10}} key={index}>
        <Text
          style={{
            color: colors.default.foregroundText,
            marginRight: 10,
            width: '40%',
          }}>
          {status.name}
        </Text>
        <View style={{width: '60%', flexDirection: 'row'}}>
          <Text style={{marginRight: 10}}>{status.value}</Text>
          <Progress.Bar
            progress={status.value / 100}
            borderWidth={1}
            height={15}
            style={{marginRight: 10}}
            color={colors[item.type[0]]}
          />
        </View>
      </View>
    ));
  };
  return (
    <View>
      <View style={{alignItems: 'center', marginBottom: 10, marginTop: 10}}>
        <Text style={GStyles.textTitle}>Status</Text>
      </View>
      <View>{statusList(item)}</View>
    </View>
  );
}
