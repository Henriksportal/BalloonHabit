import { View, Text, ScrollView, Animated, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BalloonSvg from '../../assets/svg/BalloonSvg';
import { router } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface HabitData {
  id: string;
  name: string;
  completed: boolean;
  type: 'Daily' | 'Weekly' | 'Monthly';
}


const Stats = () => {
  const { 
    goal, 
    data, 
    balloonArray
  } = useGlobalContext();

  
  const [dailyCompleted, setDailyCompleted] = useState(0)
  const [weeklyCompleted, setWeeklyCompleted] = useState(0)
  const [monthlyCompleted, setMonthlyCompleted] = useState(0)
  
  // const [habits, setHabits] = useState<Habit[]>([]);
  const ropeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try {
      let dailyCount = 0;
      let weeklyCount = 0;
      let monthlyCount = 0;

      for (let i = 0; i < balloonArray[goal].length; i++) {
        const type = balloonArray[goal][i]; 
        switch (type) {
          case "Daily":
            dailyCount++;
            break;
          case "Weekly":
            weeklyCount++;
            break;
          case "Monthly":
            monthlyCount++;
            break;
          default:
            // Handle other possible types or ignore them
            break;
        }
      }
      setDailyCompleted(dailyCount);
      setWeeklyCompleted(weeklyCount);
      setMonthlyCompleted(monthlyCount);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  }, [data]);

  return (
    <View className="flex-1">
      {/* BackGround Image  */}
      <ScrollView 
        className="absolute w-full h-full"
        style={{ transform: [{ scaleY: -1 }] }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <MemoizedBackgroundImage />
      </ScrollView>
      {/* BackGround Image End */}

      <View className='mt-5 justify-items'>
        <View className='flex-row'>
          <Text className='ml-5 mt-10 text-3xl '>Stats</Text>

          <View className='absolute mt-5 left-[70%]'>
            <TouchableOpacity onPress={() => router.push('/progress')}>
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }}  />
              <Text className='absolute mt-6 left-[34%] text-xs font-bold'>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className='ml-5 italic font-extralight'>{goal}</Text>
      </View>

      <View>
        <View className='flex-row absolute top-8 right-10'>
          <View className=''>
            <Text className="text-lg">Completed </Text>
          </View>
          <View className='ml-5'>
            <Text className="text-lg"> Popped</Text>
          </View>
        </View>
      
        <View className='flex-row'>
          <Text className="text-xl font-bold top-28 ml-5">Daily</Text>

          <View className='flex-row top-20 ml-8'>
            <View className="top-4">
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={"yellow"}/>
              <Text className="absolute self-center top-4 text-2xl font-bold">{dailyCompleted}</Text>
            </View>

            <View className="top-4">
              <BalloonSvg ropeAnimation={ropeAnimation}  style={{ width: 100, height: 100 }} color={"yellow"}/>
              <Text className="absolute self-center top-4 text-2xl font-bold">{}</Text>
            </View>
          </View>
        </View> 
      
        <View className="flex-row ">
          <Text className="text-xl font-bold top-36 ml-5">Weekly</Text>
          
          <View className='flex-row top-28 ml-4'>
            <View className="top-4 ">
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={"orange"}/>
              <Text className="absolute self-center top-4 text-2xl font-bold">{weeklyCompleted}</Text>
            </View>

            <View className="top-4">
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={"orange"} />
              <Text className="absolute self-center top-4 text-2xl font-bold">{}</Text>
            </View>
          </View>
        </View> 

        <View className="flex-row">
          <Text className="text-xl font-bold top-48 ml-5">Monthly</Text>
          
          <View className='flex-row top-40 ml-4'>
            <View className="top-4 ">
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={"blue"}/>
              <Text className="absolute self-center top-4 text-2xl font-bold">{monthlyCompleted}</Text>
            </View>

            <View className="top-4">
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={"blue"}/>
              <Text className="absolute self-center top-4 text-2xl font-bold">{}</Text>
            </View>
          </View>
        </View> 
      </View>
    </View>
  );
};

export default Stats;
