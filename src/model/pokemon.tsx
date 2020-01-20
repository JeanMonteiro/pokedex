import {Animated} from 'react-native';
export default class Pokemon {
  id: string;
  name: string;
  img: string;
  size: Animated.Value;
  type: string[];
  num: string;

  constructor(id: string, num: string, name: string, type: string[], img?) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.type = type;
    this.num = num;
    this.size = new Animated.Value(0);
  }
}
