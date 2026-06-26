import Axios from 'axios';
import {EvolutionStep, PokemonSummary} from '../model/Pokemon';

const axios = Axios.create();

export default {
  list: async (): Promise<PokemonSummary[]> => {
    try {
      const {data} = await axios.get(
        'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json',
      );
      return data.pokemon.map((item: PokemonSummary) => ({
        id: item.id,
        num: item.num,
        name: item.name,
        type: item.type,
        img: item.img,
      }));
    } catch (error) {
      console.log(error);
      // Never hand a collection back as null: callers spread it into the
      // store (`push(...itens)`), and `...null` throws "not iterable",
      // crashing the whole app on a flaky network. Empty list = recoverable.
      return [];
    }
  },

  getDetails: async (num: string) => {
    const especiesReturn = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${new Number(num)}`,
    );

    const pokemonReturn = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${new Number(num)}`,
    );

    const evolutionReturn = await axios.get(
      `${especiesReturn.data.evolution_chain.url}`,
    );
    const height =
      pokemonReturn.data != null ? pokemonReturn.data.height : null;
    const weight =
      pokemonReturn.data != null ? pokemonReturn.data.weight : null;

    const description =
      especiesReturn.data != null
        ? especiesReturn.data.flavor_text_entries.find((text: any) => {
            return text.language.name == 'en';
          }).flavor_text
        : null;

    const especie =
      especiesReturn.data != null
        ? especiesReturn.data.genera.find((genera: any) => {
            return genera.language.name == 'en';
          }).genus
        : null;

    const anatomia =
      especiesReturn.data != null ? especiesReturn.data.shape.name : null;

    const stats =
      pokemonReturn.data != null
        ? pokemonReturn.data.stats.map((stats: any) => ({
            value: stats.base_stat,
            name: stats.stat.name,
          }))
        : [];

    const evolutionList: EvolutionStep[] = [];

    const initialNode = evolutionReturn.data.chain;
    evolutionList.push({levelTo: 0, name: initialNode?.species?.name});

    const getChildEvolutionInfo = (node: any[]) => {
      node.forEach((element: any) => {
        const levelTo = element.evolution_details[0].min_level;
        const name = element.species.name;
        evolutionList.push({levelTo, name});
        if (element.evolves_to.length > 0)
          getChildEvolutionInfo(element.evolves_to);
      });
    };

    getChildEvolutionInfo(evolutionReturn.data.chain.evolves_to);

    return {
      height,
      weight,
      description,
      especie,
      stats,
      anatomia,
      evolutionList,
    };
  },
};
