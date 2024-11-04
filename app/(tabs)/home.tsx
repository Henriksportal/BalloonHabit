import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, Image, ImageBackground  } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';

import { useGlobalContext } from "../../context/GlobalProvider";

import HeaderBalloonSvg from '../../assets/svg/HeaderBalloonSvg';
import DoggoSvg from '../../assets/svg/doggo';
import DogBalloonSvg from '../../assets/svg/dogBalloon';
import BalloonString from '../../assets/svg/BalloonString';


type habitType = {
  goal: string, 
  popped: number


}

const Home = () => {
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const swayAnimation = useRef(new Animated.Value(0)).current;
  const { goal, data, balloonArray } = useGlobalContext();

  const [lift, setLift] = useState(0)

  const useRefLift = useRef(0);

  const [poppedValue, setPoppedValue] = useState(0)
  const [balloonSize, setBalloonSize] = useState(40)



  const setLiftValue = (popval: number) => {

    const poppedBall = popval
    const ball = balloonArray[goal]?.length ?? 0
    const totalBalloon = poppedBall + ball
    
    //setLift((ball / totalBalloon) * 100)
    useRefLift.current = (ball / totalBalloon) * 100
   
  }

  useEffect(() => {
    updatePoppedBalloons()
   
    // const calculateBalloonSize = () => {
    const minSize = 40; // Minimum balloon siz
    const maxSize = 250; // Maximum balloon size
    
    if (useRefLift.current  >= 80) {
  
      // Calculate the percentage between 80 and 100
      const percentage = ((useRefLift.current  - 80) / 20) * 100;
      // Apply the percentage to maxSize
      return setBalloonSize((percentage / 100) * maxSize);
    } else {
      return setBalloonSize(minSize);
    }
    

    // };
    

    }, [balloonArray[goal] || data])
  



  
 const updatePoppedBalloons = async () => {
  try {
    let habitPopCount = 0;
   // console.log(goal, '--------goal check----------')
    // Calculate total popped count for habits under the specified goal
    data.forEach((habit: habitType) => {
      if (habit.goal === goal) {
        // console.log(habit.popped)
        habitPopCount += habit.popped;
      }
    });
    setLiftValue(habitPopCount)
    setPoppedValue(habitPopCount)
 // console.log(habitPopCount, '-------------------------check------------------------')
  } catch (error) {
    console.log('Error retrieving data:', error);
  } 
}


  // const getBalloonColor = (balloon: string) => {
  //   switch (balloon) {
  //     case "Daily":
  //       return "#FDFD96";
  //     case "Weekly":
  //       return "#ffa164";
  //     case "Monthly":
  //       return "#2196F3";
  //     default:
  //       return "black";
  //   }
  // }


  useEffect(() => {
    updatePoppedBalloons();
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
        <Text className='text-2xl font-textFontBase mt-5 italic  text-green-500 mr-2'>{balloonArray[goal]?.length || 0}</Text> 
        <Text className='text-base top-[4%] font-textFontBase mt-5 italic text-amber-950 '>Habit Completions</Text>
      </View>
      <View className='absolute top-[20%] self-start ml-5 flex-row '>
      <Text className='text-2xl font-textFontBase mt-5 italic  text-red-600 mr-2'>{poppedValue}</Text>
        <Text className='text-base top-[4%] font-textFontBase mt-5 italic text-red-600 '>Habit Pops</Text>
      </View>

      {balloonArray[goal]?.length ? (
        <View className='absolute top-[25%] self-start ml-5 flex-row '>
          <Text className={`text-2xl font-textFontBase mt-5 italic ${lift >= 80 ? "text-green-500" : "text-red-600"}  mr-2`}>{Math.round(lift) || 0}%</Text>
          <Text className='text-sm top-[4%] font-textFontBase mt-3 italic text-amber-950 opacity-80 '>Flying pug with 80% complition rate</Text>
        </View>
        ) : null}

      {lift > 80 ?(
      <View className='absolute bottom-[28%] z-11 self-center rounded-full'>
        <BalloonString height={100} width={100} />       
      </View>
      ) : null}
       {lift  > 80 ?(
      <View className='absolute bottom-[30%] self-center  z-11 '>
          <DogBalloonSvg height={balloonSize} width={balloonSize} />
          
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
 
  );
};

export default Home;
