import {PokemonSummary} from '../model/Pokemon';

/**
 * Param list for the root native stack. Drives the typing of
 * useNavigation / useRoute and navigation.navigate across the app.
 */
export type RootStackParamList = {
  Home: undefined;
  Detail: {
    item: PokemonSummary;
    index: number;
    pokemonList: PokemonSummary[];
  };
};
