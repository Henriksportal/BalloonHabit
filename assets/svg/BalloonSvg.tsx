import * as React from "react";
import Svg, { G, Path, Line } from "react-native-svg";
import { Animated, ViewStyle, Pressable } from 'react-native';
import { router } from 'expo-router';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface BalloonSvgProps {
  style?: ViewStyle;
  ropeAnimation: Animated.Value;
  color?: string;
}

const BalloonSvg: React.FC<BalloonSvgProps> = ({ style, ropeAnimation, color = "#FFFFFF" }) => {
  const animatedStyle = {
    transform: [
      {
        rotate: ropeAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['-5deg', '5deg'],
        }),
      },
    ],
  };

  return (
    
      <AnimatedSvg
        viewBox="15 0 60 80"
        style={[style, animatedStyle]}
      >
        <G>
          
          <Path
            d="M49.999,0C38.418,0,29.03,10.641,29.03,23.767c0,13.127,9.388,32.372,20.969,32.372c11.583,0,20.972-19.244,20.972-32.372    C70.971,10.641,61.582,0,49.999,0z M37.242,21.278c-1.019,4.598-0.817,10.436,0.496,15.751c-2.178-4.452-3.486-9.56-3.486-13.819    c0-9.958,7.122-18.028,15.906-18.028c1.063,0,2.101,0.121,3.105,0.346C45.802,6.43,39.154,12.631,37.242,21.278z"
            fill={color}
            stroke={'black'}
            strokeWidth={0.1}
          />
          <Path
            d="M49.454,60.854h1.657c1.423-0.028,1.752-0.726,0.99-1.498c-0.59-0.597-0.621-1.594-0.565-2.256h-2.504    c0.055,0.662,0.022,1.659-0.568,2.256C47.698,60.128,48.031,60.824,49.454,60.854z"
            fill={color}
            stroke={'black'}
            strokeWidth={0.1}
          />
          {/* <Line
            x1="50"
            y1="56"
            x2="50"
            y2="80"
            stroke="#000000"
            strokeWidth="2"
          /> */}
        </G>
      </AnimatedSvg>
 
  );
};

export default BalloonSvg;
