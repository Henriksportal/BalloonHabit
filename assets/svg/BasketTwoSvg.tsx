import React from 'react';
import Svg, { Path, Rect, G } from 'react-native-svg';

interface BasketTwoSvgProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}

const BasketTwoSvg: React.FC<BasketTwoSvgProps> = ({ width = 800, height = 800, fill = "#d5a158", stroke = "#7c3709" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 -6 32 32" fill={fill} stroke={'black'} strokeWidth={0.5}>
      <G>
        <Path fill="#7c3709" d="M29.78,15.37A1,1,0,0,0,29,15H3a1,1,0,0,0-1,1.21L4.68,28.63A3,3,0,0,0,7.62,31H24.38a3,3,0,0,0,2.94-2.37L30,16.21A1,1,0,0,0,29.78,15.37Z" />
        <Rect height="8" rx="1" ry="1" width="30" x="1" y="9" />
        <Path fill="#7c3709" d="M8,13a1,1,0,0,1-.86-.49l-6-10a1,1,0,1,1,1.72-1l6,10a1,1,0,0,1-.35,1.37A1,1,0,0,1,8,13Z" />
        <Path d="M10,26.5a1,1,0,0,1-1-1v-5a1,1,0,0,1,2,0v5A1,1,0,0,1,10,26.5Z" />
        <Path d="M16,26.5a1,1,0,0,1-1-1v-5a1,1,0,0,1,2,0v5A1,1,0,0,1,16,26.5Z" />
        <Path d="M22,26.5a1,1,0,0,1-1-1v-5a1,1,0,0,1,2,0v5A1,1,0,0,1,22,26.5Z" />
        <Path fill="#7c3709" d="M24,13a1,1,0,0,1-.51-.14,1,1,0,0,1-.35-1.37l6-10a1,1,0,1,1,1.72,1l-6,10A1,1,0,0,1,24,13Z" />
      </G>
    </Svg>
  );
};

export default BasketTwoSvg;
