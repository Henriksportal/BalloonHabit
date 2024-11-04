import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from '../context/GlobalProvider';
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface HabitItem {
  id: string;
  title: string;
  completed: boolean;
  type: 'Daily' | 'Weekly' | 'Monthly';
  lastCompleted?: string | null;
}
 
const RenderHabits = ({ data }) => {
  return (
    <View className="flex-col items-start justify-between">
      <View className="flex-row items-center space-x-2">
        <Text className='font-textFontBase text-xl mb-1 text-amber-950'>{data?.description}</Text> 
      </View>
      <View className='flex-row'>
        <Text className='text-[12px] italic text-amber-950'>{data?.lastCompletedDate ? "Last Completed: " : "Started: "}{data?.lastCompletedDate?.slice(5,10) ?? data.createdAt.slice(0,10)  } |</Text>
        <Text className='text-[12px] italic text-amber-950'> Completed: {data.completed} </Text>
        <Text className='text-[12px] italic text-amber-950'>| Pop: {data.popped}</Text>
      </View>
    </View>
  );
};

export default RenderHabits;
