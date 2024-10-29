import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet, Button  } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';

import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from "../../context/GlobalProvider";

import HeaderBalloonSvg from '../../assets/svg/HeaderBalloonSvg';
import DoggoSvg from '../../assets/svg/doggo';
import DogBalloonSvg from '../../assets/svg/dogBalloon';
import BalloonString from '@/assets/svg/BalloonString';


const Home = () => {
  const danceparty = ['hello', 'yellow'];
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const swayAnimation = useRef(new Animated.Value(0)).current;
  const { goal, data, balloonArray, checkPop, refetch } = useGlobalContext();
  const scrollViewRef = useRef<ScrollView>(null);

  const calculateBalloonSize = () => {
    const minSize = 40; // Minimum balloon size
    const maxSize = 800; // Maximum balloon size
    const baseSize = 0; // Starting size
    const growthFactor = 1.5; // How much to grow per item in array
    
    if (!balloonArray[goal] || balloonArray[goal].length === 0) {
      return minSize;
    }
    
    const calculatedSize = baseSize + (balloonArray[goal].length * growthFactor);
    return Math.min(Math.max(calculatedSize, minSize), maxSize);
  };

  const getAllData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData: Record<string, string | null> = {};
      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        allData[key] = value;
      }
      console.log('All data:', allData);
    } catch (error) {
      console.error('Error retrieving all data:', error);
    }
  };

  const getBalloonColor = (balloon: string) => {
    switch (balloon) {
      case "Daily":
        return "#FDFD96";
      case "Weekly":
        return "#ffa164";
      case "Monthly":
        return "#2196F3";
      default:
        return "black";
    }
  }

  const calculateScrollPosition = () => {
    if (balloonArray[goal] === undefined || balloonArray[goal].length === 0) {
      return 0;
    }
    const maxScroll = 0.95;
    const scrollPercentage = Math.min(balloonArray[goal].length / 20, maxScroll);
    return scrollPercentage;
  }

  useEffect(() => {
    if (scrollViewRef.current) {
      const scrollPosition = calculateScrollPosition();
      scrollViewRef.current.scrollTo({ y: scrollPosition * 1000, animated: true });
    }
  }, [balloonArray[goal]]);

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnimation, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleCreatePress = () => {
    router.push({
      pathname: '/',
    });
  };

  const swayInterpolation = swayAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg']
  });
 
  return (
    <View className='flex-1'>
      <ScrollView 
        ref={scrollViewRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={{ transform: [{ scaleY: -1 }] }}
      >
        <MemoizedBackgroundImage />
      </ScrollView>

      <View className='absolute w-full'>
        <View className='mt-5'>
          <View className='flex-row'>
            <Text className='ml-5 mt-10 text-3xl font-fatFont text-amber-950'>Home</Text>
            
            <TouchableOpacity onPress={handleCreatePress} className='absolute mt-5 self-start left-[75%]'>
              <HeaderBalloonSvg style={{ width: 80, height: 80 }} />
              <Text className='absolute self-center top-[28%] text-xs text-center font-bubbleFont text-amber-950 '>{`Goals`}</Text>
            </TouchableOpacity>
          </View>

          <Text className='ml-5 text-[18px] font-balloonFont text-amber-950'>{goal}</Text>
        </View>
      </View>

      <View className='absolute top-[15%] self-start ml-5 flex-row '>
        <Text className='text-2xl font-textFontBase mt-5 italic  text-amber-950 mr-2'>{balloonArray[goal]?.length || 0}</Text>
        <Text className='text-base top-[4%] font-textFontBase mt-5 italic text-amber-950 '>Habit Completions</Text>
      </View>
      {balloonArray[goal]?.length > 0 ?(
      <View className='absolute bottom-[20%] z-11 self-center rounded-full'>
        <BalloonString height={100} width={100} />       
      </View>
      ) : null}
      <View className='absolute bottom-[22.7%] self-center opacity-90 z-11 '>
          <DogBalloonSvg height={calculateBalloonSize()} width={calculateBalloonSize()} />
      </View>

      <View className='absolute top-[25%] self-center rounded-lg'>
        
        <Animated.View style={{
          transform: [{ rotate: swayInterpolation }],
          alignSelf: 'center'
        }}>

          <DoggoSvg width={40}/>
        </Animated.View>
      </View>
    </View>
  );
};

export default Home;
