import React, {Fragment} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {usePokemonStore} from '../../store/context';
import Gstyles from '../../styles/index';
import {PokemonDetail, PokemonSummary} from '../../model/Pokemon';
import {colors} from '../../styles/index';
import Icon from '@react-native-vector-icons/fontawesome/static';
import Image from '../../components/Image';

export interface IEvolution {
  item: PokemonDetail;
}

const Evolution: React.FC<IEvolution> = ({item}) => {
  const {dataBase} = usePokemonStore();

  const evolutionsNode = () => {
    const list = item.evolutionList;
    if (!list) {
      return null;
    }
    return list.map((node, index) => {
      const databaseItem = dataBase.find(
        (entry: PokemonSummary) =>
          entry.name === node.name.replace(/^./, node.name[0].toUpperCase()),
      );
      // The sprite URL needs the dex `num` from the loaded list. If this
      // evolution species isn't in dataBase (partial data), skip the step
      // rather than dereferencing `undefined.num` and crashing the tab.
      if (!databaseItem) {
        return null;
      }
      return (
        <Fragment key={node.name}>
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
          {list.length - 1 > index && (
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
