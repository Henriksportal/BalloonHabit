import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { Animated, ViewStyle } from 'react-native';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface CreateHabitBalloonSvgProps {
  style?: ViewStyle;
  ropeAnimation: Animated.Value;
  color?: string;
}

const CreateHabitBalloonSvg: React.FC<CreateHabitBalloonSvgProps> = ({ 
  style, 
  ropeAnimation,
  color = "#000000" 
}) => {
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
      viewBox="0 0 512 512"
      style={[style, animatedStyle]}
    >
      <G>
        <G>
          <Path
            d="M436.706,180.706c0-53.245-18.359-98.924-53.092-132.098C350.795,17.262,305.474,0,256,0s-94.795,17.262-127.614,48.608
            c-34.733,33.174-53.092,78.853-53.092,132.098c0,102.191,67.768,192.458,153.636,208.341l-12.276,28.647
            c-1.328,3.101-1.011,6.463,0.847,9.284c1.858,2.813,5.006,4.314,8.381,4.314h20.359v70.669c0,5.544,4.495,10.039,10.039,10.039
            c5.544,0,10.039-4.495,10.039-10.039v-70.669h19.798c3.375,0,6.523-1.5,8.381-4.314c1.858-2.821,2.175-6.282,0.847-9.382
            l-12.276-28.598C368.937,373.115,436.706,282.897,436.706,180.706z M267.747,370.914c-3.2,0.292-6.066,2.098-7.711,4.858
            s-1.869,5.946-0.604,8.895l11.461,26.546h-29.787l11.461-26.546c1.265-2.949,1.041-6.233-0.604-8.993
            c-1.645-2.76-4.511-4.517-7.711-4.809c-82.093-7.495-148.88-92.799-148.88-190.184c0-94.576,66.053-160.615,160.627-160.615
            s160.627,66.059,160.627,160.632C416.627,278.083,349.841,363.419,267.747,370.914z"
            fill={color}
          />
        </G>
      </G>
    </AnimatedSvg>
  );
};

export default CreateHabitBalloonSvg;