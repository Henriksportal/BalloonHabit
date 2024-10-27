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
        <Text className='font-textFontBase text-xl mb-1'>{data?.description}</Text>
      </View>
      <View className='flex-row'>
        <Text className='text-[12px] italic'>Started: {data.startDate.slice(0,10)} |</Text>
        <Text className='text-[12px] italic'> Completed: {data.completed} </Text>
        <Text className='text-[12px] italic'>| Pop: {data.popped}</Text>
      </View>
    </View>
  );
};

export default RenderHabits;
