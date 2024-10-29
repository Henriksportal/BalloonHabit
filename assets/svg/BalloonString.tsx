import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

interface BalloonStringProps extends SvgProps {
  width?: number;
  height?: number;
}

const BalloonString: React.FC<BalloonStringProps> = ({ width = 800, height = 800, ...props }) => {
  return (
    <Svg width={width} height={height} viewBox="-0.5 -5 64 64" {...props}>
      <Path 
        d="M32.2 49.2v14"
        stroke="black"
        strokeWidth="0.5"
      />
      <Path 
        d="M31.5 49c0-.1 0 0 0 0" 
        fill="black"
      />
      <Path 
        d="M30.8 48h2.9c.9 0 .9-1.3 0-1.3h-2.9c-.9.1-.9 1.3 0 1.3" 
        fill="#b2c1c0"
      />
      {/* <Path 
        d="M30.1 50h4.3c1.4 0 1.4-1.9 0-1.9h-4.3c-1.4-.1-1.4 1.9 0 1.9" 
        fill="black"
      /> */}
    </Svg>
  );
};

export default BalloonString;
