import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {PokemonSummary} from '../model/Pokemon';

/**
 * The pokemon summaries fetched once on Home, shared so the detail screen's
 * evolution tab can resolve sprite/num for an evolution species by name.
 *
 * This used to be a module-level object whose setters mutated it in place
 * (`state.dataBase.push(...)`). Because the reference never changed and no
 * React state was involved, consumers never re-rendered — it only appeared to
 * work because evolution read `dataBase` lazily during a later render. It is
 * now backed by real state so updates propagate.
 */
export interface PokemonStore {
  dataBase: PokemonSummary[];
  setDatabase: (itens: PokemonSummary[]) => void;
}

const PokemonContext = createContext<PokemonStore | null>(null);

export function PokemonProvider({children}: {children: ReactNode}) {
  const [dataBase, setDataBase] = useState<PokemonSummary[]>([]);

  const value = useMemo<PokemonStore>(
    () => ({dataBase, setDatabase: setDataBase}),
    [dataBase],
  );

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
}

export function usePokemonStore(): PokemonStore {
  const store = useContext(PokemonContext);
  if (!store) {
    throw new Error('usePokemonStore must be used within a PokemonProvider');
  }
  return store;
}

export default PokemonContext;
