import React, {useContext, Fragment} from 'react';
import {View, Text, Image} from 'react-native';
import MyContext from '../../store/context';
import Gstyles from '../../styles/index';
import Pokemon from '../../model/pokemon';
import {colors} from '../../styles/index';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function evolution({item}) {
  const context = useContext(MyContext);

  const evolutionsNode = () => {
    return item.evolutionList?.map((node, index) => {
      const databaseItem = context.dataBase.find(
        (item: Pokemon) =>
          item.name == node.name.replace(/^./, node.name[0].toUpperCase()),
      );
      return (
        <Fragment key={index}>
          <View>
            <View>
              <Image
                style={{height: 60, width: 60}}
                source={{
                  uri: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${databaseItem.num}.png`,
                }}
              />

              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    color: colors.default.activeText,
                  }}>
                  {node.name}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{color: colors.default.foregroundText}}>
                  Level:{' '}
                </Text>
                <Text style={{color: colors.default.activeText}}>
                  {node.levelTo}
                </Text>
              </View>
            </View>
          </View>
          {item.evolutionList.length - 1 > index && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                flexDirection: 'row',
              }}>
              <Icon
                name="chevron-right"
                size={20}
                color={colors.default.activeText}
              />
            </View>
          )}
        </Fragment>
      );
    });
  };

  return (
    <View>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 10,
          marginTop: 10,
        }}>
        <Text style={Gstyles.textTitle}>Grade de evolução</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {evolutionsNode()}
      </View>
    </View>
  );
}
