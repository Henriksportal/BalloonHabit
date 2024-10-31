import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, Image, ImageBackground  } from 'react-native';
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
  const { goal, data, balloonArray, poppedBalloonArray } = useGlobalContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const [lift, setLift] = useState(0)

  const calculateBalloonSize = () => {
    const minSize = 40; // Minimum balloon size
    const maxSize = 250; // Maximum balloon size
    
    if (lift >= 80) {
      // Calculate the percentage between 80 and 100
      const percentage = ((lift - 80) / 20) * 100;
      // Apply the percentage to maxSize
      return (percentage / 100) * maxSize;
    }
    
    return minSize;
  };

  useEffect(() => {
    const poppedBall = poppedBalloonArray[goal]?.length ?? 0
    const ball = balloonArray[goal]?.length ?? 0
    const totalBalloon = poppedBall + ball
    console.log(poppedBall, ball, totalBalloon)

    setLift((ball / totalBalloon) * 100)
  }, [data])


  console.log(lift, "------------------------------")

  // const getAllData = async () => {
  //   try {
  //     const allKeys = await AsyncStorage.getAllKeys();
  //     const allData: Record<string, string | null> = {};
  //     for (const key of allKeys) {
  //       const value = await AsyncStorage.getItem(key);
  //       allData[key] = value;
  //     }
  //     console.log('All data:', allData);
  //   } catch (error) {
  //     console.error('Error retrieving all data:', error);
  //   }
  // };

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

  // const calculateScrollPosition = () => {
  //   if (balloonArray[goal] === undefined || balloonArray[goal].length === 0) {
  //     return 0;
  //   }
  //   const maxScroll = 0.95;
  //   const scrollPercentage = Math.min(balloonArray[goal].length / 20, maxScroll);
  //   return scrollPercentage;
  // }

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     const scrollPosition = calculateScrollPosition();
  //     scrollViewRef.current.scrollTo({ y: scrollPosition * 1000, animated: true });
  //   }
  // }, [balloonArray[goal]]);

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

    <ImageBackground
    source={require('./../../assets/backgroundImgSvgTwo.png')}
    className='flex-1'
    resizeMode='cover'>

    <Image 
    source={require('./../../assets/foregroundImg.png')}
    className="h-[96%] w-[200%] absolute top-[40%] self-center"
    resizeMode='contain'
    />
    
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
      <View className='absolute top-[20%] self-start ml-5 flex-row '>
      <Text className='text-2xl font-textFontBase mt-5 italic  text-red-600 mr-2'>{poppedBalloonArray[goal]?.length || 0}</Text>
        <Text className='text-base top-[4%] font-textFontBase mt-5 italic text-red-600 '>Habit Pops</Text>
      </View>
      <View className='absolute top-[25%] self-start ml-5 flex-row '>
      <Text className={`text-2xl font-textFontBase mt-5 italic ${lift >= 80 ? "text-green-500" : "text-red-600"}  mr-2`}>{lift}%</Text>
        <Text className='text-sm top-[4%] font-textFontBase mt-3 italic text-amber-950 opacity-80 '>Happy pug with 80% {">="} complition rate</Text>
      </View>
      {lift > 80 ?(
      <View className='absolute bottom-[28%] z-11 self-center rounded-full'>
        <BalloonString height={100} width={100} />       
      </View>
      ) : null}
       {lift  > 80 ?(
      <View className='absolute bottom-[30%] self-center  z-11 '>
          <DogBalloonSvg height={calculateBalloonSize()} width={calculateBalloonSize()} />
          
      </View>
         ) : null}
        {lift > 80 ? (
          <View className='absolute  self-center top-[71%] '>
              <DoggoSvg width={40} height={40}/>
          </View>
          ) : (
            <View className='absolute  self-center top-[81%] '>
              <DoggoSvg width={40} height={40}/>
            </View>
          )}
        
    </ImageBackground>
    // {/* </View> */}
  );
};

export default Home;
