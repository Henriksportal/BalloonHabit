import React, { useRef, useState } from 'react';
import { Animated, PanResponder, View, Text } from 'react-native';

const SwipeableView = ({ onSwipeLeft, onSwipeRight }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [swiping, setSwiping] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant:   
 () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(   

        [
          null, // First argument is the event
          { dx: pan.x, dy: pan.y }, // Second argument is the values to update
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          if (gestureState.dx > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
          pan.flattenOffset();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
        setSwiping(false);
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          transform: [{ translateX: pan.x }],
        },
        { backgroundColor: 'lightblue', width: 300, height: 200 },
      ]}
    >
      <Text>Hello</Text>
    </Animated.View>
  );
};

export default SwipeableView;