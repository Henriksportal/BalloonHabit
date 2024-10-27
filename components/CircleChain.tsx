import React, { useRef, useState } from 'react';
import { View, Animated, Text, TouchableOpacity } from 'react-native';

const CircleChain = () => {
  const circleSize = 20; // Adjust the size of the circles
  const containerSize = 300; // Adjust the size of the container
  const [circleCount, setCircleCount] = useState(10); // State to manage the number of circles
  const [circles, setCircles] = useState(() => {
    const initialCircles = Array.from({ length: circleCount }, (_, index) => ({
      x: (circleSize * 2 * index) % containerSize, // Calculate x-position based on index
      y: containerSize - circleSize,
      animatedX: new Animated.Value(0),
      animatedY: new Animated.Value(0),
    }));
    return initialCircles;
  });

  const startAnimations = () => {
    circles.forEach((circle, index) => {
      const delay = index * 500; // Adjust delay for staggered animations
      Animated.timing(circle.animatedY, {
        toValue: -containerSize + circleSize,
        duration: 2000,
        delay,
        useNativeDriver: false,
      }).start();
    });
  };

  const addCircle = () => {
    setCircleCount(circleCount + 1);
    const newCircle = {
      x: (circleSize * 2 * (circles.length - 1)) % containerSize,
      y: containerSize - circleSize,
      animatedX: new Animated.Value(0),
      animatedY: new Animated.Value(0),
    };
    setCircles([...circles, newCircle]);
    startAnimations();
  };

  return (
    <View style={{ width: containerSize, height: containerSize, backgroundColor: 'lightblue' }}>
      <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
        {circles.map((circle, index) => (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: 'blue',
              transform: [{ translateX: circle.x }, { translateY: circle.animatedY }],
            }}
          />
        ))}
      </View>
      <TouchableOpacity onPress={addCircle}>
        <Text>Add Circle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CircleChain;