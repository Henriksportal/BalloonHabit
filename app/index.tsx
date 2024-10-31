import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, FlatList, Alert, Button, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalContext } from "../context/GlobalProvider";
import { router } from 'expo-router'

import ColoredText from '@/components/ColoredText';

interface Goal {
  id: string;
  description: string;
}

interface Habit {
  id: string;
  goal: string;
  // Add other properties as needed
}

const App = () => {
  const [goalText, setGoalText] = useState("")
  const { goal, setGoal } = useGlobalContext();
  const [renderGoals, setRenderGoals] = useState<Goal[]>([])
  const [selectGoal, setSelectGoal] = useState(false)
  const [selectGoalText, setSelectGoalText] = useState("") 
  const [continueLoading, setContinueLoading] = useState(false);
  const [editPress, setEditPress] = useState(false)
  const [goalPress, setGoalPress] = useState(true)
  const [deletePress, setDeletePress] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  

  useEffect(() => {
    loadGoals();
  }, []);

  // getGoals
  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('goals');
      if (storedGoals !== null) {
        const parsedGoals: Goal[] = JSON.parse(storedGoals);
        setRenderGoals(parsedGoals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleContinuePress = async() => {
    setContinueLoading(true);
    if (goalText === "") {
        return Alert.alert("Please Fill Goal")
      } else if (renderGoals?.length >= 3) {
        return Alert.alert("You can only have 3 goals")
      } else{
        const newGoal: Goal = {
          id: Date.now().toString(),
          description: goalText, 
        }
        try {
          const updatedGoals = [...renderGoals, newGoal];
          await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
          setRenderGoals(updatedGoals);
          
          console.log('Goal saved successfully!');
        } catch (error) {
          console.error('Error saving goal:', error);
        } 
      }
    
      setGoal(goalText)
      setContinueLoading(false);
      
    if (!continueLoading) {  
      router.push({
        pathname: '/home',
      }); 
    } else {
      return
    }
  }

  const handleGoalPress = (goalpassed: string) => {
    if (!editPress) {
      setSelectGoalText(goalpassed)
      setGoal(goalpassed)
      router.push({
        pathname: '/home',
      });
    }
  }

  const handleConfirm = (item: Goal) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to delete this goal ?`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        {
          text: 'Yes',
          onPress: () => deleteGoalPress(item),
        },
      ],
      { cancelable: false }
    );
  };

  const deleteGoalPress = async (selectedgoal: Goal) => {
    try {
      const updatedGoals = renderGoals.filter(goal => goal.id !== selectedgoal.id);
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
      setRenderGoals(updatedGoals);

      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits !== null) {
        const habits: Habit[] = JSON.parse(storedHabits);
        const updatedHabits = habits.filter(habit => habit.goal !== selectedgoal.description);
        await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      }

      const storedBalloons = await AsyncStorage.getItem('Balloons');
      if (storedBalloons !== null) {
        const balloons = JSON.parse(storedBalloons);
        delete balloons[selectedgoal.description];
        await AsyncStorage.setItem('Balloons', JSON.stringify(balloons));
      }
      const storedPoppedBalloons = await AsyncStorage.getItem('PoppedBalloons');
      if (storedPoppedBalloons !== null) {
        const poppedballoons = JSON.parse(storedPoppedBalloons);
        delete poppedballoons[selectedgoal.description];
        await AsyncStorage.setItem('PoppedBalloons', JSON.stringify(poppedballoons));
      }

      console.log('Goal, associated habits, and balloon array deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal, habits, and balloon array:', error);
    }
  }

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);   
    }
  };

  const FlatListComponent = () => {
    if (goalPress || deletePress) {
      return (
        <View className='absolute top-[45%]  self-center pl-2 pr-2 w-full  h-[50%]'>
          <FlatList
            scrollEnabled={false}
            data={renderGoals}
            renderItem={({ item }) => (
                <Item item={item} />
            )} 
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )
    }
    return null;
  }

  const Item = ({ item }: { item: Goal }) => {
    return (
      <View className='w-full'>
        <TouchableOpacity onPress={(() => {
            if(!deletePress) {
              handleGoalPress(item.description)
            } else {
              handleConfirm(item)
            }
          })} className={` mt-5  shadow-sm  p-2 w-full`}>
            <View className='flex-row self-center'>
              <Text className={`${deletePress ? 'text-red-500' : 'text-amber-950'}  shadow-sm text-3xl font-textFontBase self-center`}>{item.description}</Text>
              <View className={`${deletePress ? "opacity-0" : "opacity-75"} self-center`}>
              </View>
            </View>
        </TouchableOpacity>
      </View>
    );
  };

  const editPressInstance = () => {
    setEditPress(true)
    setGoalPress(false)
    setDeletePress(false)
  }

  const goalPressInstance = () => {
    setEditPress(false)
    setGoalPress(true)
    setDeletePress(false)
  }

  const deletePressInstance = () => {
    setEditPress(false)
    setGoalPress(false)
    setDeletePress(true)
  }

  return (
    <ImageBackground
    source={require('./../assets/backgroundsvg.png')}
    className='flex-1'
    resizeMode='cover'>
    
      
      <View className='absolute self-center top-[10%] mt-5'>
        <ColoredText />
        {/* <Text className='text-[36px] font-fatFont text-amber-950'>Habit Balloon</Text> */}
      </View>

      <View className={`absolute top-[40%] self-center ml-8 w-[80%] ${editPress ? "opacity-100": "opacity-0"}`}>
        <Text className='text-xl text-start font-textFontBase text-amber-950'>Make a new goal</Text>
        <View className='border-b-4 border-amber-950 absolute mt-10 w-full self-center p-1 rounded-xl'>
          <TextInput 
            className='text-base font-textFontBase ml-1 text-amber-950'
            value={goalText}
            onChangeText={setGoalText}
            placeholder={``}
            maxLength={35}
            placeholderTextColor=""
          />  
        </View>
        <TouchableOpacity onPress={handleContinuePress} className=' mt-40 self-center  rounded-xl p-3'>
          <Text className='font-balloonFont text-[78px] text-amber-950'>Continue</Text>
        </TouchableOpacity>
      </View>

      <View className='absolute top-[20%] mt-10  flex-row self-center'> 
        <TouchableOpacity className={`p-1 ml-1 mr-2 ${goalPress ? "border-b-4 rounded-xl border-amber-950" : ""}`} onPress={goalPressInstance}>
          <Text className={`font-fatFont text-[20px] ${goalPress ? "text-amber-950 " : "text-orange-200"}`}>Goals</Text>
        </TouchableOpacity> 

        <TouchableOpacity className={`p-1 ml-1 mr-2 ${editPress ? "border-b-4 rounded-xl border-amber-950" : ""}`} onPress={editPressInstance}>
          <Text className={`font-fatFont  text-[20px] ${editPress ? "text-amber-950" : "text-orange-200"}`}>New Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity className={`p-1 ml-1 mr-2 ${deletePress ? "border-b-4 rounded-xl border-red-500" : ""}`} onPress={deletePressInstance}>
          <Text className={`font-fatFont  text-[20px] ${deletePress ? "text-red-500" : "text-orange-200"}`}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      <FlatListComponent />
   
    </ImageBackground>
  )
}

export default App
