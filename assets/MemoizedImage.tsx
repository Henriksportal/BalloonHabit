import React, { useMemo } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

const backgroundImage = require('./photo2.png');

export const MemoizedBackgroundImage = React.memo(() => {
  const memoizedImage = useMemo(() => backgroundImage, []);

  return (
    <Image
      source={memoizedImage as ImageSourcePropType}
      style={{ transform: [{ scaleY: -1 }], flex: 1 }}
      resizeMode='cover'
      cache="force-cache"
    />
  );
});
