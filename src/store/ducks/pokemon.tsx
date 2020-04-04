import Pokemon from '../../model/pokemon';
import Detail from '../../model/details';

export interface State {
  database: Pokemon[];
  index: number;
  selectedPokemon: Pokemon;
}

const INITIAL_STATE: State = {
  database: [],
  index: 0,
  selectedPokemon: new Pokemon(),
};

export const ActionTypes = {
  fetchFromApi: 'FETCH_FROM_API',
  doneFetchFromApi: 'DONE_FETCH_FROM_API',
  fetchDetails: 'FETCH_DETAILS',
  doneFetchDetails: 'DONE_FETCH_DETAILS',
  nextPokemon: 'NEXT_POKEMON',
  previousPokemon: 'PREVIOUS_POKEMON',
  selectPokemon: ' SELECT_POKEMON',
};

interface FetchFromApi {
  type: typeof ActionTypes.fetchFromApi;
}

interface DoneFetchFromApi {
  type: typeof ActionTypes.doneFetchFromApi;
  payload: Pokemon[];
}

interface FetchDetails {
  type: typeof ActionTypes.fetchDetails;
  payload: string;
}

interface DoneFetchDetails {
  type: typeof ActionTypes.doneFetchDetails;
  payload: Detail;
}

interface NextPokemon {
  type: typeof ActionTypes.nextPokemon;
  payload: string;
}

interface PreviousPokemon {
  type: typeof ActionTypes.previousPokemon;
  payload: string;
}

interface SelectPokemon {
  type: typeof ActionTypes.selectPokemon;
  payload: any;
}

export function fetchFromApi(): FetchFromApi {
  return {
    type: ActionTypes.fetchFromApi,
  };
}

export function selectPokemon(payload): SelectPokemon {
  return {
    type: ActionTypes.selectPokemon,
    payload,
  };
}

export function doneFetchFromApi(pokemons: Pokemon[]): DoneFetchFromApi {
  return {
    type: ActionTypes.doneFetchFromApi,
    payload: pokemons,
  };
}

export function fetchDetails(num: string): FetchDetails {
  return {
    type: ActionTypes.fetchDetails,
    payload: num,
  };
}

export function doneDetails(details: Detail): DoneFetchDetails {
  return {
    type: ActionTypes.doneFetchDetails,
    payload: details,
  };
}

export function nextPokemon(num: string): NextPokemon {
  return {
    type: ActionTypes.nextPokemon,
    payload: num,
  };
}

export function previousPokemon(num: string): PreviousPokemon {
  return {
    type: ActionTypes.previousPokemon,
    payload: num,
  };
}

export type PokemonActionTypes = DoneFetchFromApi | DoneFetchDetails;

export default function reducer(state = INITIAL_STATE, action): State {
  switch (action.type) {
    case ActionTypes.doneFetchFromApi:
      return {
        ...state,
        database: action.payload,
      };
    case ActionTypes.doneFetchDetails:
      const selectedPokemon = state.database[state.index];
      selectedPokemon.setDetails(action.payload);
      return {
        ...state,
        selectedPokemon,
      };

    case ActionTypes.nextPokemon:
      return {
        ...state,
        index: state.index + 1,
        selectedPokemon: state.database[state.index],
      };

    case ActionTypes.previousPokemon:
      return {
        ...state,
        index: state.index - 1,
        selectedPokemon: state.database[state.index],
      };

    case ActionTypes.selectPokemon:
      return {
        ...state,
        index: action.payload.index,
        selectedPokemon: state.database[action.payload.index],
      };
    default:
      return state;
  }
}
