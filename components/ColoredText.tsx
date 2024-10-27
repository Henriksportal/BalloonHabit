import React from 'react';
import { Text, View } from 'react-native';

const ColoredText = () => {
  const text = 'Habit Balloon';
  const colors = [ '#2196F3', '#FDFD96', '#ffa164'];

  const coloredText = text.split('').map((char, index) => (
    <Text className="shadow-xl font-fatFont text-[38px] border2" key={index} style={{ color: colors[index % colors.length] }}>
      {char}
    </Text>
  ));

  return <View style={{ flexDirection: 'row' }}>{coloredText}</View>;
};

export default ColoredText;