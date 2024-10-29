import * as React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

interface DogBalloonSvgProps extends SvgProps {
  width?: number;
  height?: number;
}

const AnimatedG = Animated.createAnimatedComponent(G);

const DogBalloonSvg: React.FC<DogBalloonSvgProps> = ({ width = 800, height = 800, ...props }) => {
  const swayAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(swayAnimation, {
            toValue: -1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  const translateX = swayAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-2, 2]
  });

  return (
    <Svg width={width} height={height} viewBox="11 2 40 45" {...props}>
      <AnimatedG x={translateX}>
        <Path 
          d="M52 22.5c0 11.3-8.8 24.4-19.8 24.4c-10.9 0-19.8-13-19.8-24.4C12.5 11.2 21.3 2 32.2 2C43.2 2 52 11.2 52 22.5" 
          fill="#ed4c5c"
        />

      </AnimatedG>
    </Svg>
  );
};

export default DogBalloonSvg;
