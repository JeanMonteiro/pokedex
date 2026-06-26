import React from 'react';
import {PokemonSummary} from '../model/Pokemon';

const state = {
  dataBase: [],
  item: null,
  index: null,
  setDatabase: (itens: PokemonSummary[]) => {
    state.dataBase.push(...itens);
  },
  setItem: pokemon => {
    state.item = pokemon;
  },
  setIndex: index => {
    state.index = index;
  },
};

export default React.createContext(state);
