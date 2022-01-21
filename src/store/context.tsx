import React from 'react';
import Pokemon from '../model/Pokemon';

const state = {
  dataBase: [],
  item: null,
  index: null,
  setDatabase: (itens: Pokemon[]) => {
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
