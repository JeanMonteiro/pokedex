import React from 'react';
import isNumber from 'lodash/isNumber';
import {Animated, Image as RNImage, ImageProps} from 'react-native';

const AnimatedImage = Animated.createAnimatedComponent(RNImage);

interface Props {
  source: string | number | undefined;
  fallbackSrc?: string | number | undefined;
}

const Image: React.FC<Partial<Omit<ImageProps, 'source'>> & Props> = props => {
  const {source, fallbackSrc} = props;

  let imageSource: number | {uri: string | undefined} = {
    uri: typeof source === 'string' ? source : (fallbackSrc as string),
  };

  if (isNumber(source) || (!source && isNumber(fallbackSrc))) {
    imageSource = (source ?? fallbackSrc) as number;
  }

  return (
    <AnimatedImage
      {...props}
      source={imageSource as ImageProps['source']}
      accessibilityRole="image"
    />
  );
};

export default Image;
