
import { View, Text, Button, TouchableOpacity, TextInput, Keyboard  } from 'react-native'
import React, {useRef, useState} from 'react'
import Feather from '@expo/vector-icons/Feather';



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

const RenderHabits = ({ data }: { data: string}) => {

  const [isEditable, setIsEditable] = useState(false);
  const [text, setText] = useState(data);
  const inputRef = useRef<TextInput>(null);
 
  const handleButtonClick = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus();
    }
  };

  return (  
    
  <View className="flex-row justify-between">
    {/* <Text className="">{data}</Text> */}
    <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        editable={isEditable}
        autoFocus={true}
        
      />
    <TouchableOpacity className="" onPress={handleButtonClick}>
    {isEditable ? <Feather name="edit-2" size={24} color="black" /> : <Feather name="edit-3" size={24} color="black" /> }
     
    </TouchableOpacity>
  
       

  </View>

    
    
  )
}

export default RenderHabits