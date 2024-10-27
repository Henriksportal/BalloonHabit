import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, FlatList, Button, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BalloonSvg from '../../assets/svg/BalloonSvg';

import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHabits from '../../components/RenderHabits';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RenderHabitAlter from '../../components/RenderHabitAlter';
import { useGlobalContext } from "../../context/GlobalProvider";

interface Habit {
  id: string;
  type: "Daily" | "Weekly" | "Monthly";
  status: boolean;
  completed: number;
  description: string;
  startDate: string;
  createdAt: string;
  goal: string;
  popped: number;
}

const EditHabit = () => {
  const danceparty = ['hello', 'yellow'];
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const [habitType, setHabitType] = useState<"Daily" | "Weekly" | "Monthly">("Daily")

  const [dailyPress, setDailyPress] = useState(true)
  const [weeklyPress, setWeeklyPress] = useState(false)
  const [monthlyPress, setMonthlPress] = useState(false)
  const [balloonColor, setBalloonColor] = useState("yellow")
  const { goal } = useGlobalContext();

  const [data, setData] = useState<Habit[]>([]);
  const refetch = useRef(() => {});

  const handleDailyPress = () => {
    setHabitType("Daily")
    setDailyPress(true)
    setWeeklyPress(false)
    setMonthlPress(false)
    setBalloonColor("yellow")
  }

  const handleWeeklyPress = () => {
    setHabitType("Weekly")
    setDailyPress(false)
    setWeeklyPress(true)
    setMonthlPress(false)
    setBalloonColor("orange")
  }

  const handleMonthlyPress = () => {
    setHabitType("Monthly")
    setDailyPress(false)
    setWeeklyPress(false)
    setMonthlPress(true)
    setBalloonColor("blue")
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('habits');
        if (value !== null) {
          const habits: Habit[] = JSON.parse(value);
          setData(habits);
        } else {
          console.log('No habits found in AsyncStorage');
        }
      } catch (error) {
        console.log('Error retrieving habits:', error);
      }
    };

    refetch.current = getData;
    getData();
  }, []);

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

  const handleCreatePress = () => {
    router.push({
      pathname: '/createhabit',
    });
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(habit => habit.id !== id);
    setData(updatedData);
    AsyncStorage.setItem('habits', JSON.stringify(updatedData));
  };

  const Item = ({ item }: { item: Habit }) => {
    return (
      <View className=''>
        <View className="rounded-lg shadow-md p-4 mb-4 border-b-2 flex-row">
          <RenderHabitAlter data={item} onDelete={() => handleDelete(item.id)} />
          <Animated.View style={{
            position: 'absolute',
            right: 10,
            top: '50%',
          }}>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View className='flex-1'>
      <ScrollView bounces={false}
      style={{ transform: [{ scaleY: -1 }] }}
      showsVerticalScrollIndicator={false}>
        <MemoizedBackgroundImage />
      </ScrollView>

      <View className='absolute w-full'>
        <View className='mt-5'>
          <View className='flex-row'>
            <Text className='ml-5 mt-10 text-3xl'>Edit Habit</Text>
            
            <TouchableOpacity onPress={handleCreatePress} className='absolute mt-5 left-[70%]'>
              <BalloonSvg ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} />
              <Text className='absolute mt-6 left-[36%] text-xs font-bold'>{`Back`}</Text>
            </TouchableOpacity>
          </View>

          <Text className='ml-5 italic font-extralight'>{goal}</Text>
        </View>
        <Button title="Refetch Data" onPress={refetch.current} />
        <View className='flex-row w-full justify-center mt-2 absolute top-40'>
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleDailyPress}>
              <View className={` bg-yellow-300 ${dailyPress ?  "border-2 border-yellow-400 opacity-100": "opacity-50"} rounded-lg`}>
                <Text className='p-1 text-center'>Daily</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleWeeklyPress}>
              <View className={` bg-orange-300 ${weeklyPress ? "border-2 border-orange-400 opacity-100": "opacity-50"} rounded-lg`}>
                <Text className='p-1 text-center'>Weekly</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleMonthlyPress}>
              <View className={` bg-blue-300 ${monthlyPress ? "border-2 border-blue-400 opacity-100": "opacity-50"} rounded-lg`}>
                <Text className='p-1 text-center'>Monthly</Text>
              </View>
          </TouchableOpacity>
        </View>
        
        <Animated.View className="h-[350px] w-full absolute top-52 self-center mt-6 ">
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View className=''>
                {item.type === habitType  ? (
                  <Item item={item} />
                ) : (
                  <View />
                )}
              </View>
            )} 
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default EditHabit;
