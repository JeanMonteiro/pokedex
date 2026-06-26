/**
 * The pokemon data exists in two shapes:
 *  - PokemonSummary: what the list endpoint returns (and what the grid renders).
 *  - PokemonDetail:  a summary hydrated with the fields fetched lazily on the
 *    detail screen (stats, evolution chain, description, ...).
 *
 * These are plain data interfaces on purpose. The previous `class Pokemon`
 * also carried an `Animated.Value` (a view concern) inside the model, which
 * meant every fetched record allocated animation state and the model could not
 * be serialized or compared. Animation now lives in the components.
 */

export interface PokemonSummary {
  id: string;
  num: string;
  name: string;
  type: string[];
  img: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface EvolutionStep {
  name: string;
  levelTo: number | null;
}

/** Fields hydrated from the detail API and merged onto a summary. */
export interface PokemonDetailExtra {
  height?: number;
  weight?: number;
  description?: string;
  especie?: string;
  anatomia?: string;
  stats?: PokemonStat[];
  evolutionList?: EvolutionStep[];
}

export interface PokemonDetail extends PokemonSummary, PokemonDetailExtra {}
