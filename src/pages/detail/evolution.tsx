import React, {useContext, Fragment} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MyContext from '../../store/context';
import Gstyles from '../../styles/index';
import Pokemon from '../../model/Pokemon';
import {colors} from '../../styles/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import Image from '../../components/Image';

export interface IEvolution {
  item: Pokemon;
}

const Evolution: React.FC<IEvolution> = ({item}) => {
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
                style={styles.image}
                source={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${databaseItem.num}.png`}
              />

              <View>
                <Text style={styles.name}>{node.name}</Text>
              </View>

              <View style={styles.levelContainer}>
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
            <View style={styles.arrowIconContainer}>
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
      <View style={styles.innerContainer}>
        <Text style={Gstyles.textTitle}>Grade de evolução</Text>
      </View>
      <View style={styles.evolutionLineContainer}>{evolutionsNode()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {height: 60, width: 60},
  name: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.default.activeText,
  },
  levelContainer: {
    flexDirection: 'row',
  },
  arrowIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  evolutionLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default Evolution;
