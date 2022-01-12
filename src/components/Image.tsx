import React from 'react';
import isNumber from 'lodash/isNumber';
import FastImage, {FastImageProps, Source} from 'react-native-fast-image';
import {Animated} from 'react-native';

const AnimatedImage = Animated.createAnimatedComponent(FastImage);

interface Props {
  source: string | undefined;
  fallbackSrc?: string | number | undefined;
}
const Image: React.FC<Partial<Omit<FastImageProps, 'source'>> & Props> = (
  props: Partial<Omit<FastImageProps, 'source'>> & Props,
) => {
  const {source, fallbackSrc} = props;
  let imageSource: number | {uri: string | number | undefined} = {
    uri: source || fallbackSrc,
  };

  if (isNumber(source) || (!source && isNumber(fallbackSrc))) {
    imageSource = (source || fallbackSrc) as number;
  }

  return (
    <AnimatedImage
      {...props}
      source={imageSource as number | Source}
      accessibilityRole={'image'}
    />
  );
};

export default Image;
