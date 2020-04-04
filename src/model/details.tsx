export default class Detail {
  height: string;
  weight: string;
  description: string;
  especie: string;
  stats: string;
  anatomia: string;
  evolutionList: string[];

  constructor(
    height: string,
    weight: string,
    description: string,
    especie: string,
    stats: string,
    anatomia: string,
    evolutionList: string[],
  ) {
    this.height = height;
    this.weight = weight;
    this.description = description;
    this.especie = especie;
    this.stats = stats;
    this.anatomia = anatomia;
    this.evolutionList = evolutionList;
  }
}
