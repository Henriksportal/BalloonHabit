import * as React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

interface DogBalloonSvgProps extends SvgProps {
  width?: number;
  height?: number;
}



const DogBalloonSvg: React.FC<DogBalloonSvgProps> = ({ width = 800, height = 800, ...props }) => {



  return (
    <Svg width={width} height={height} viewBox="10 1.5 44 46" {...props}>
     
        <Path 
          d="M52 22.5c0 11.3-8.8 24.4-19.8 24.4c-10.9 0-19.8-13-19.8-24.4C12.5 11.2 21.3 2 32.2 2C43.2 2 52 11.2 52 22.5" 
          fill="#ed4c5c"
        />
    </Svg>
  );
};

export default DogBalloonSvg;
