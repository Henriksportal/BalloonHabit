import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Habit = {
  id: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  description: string;
  startDate: string;
  createdAt: string;
  goal: string;
  completed: number;
  popped: number;
  status: boolean;
  
};

type HabitItemProps = {
  habit: Habit;
  onToggle: () => void;
};

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  return (
    <View className="flex-row items-center justify-between mb-2 p-2 bg-white rounded-lg">
      <View>
        <Text className={habit.status ? "line-through" : ""}>{habit.description}</Text>
        <Text className="text-xs text-gray-500">{habit.type}</Text>
        <Text className="text-xs text-gray-500">Completed: {habit.completed} | Popped: {habit.popped}</Text>
      </View>
      {habit.status ? null : (
      <TouchableOpacity onPress={onToggle}>
        <Ionicons 
          name={habit.status ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={habit.status ? "green" : "gray"} 
        />
      </TouchableOpacity>
      )}
    </View>
  );
};

export default HabitItem;
