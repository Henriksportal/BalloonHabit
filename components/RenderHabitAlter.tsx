import { View, Text, Button, TouchableOpacity, TextInput, Keyboard  } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Habit {
  id: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  description: string;
  startDate: string;
  createdAt: string;
  goal: string;
  completed: number;
  popped: number;
  status: boolean;
}

const RenderHabitAlter = ({ data, onDelete }: { data: Habit; onDelete: () => void }) => {
  const [text, setText] = useState(data.description);
  const inputRef = useRef<TextInput>(null);



  const deleteHabit = async () => {
    try {
      const value = await AsyncStorage.getItem('habits');
      if (value !== null) {
        const habits: Habit[] = JSON.parse(value);
        const updatedHabits = habits.filter(habit => habit.id !== data.id);
        await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
        onDelete(); // Notify parent component that deletion occurred
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <View className='w-full'>
      <View className='self-start mb-2'>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          editable={false}
          style={{fontSize:20, fontWeight: "bold",}} 
        />
      </View>
      <Text className='text-[12px] '>Started: {data.createdAt.slice(0,10)}</Text>
     
      <View className='flex-row absolute right-0'>
      

        <TouchableOpacity onPress={deleteHabit} className='p-2 justify-end'>
          <FontAwesome5 name="trash" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RenderHabitAlter
