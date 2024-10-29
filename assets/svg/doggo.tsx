import * as React from 'react';
import Svg, { Path, G, Ellipse } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

interface DoggoSvgProps extends SvgProps {
  width?: number;
  height?: number;
}
//#947151

const DoggoSvg: React.FC<DoggoSvgProps> = ({ width = 800, height = 800, ...props }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" {...props}>
      <Path d="M14.1 46.2C8 45.7 3 38 3 38c0 9.5 8.4 13 12.2 11.7c3.4-1.1-1.1-3.5-1.1-3.5z" fill="rgb(69 26 3)" />
      <Path d="M41.3 56c1.7 2 9.5 0 10.8-2.3c5.1-9.5 0-15.6 0-15.6l-10.8 3.3c0 .1-2.2 12.1 0 14.6" fill="#eabc92" />
      <Path d="M34 60.4c1.9 2.2 8.8 2.1 10.8 0c3-3 2.8-16.7 3-23.3L35.1 36S31.6 57.5 34 60.4" fill="#f5d1ac" />
      <Path d="M26.7 56c-1.7 2-9.5 0-10.8-2.3c-5.1-9.5 0-15.6 0-15.6l10.8 3.3c0 .1 2.3 12.1 0 14.6" fill="#eabc92" />
      <Path d="M34.1 60.4c-1.9 2.2-8.8 2.1-10.8 0c-3-3-2.8-16.7-3-23.3L33 36s3.5 21.5 1.1 24.4" fill="#f5d1ac" />
      <Path d="M34 60.5c-.3-2.1-.4-4.2-.4-6.3c0-2.1.1-4.2.4-6.3c.3 2.1.4 4.2.4 6.3c0 2.1-.1 4.2-.4 6.3" fill="#423223" />
      <Path d="M34 46.5c-10.2 0-15.4-4-15.4-4S22 51.6 34 51.6s15.4-9.1 15.4-9.1s-5.2 4-15.4 4" fill="#3e4347" />
      <Path d="M31.1 49c0-1.4.6-2.5 1.3-2.6c-.2-.2-.5-.3-.7-.3c-.9 0-1.6 1.3-1.6 2.9c0 1.6.7 2.9 1.6 2.9c.3 0 .5-.2.7-.4c-.7 0-1.3-1.1-1.3-2.5" fill="#ffffff" />
      <Path d="M19.5 43C13.4 39.2 11 24.3 13 17.6c1.5-5 7-12.4 12-14.4c4.2-1.6 13.9-1.6 18.1 0c5 1.9 10.6 9.3 12 14.4c2 6.8.5 21.6-5.6 25.4c-12.8 8-17.2 8-30 0" fill="#f5d1ac" />
      <Path d="M9.9 19.1c3.2 6.9 4 7.2 7.1-1c1.6-4.4.5-7 2.4-9.8c1.1-1.6 3.5-4.1 3.5-4.1S3.7 6.1 9.9 19.1" fill="#423223" />
      <Path d="M18 3.9c-4.8 3-15.1 1.8-9 14.8c3.2 6.9 4 7.2 7.1-1c1.6-4.4.5-7 2.4-9.8c1.1-1.6 4.4-3.7 4.4-3.7s-1.5-2.4-4.9-.3" fill="rgb(69 26 3)" />
      <Path d="M58.2 19.1c-3.2 6.9-4 7.2-7.1-1c-1.6-4.4-.5-7-2.4-9.8c-1.1-1.6-3.5-4.1-3.5-4.1s19.2 1.9 13 14.9" fill="#423223" />
      <Path d="M50.1 3.9c4.8 3 15.2 1.8 9.1 14.8c-3.2 6.9-4 7.2-7.1-1c-1.6-4.4-.5-7-2.4-9.8c-1.1-1.6-4.4-3.7-4.4-3.7s1.4-2.4 4.8-.3" fill="rgb(69 26 3)" />
      <Path d="M21.2 19.2c3 0 5.4 2.3 5.4 5.2s-2.4 5.2-5.4 5.2c-3 0-5.4-2.3-5.4-5.2s2.5-5.2 5.4-5.2" fill="#ffffff" />
      <Ellipse cx="19.9" cy="24.4" rx="4" ry="3.9" fill="#3e4347" />
      <Path d="M52.2 24.4c0 2.9-2.4 5.2-5.4 5.2c-3 0-5.4-2.3-5.4-5.2s2.4-5.2 5.4-5.2c3 0 5.4 2.3 5.4 5.2" fill="#ffffff" />
      <Ellipse cx="48.2" cy="24.4" rx="4" ry="3.9" fill="#3e4347" />
      <Path d="M24.8 40.1l4.2 4.2c2.5 2.5 7.7 2.5 10.2 0l4.2-4.2l-4.4-4.3h-9.9l-4.3 4.3" fill="#7d644b" />
      <Path d="M34 32.1s-4.4 6.1-3.8 9c.7 4.2 7 4.2 7.7 0c.5-2.9-3.9-9-3.9-9" fill="#f15a61" />
      <Path d="M34 42.7l1-5.9h-1.9l.9 5.9" fill="#ba454b" />
      <Path fill="#423223" d="M29.5 33.8h9v4h-9z" />
      <Path d="M48.3 34.7l-6.4-6.5c-3.9-3.9-11.8-3.9-15.6 0l-6.4 6.5c-1.8 1.8-1.8 4.8 0 6.7c1.8 1.8 4.8 1.8 6.6 0l6.4-6.5c.6-.6 1.8-.6 2.4 0l6.4 6.5c1.8 1.8 4.8 1.8 6.6 0c1.8-1.8 1.8-4.8 0-6.7" fill="#947151" />
      <G fill="#3e4347">
        <Path d="M28.7 28.7c0-2.3 2.4-2.7 5.3-2.7s5.3.4 5.3 2.7c0 1.8-4.2 3.4-5.3 3.4c-1 0-5.3-1.6-5.3-3.4" />
        <Path d="M27.1 30.7l-.9.9l.9.9l.9-.9z" />
        <Path d="M25 33.1l-.9.9l.9.9l.9-.9z" />
        <Path d="M27.8 34l-.9.9l.9.9l.9-.9z" />
        <Path d="M41 30.7l.9.9l-.9.9l-.9-.9z" />
        <Path d="M43.1 33.1l.9.9l-.9.9l-.9-.9z" />
        <Path d="M40.3 34l.9.9l-.9.9l-.9-.9z" />
      </G>
    </Svg>
  );
};

export default DoggoSvg;
