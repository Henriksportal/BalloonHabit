import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BalloonSvg from '../assets/svg/BalloonSvg'
import { BlurView } from 'expo-blur';

type BalloonType = 'Daily' | 'Weekly' | 'Monthly' | null;

const BalloonRow = () => {
    const ropeAnimation = useRef(new Animated.Value(0)).current;
    const [selectedBalloon, setSelectedBalloon] = useState<BalloonType>(null);

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ropeAnimation, {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(ropeAnimation, {
              toValue: 0,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        ).start();
    }, []);

    const handleBalloonPress = (balloonType: BalloonType) => {
        setSelectedBalloon(balloonType);
    };

    const getBalloonColor = (type: BalloonType) => {
        switch (type) {
          case 'Daily':
            return '#FFEB3B';  // Yellow
          case 'Weekly':
            return '#FF9800';  // Orange
          case 'Monthly':
            return '#2196F3';  // Blue
          default:
            return '#FFFFFF';  // White
        }
    };
    
    return (
        <View className='flex-row justify-between'>
            {(['Daily', 'Weekly', 'Monthly'] as const).map((type) => (
                <TouchableOpacity key={type} onPress={() => handleBalloonPress(type)} className='items-center'>
                    <Text className=''>{type}</Text>
                    {selectedBalloon === type ? (
                        <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={getBalloonColor(type)} />
                    ) : (
                        <BlurView intensity={20} tint="light" style={{ borderRadius: 50, overflow: 'hidden' }}>
                            <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={getBalloonColor(type)} />
                        </BlurView>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default BalloonRow
