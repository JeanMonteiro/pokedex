import Axios from 'axios';
import {
  EvolutionStep,
  PokemonDetailExtra,
  PokemonStat,
  PokemonSummary,
} from '../model/Pokemon';

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

  getDetails: async (num: string): Promise<PokemonDetailExtra | null> => {
    try {
      const especiesReturn = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${num}`,
      );
      const pokemonReturn = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${num}`,
      );
      const especies = especiesReturn.data;
      const pokemon = pokemonReturn.data;

      const evolutionReturn = await axios.get(especies?.evolution_chain?.url);
      const chain = evolutionReturn.data?.chain;

      // Each lookup tolerates missing data: a species with no English entry,
      // an empty evolution_details, or a partial response must not throw.
      const description = especies?.flavor_text_entries?.find(
        (text: any) => text.language?.name === 'en',
      )?.flavor_text;

      const especie = especies?.genera?.find(
        (genera: any) => genera.language?.name === 'en',
      )?.genus;

      const stats: PokemonStat[] =
        pokemon?.stats?.map((stat: any) => ({
          value: stat.base_stat,
          name: stat.stat?.name,
        })) ?? [];

      const evolutionList: EvolutionStep[] = [];
      if (chain?.species?.name) {
        evolutionList.push({levelTo: 0, name: chain.species.name});
      }
      const collectEvolutions = (nodes: any[] = []) => {
        nodes.forEach((node: any) => {
          const name = node.species?.name;
          if (name) {
            evolutionList.push({
              levelTo: node.evolution_details?.[0]?.min_level ?? null,
              name,
            });
          }
          if (node.evolves_to?.length) {
            collectEvolutions(node.evolves_to);
          }
        });
      };
      collectEvolutions(chain?.evolves_to);

      return {
        height: pokemon?.height,
        weight: pokemon?.weight,
        description,
        especie,
        anatomia: especies?.shape?.name,
        stats,
        evolutionList,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
