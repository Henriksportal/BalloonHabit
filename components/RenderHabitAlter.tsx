import { View, Text, Button, TouchableOpacity, TextInput, Keyboard, Alert  } from 'react-native'
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




  const handleConfirm = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this habit?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        {
          text: 'Yes',
          onPress: () => deleteHabit(),
        },
      ],
      { cancelable: false } // Prevent the dialog from closing on touch outside
    );
  };


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
          className='font-textFontBase text-red-600'
          ref={inputRef}
          value={text}
          onChangeText={setText}
          editable={false}
          style={{fontSize:20, fontWeight: "bold",}} 
        />
      </View>
      <Text className='font-ta text-amber-950'>Started: {data.createdAt.slice(0,10)}</Text>
     
      <View className='flex-row absolute right-0'>
      

        <TouchableOpacity onPress={handleConfirm} className='mt-8 justify-end'>
          <FontAwesome5 name="trash" size={18} color="rgb(239 68 68)" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RenderHabitAlter
