import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet, Button  } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';

import BalloonSvg from '../../assets/svg/BalloonSvg';
import AvatarSvg from '../../assets/svg/AvatarSvg';

import BasketTwoSvg from '../../assets/svg/BasketTwoSvg';
import BasketBalloonSvg from '../../assets/svg/BasketBalloonSvg';
import BasketBalloonNoRope from '../../assets/svg/BasketBalloonNoRope';
// import RopeBalloonAngelOne from '../../assets/svg/RopeBalloonAngelOne'
import RopeBalloonAngelTwo from '../../assets/svg/RopeBalloonAngelTwo'
import RopeBalloonAngelOne from '../../assets/svg/RopeBalloonAngelOne'

import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CircleChain from '../../components/CircleChain';
import { useGlobalContext } from "../../context/GlobalProvider";

import HeaderBalloonSvg from '@/assets/svg/HeaderBalloonSvg';


const Home = () => {
  const danceparty = ['hello', 'yellow'];
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const swayAnimation = useRef(new Animated.Value(0)).current;
  const { goal, data, balloonArray, checkPop, refetch } = useGlobalContext();
  const scrollViewRef = useRef<ScrollView>(null);



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
        return "black"; // Default color if the type is not recognized
    }
  }


  const calculateScrollPosition = () => {
    if (balloonArray[goal] === undefined || balloonArray[goal].length === 0) {
      return 0;
    }
    const maxScroll = 0.95; // 95% from the top
    const scrollPercentage = Math.min(balloonArray[goal].length / 20, maxScroll);
    return scrollPercentage;
  }

  useEffect(() => {
    // console.log(balloonArray)
    if (scrollViewRef.current) {
      const scrollPosition = calculateScrollPosition();
      scrollViewRef.current.scrollTo({ y: scrollPosition * 1000, animated: true });
    }
  }, [goal]);

  const balloonPositionStyle = ["top-[86%] left-[37%]",  "top-[86%] left-[51%]", " top-[78%] left-[40%]", "top-[78%] left-[49%]", // bottom level 1  RopeBalloon  @4 ----------O
  "top-[70%] left-[39%]", "top-[84%] left-[47%]", "top-[82%] left-[50%]",  "top-[82%] left-[54%]", "top-[82%] left-[35%]", // level 2 @9
  "top-[78%] left-[40%]", "top-[78%] left-[45%]", "top-[78%] left-[50%]", "top-[78%] left-[55%]", "top-[78%] left-[35%]", // level 3  @14
  "top-[74%] left-[40%]", "top-[74%] left-[50%]", "top-[74%] left-[45%]", // level 4 @17
  ]


  const Balloons = () => {
    const balloons = [];
    if(balloonArray[goal]?.length) {
      for (let index = 0; index < 5; index++) {
       // console.log(balloonArray[goal][index]?.type, '-----------')
        if(index === 0) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
              <BasketBalloonSvg color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}/>
            </View>
          );
        } else if (index === 1) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
              <BasketBalloonSvg  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}/>
            </View>
          );
        } else if (index === 2) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
              <RopeBalloonAngelOne  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`} width={17.946}  x={240} y={380}  ropeLength={550} transform="rotate(15)"/>
            </View>
          );
        } else if (index === 3) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
            <RopeBalloonAngelOne  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}   width={17.946} ropeLength={550} transform="rotate(-10)" />
          </View>
          );
        } else if (index === 4) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
            <RopeBalloonAngelOne  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}   width={17.946} ropeLength={700} transform="rotate(6)" />
          </View>
          );
        } else if (index === 5) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
            <RopeBalloonAngelOne  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}   width={17.946} ropeLength={600} transform="rotate(-11)" />
          </View>
          );
        } else if (index === 6) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
              <RopeBalloonAngelTwo  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`} x={240} y={380} width={17.946} height={800} transform="rotate(-2)" />
            </View>
          );

        } else if (index === 29) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center z-10 opacity-75`}>
              <RopeBalloonAngelTwo  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`} x={240} y={380} width={17.946} height={550} transform="rotate(-18)" />
            </View>
          );

        } else if (index === 45) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center opacity-75`}>
              <RopeBalloonAngelTwo color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}  x={240} y={380} width={17.946} height={700} transform="rotate(30)" />
            </View>
          ); 
        } else if (index === 46) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center opacity-75`}>
              <RopeBalloonAngelTwo color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}  x={240} y={380} width={17.946} height={700} transform="rotate(-30)" />
            </View>
          ); 
        }
        else if (index === 68) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center opacity-75`} >
              <RopeBalloonAngelTwo color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}  x={240} y={380} width={17.946} height={700} transform="rotate(40)" />
            </View>
          ); 
        }
        else if (index ===69) {
          balloons.push(
            <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center opacity-75`}>
              <RopeBalloonAngelTwo color={`${getBalloonColor(balloonArray[goal][index]?.type)}`}  x={240} y={380} width={17.946} height={700} transform="rotate(-40)" />
            </View>
          ); 
        }
        else {
          balloons.push(
          <View key={index} className={`absolute ${balloonPositionStyle[index]} self-center opacity-75`} >
            <BasketBalloonNoRope ropeAnimation={ropeAnimation}  color={`${getBalloonColor(balloonArray[goal][index]?.type)}`} transform="rotate(0)"/>
          </View>
          );
        }
      }
    } else {
      null
    }
    return balloons;
  }

  //animation useEffect
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

    // Sway animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnimation, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnimation, {
          toValue: -0.15,
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
      {/* BackGround Image  */}
      <ScrollView 
        ref={scrollViewRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={{ transform: [{ scaleY: -1 }] }}
      >
        <MemoizedBackgroundImage />
      </ScrollView>
      {/* BackGround Image End */}

      {/* Header Text  */}
      <View className='absolute w-full'>
        <View className='mt-5'>
          <View className='flex-row'>
            <Text className='ml-5 mt-10 text-3xl font-fatFont text-amber-950'>Home</Text>
            
            {/* Balloon that directs user to Create Habit page */}
            <TouchableOpacity onPress={handleCreatePress} className='absolute mt-5 self-start left-[75%]'>
              <HeaderBalloonSvg style={{ width: 80, height: 80 }} />
              
              <Text className='absolute self-center top-[28%] text-xs text-center font-bubbleFont text-amber-950 '>{`Goals`}</Text>
            </TouchableOpacity>
          </View>
          {/* Balloon that directs user to Create Habit page END */}

          <Text className='ml-5 text-[18px] font-balloonFont text-amber-950'>{goal}</Text>
        </View>
        {/* <Button title='All Data' onPress={(() => {
          refetch();
          console.log(data, "Mean Mad White Man")
          //  getAllData();
        })}/>   */}
      </View>


      <View className='absolute top-[15%] self-start ml-5 flex-row'>
        
        <Text className='text-2xl font-textFontBase mt-5 italic w-[10%] text-amber-950'>{balloonArray[goal]?.length || 0}</Text>
        <Text className='text-base top-[4%] font-textFontBase mt-5 italic text-amber-950 '>Habit Completions</Text>
      </View>

      <View className='absolute bottom-40 w-[80%] h-[50%]  self-center rounded-full ' >
        <Balloons />
      </View>

      <View className='absolute bottom-1 self-center rounded-lg'>
        {/* <CircleChain /> */}
        <AvatarSvg width={60} height={70} />
        <Animated.View style={{
          transform: [{ rotate: swayInterpolation }],
          bottom: 80,
          alignSelf: 'center'
        }}>
          <BasketTwoSvg width={40} height={82}/>
          
        </Animated.View>

      </View>
    </View>
  );
};

export default Home;
