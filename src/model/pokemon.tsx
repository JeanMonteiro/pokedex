import {Animated} from 'react-native';
import Detail from './details';
export default class Pokemon {
  id: string;
  name: string;
  img: string;
  size: Animated.Value;
  type: string[] = [];
  num: string;
  height: string;
  weight: string;
  description: string;
  especie: string;
  stats: string;
  anatomia: string;
  evolutionList: string[] = [];

  constructor(
    id?: string,
    num?: string,
    name?: string,
    type?: string[],
    img?: string,
    detail?: Detail,
  ) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.type = type ? type : [];
    this.num = num;
    this.size = new Animated.Value(0);
    this.height = detail != null ? detail.height : null;
    this.weight = detail != null ? detail.weight : null;
    this.description = detail != null ? detail.description : null;
    this.especie = detail != null ? detail.especie : null;
    this.stats = detail != null ? detail.stats : null;
    this.anatomia = detail != null ? detail.anatomia : null;
    this.evolutionList = detail != null ? detail.evolutionList : null;
  }

  setDetails(detail?: Detail) {
    this.height = detail != null ? detail.height : null;
    this.weight = detail != null ? detail.weight : null;
    this.description = detail != null ? detail.description : null;
    this.especie = detail != null ? detail.especie : null;
    this.stats = detail != null ? detail.stats : null;
    this.anatomia = detail != null ? detail.anatomia : null;
    this.evolutionList = detail != null ? detail.evolutionList : null;
  }
}
