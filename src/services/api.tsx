import Axios from 'axios';
import Pokemon from '../model/pokemon';

const axios = Axios.create();

export default {
  list: async (): Promise<Pokemon[]> => {
    const {data} = await axios.get(
      'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json',
    );
    return data.pokemon.map(
      item => new Pokemon(item.id, item.num, item.name, item.type, item.img),
    );
  },
};
